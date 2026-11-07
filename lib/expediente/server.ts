import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { authConfig, validPostOrigin } from "../auth/config";
import { serverAuth } from "../auth/server";
import { InputError, isUuid, normalizeDog } from "./model";

export const DOG_COLUMNS = "id,name,breed,sex,birth_date,age_months_estimate,age_estimated_at,target_weight_kg,created_at";
export const WEIGHT_COLUMNS = "id,dog_id,weight_kg,recorded_at";
const headers = { "Cache-Control": "private, no-store", "Vary": "Cookie", "X-Content-Type-Options": "nosniff" };
const unavailable = "No pudimos completar la solicitud. Actualiza los expedientes para verificar el resultado antes de repetir un guardado.";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

export async function withExpediente(request: Request, action: (client: SupabaseClient) => Promise<unknown>) {
  try {
    const settings = authConfig();
    if (!settings) throw new ApiError(503, "Mi Expediente no está disponible en este entorno.");
    if (request.method !== "GET" && !validPostOrigin(request, settings)) throw new ApiError(403, "No se autorizó esta solicitud.");
    const client = await serverAuth(true);
    const { data, error } = await client.auth.getUser();
    if (error && (!error.status || error.status >= 500)) throw new ApiError(503, "No pudimos verificar la sesión.");
    if (error || !data.user) throw new ApiError(401, "Tu sesión terminó. Vuelve a iniciar sesión.");
    return Response.json(await action(client), { headers });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : error instanceof InputError ? 400 : 503;
    const message = error instanceof ApiError || error instanceof InputError ? error.message : unavailable;
    return Response.json({ error: message }, { status, headers });
  }
}

export async function jsonInput(request: Request): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") throw new ApiError(415, "Se requiere JSON.");
  const limit = 16_384;
  if (Number(request.headers.get("content-length")) > limit) throw new ApiError(413, "La solicitud es demasiado grande.");
  const reader = request.body?.getReader();
  if (!reader) throw new InputError("Faltan los datos de la solicitud.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > limit) { await reader.cancel(); throw new ApiError(413, "La solicitud es demasiado grande."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
  catch { throw new InputError("El JSON de la solicitud no es válido."); }
}

export function dogId(id: string) {
  if (!isUuid(id)) throw new ApiError(404, "Este expediente no está disponible.");
  return id;
}

type Row = Record<string, unknown>;
type RowsResult = { data: Row[] | null; error: unknown; count: number | null };

// Follow the server's exact count, including projects with a smaller max_rows.
async function allRows(query: (start: number, end: number) => PromiseLike<RowsResult>): Promise<Row[]> {
  const rows: Row[] = [];
  while (true) {
    const result = await query(rows.length, rows.length + 499);
    if (result.error || !result.data || result.count === null) throw new ApiError(503, unavailable);
    rows.push(...result.data);
    if (rows.length >= result.count) return rows;
    if (!result.data.length) throw new ApiError(503, unavailable);
  }
}

async function weightsFor(client: SupabaseClient, ids: string[]) {
  if (!ids.length) return [];
  return allRows((start, end) => client.from("weight_entries").select(WEIGHT_COLUMNS, { count: "exact" }).in("dog_id", ids).order("recorded_at").order("id").range(start, end).retry(false).abortSignal(AbortSignal.timeout(10_000)));
}

export async function listDogs(client: SupabaseClient) {
  const dogs = await allRows((start, end) => client.from("dogs").select(DOG_COLUMNS, { count: "exact" }).order("created_at").order("id").range(start, end).retry(false).abortSignal(AbortSignal.timeout(10_000)));
  const result = [];
  for (let start = 0; start < dogs.length; start += 100) {
    const batch = dogs.slice(start, start + 100);
    const weights = await weightsFor(client, batch.map((dog) => String(dog.id)));
    result.push(...batch.map((dog) => normalizeDog(dog, weights.filter((weight) => weight.dog_id === dog.id))));
  }
  return result;
}

export async function loadDog(client: SupabaseClient, id: string) {
  const { data, error } = await client.from("dogs").select(DOG_COLUMNS).eq("id", dogId(id)).abortSignal(AbortSignal.timeout(10_000)).maybeSingle().retry(false);
  if (error) throw new ApiError(503, unavailable);
  if (!data) throw new ApiError(404, "Este expediente no está disponible.");
  return normalizeDog(data, await weightsFor(client, [id]));
}

export async function updatedDog(client: SupabaseClient, id: string, profile: Row) {
  const { data, error } = await client.from("dogs").update(profile).eq("id", id).select(DOG_COLUMNS).abortSignal(AbortSignal.timeout(10_000)).maybeSingle().retry(false);
  if (error) throw new ApiError(503, unavailable);
  if (!data) throw new ApiError(404, "Este expediente no está disponible.");
  return normalizeDog(data, await weightsFor(client, [id]));
}

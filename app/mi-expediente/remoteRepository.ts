import { isDogResponse, isRecord, isUuid } from "../../lib/expediente/model";
import type { PackRepository } from "./repository";
import type { Dog } from "./types";

const uncertain = "No pudimos confirmar el guardado. Actualiza los expedientes antes de volver a intentarlo.";
class RequestFailure extends Error {}

export function createRemoteRepository(transport: typeof fetch = (...args) => fetch(...args)): PackRepository {
  let uncertainWrite = false;
  let uncertaintyVersion = 0;
  function markUncertain() { uncertainWrite = true; uncertaintyVersion++; }
  async function request(path: string, method = "GET", body?: unknown) {
    const writing = method !== "GET";
    if (writing && uncertainWrite) throw new Error(uncertain);
    try {
      const response = await transport(`/api/mi-expediente/dogs${path}`, {
        method, credentials: "same-origin", cache: "no-store", signal: AbortSignal.timeout(30_000),
        headers: body === undefined ? {} : { "Content-Type": "application/json" },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      if (!response.ok) {
        if (writing && response.status >= 500) markUncertain();
        const messages: Record<number, string> = { 400: "Revisa los datos antes de guardar.", 401: "Tu sesión terminó. Vuelve a iniciar sesión.", 403: "No se autorizó esta solicitud.", 404: "Este expediente no está disponible.", 413: "La solicitud es demasiado grande.", 415: "El formato de la solicitud no es válido." };
        throw new RequestFailure(messages[response.status] ?? (writing ? uncertain : "No pudimos cargar los expedientes. Inténtalo de nuevo."));
      }
      const result: unknown = await response.json();
      if (!isRecord(result)) throw new Error("Invalid response");
      return result;
    } catch (error) {
      if (error instanceof RequestFailure) throw error;
      if (writing) {
        markUncertain();
        throw new Error(uncertain);
      }
      throw new Error("No pudimos conectar con los expedientes.");
    }
  }
  const idPath = (id: string) => {
    if (!isUuid(id)) throw new Error("Este expediente no está disponible.");
    return `/${id}`;
  };
  async function mutate(path: string, method: string, body: unknown): Promise<Dog> {
    const result = await request(path, method, body);
    if (!isDogResponse(result.dog)) { markUncertain(); throw new Error(uncertain); }
    return result.dog;
  }
  return {
    storageDescription: "Los nuevos expedientes se guardan en tu cuenta y están disponibles al iniciar sesión en otros dispositivos.",
    async list() {
      const version = uncertaintyVersion;
      const result = await request("");
      if (!Array.isArray(result.dogs) || !result.dogs.every(isDogResponse)) throw new Error("No pudimos leer los expedientes. No se han sustituido por datos locales.");
      if (version === uncertaintyVersion) uncertainWrite = false;
      return result.dogs;
    },
    create: (values) => mutate("", "POST", values),
    update: async (id, values) => mutate(idPath(id), "PATCH", values),
    recordWeight: async (id, value) => mutate(`${idPath(id)}/weights`, "POST", { value }),
  };
}

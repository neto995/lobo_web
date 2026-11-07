import { test, expect, type APIRequestContext, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

const status = JSON.parse(readFileSync(process.env.LOCAL_SUPABASE_STATUS_JSON!, "utf8"));
const api = new URL(status.API_URL);
if (api.origin !== "http://127.0.0.1:55441") throw new Error("Local tests refuse remote targets.");
const origin = "http://127.0.0.1:3102";
const form = { name: "Perfil local", breed: "", sex: "unknown", ageMode: "unknown", birthDate: "", ageYears: "", ageMonths: "", ageEstimatedAt: "", initialWeight: "12.4", targetWeight: "12" };
const rpcInput = { p_name: "RPC local", p_breed: null, p_sex: "unknown", p_target_weight_kg: 12, p_birth_date: null, p_age_months_estimate: null, p_age_estimated_at: null, p_initial_weight_kg: 12.4 };

async function account(request: APIRequestContext) {
  const email = `local-${randomUUID()}@example.test`;
  const password = `Local-only-${randomUUID()}`;
  const response = await request.post(`${api.origin}/auth/v1/signup`, { headers: { apikey: status.PUBLISHABLE_KEY }, data: { email, password } });
  expect(response.status()).toBe(200);
  const data = await response.json();
  // Local Auth must auto-confirm fictional addresses; never use real mail delivery.
  expect(typeof data.access_token).toBe("string");
  expect(data.user.email_confirmed_at).toBeTruthy();
  return { email, password, id: data.user.id as string, headers: { apikey: status.PUBLISHABLE_KEY as string, authorization: `Bearer ${data.access_token}`, Prefer: "return=representation" } };
}

async function login(page: Page, user: { email: string; password: string }) {
  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill(user.email);
  await page.getByLabel("Contraseña", { exact: true }).fill(user.password);
  await page.getByRole("button", { name: "Iniciar sesión", exact: true }).click();
  await expect(page).toHaveURL(/\/mi-expediente$/);
}

test("Supabase local real: SSR, alta atómica, edición, peso y persistencia entre sesiones y navegadores", async ({ request, page, context, browser }) => {
  const owner = await account(request);
  await login(page, owner);
  const created = await context.request.post("/api/mi-expediente/dogs", { headers: { origin }, data: form });
  expect(created.status()).toBe(200);
  const dog = (await created.json()).dog;
  expect(dog.weights).toHaveLength(1);
  expect(dog.weights[0].value).toBe(12.4);
  const weighted = await context.request.post(`/api/mi-expediente/dogs/${dog.id}/weights`, { headers: { origin }, data: { value: 12.1 } });
  expect(weighted.status()).toBe(200);
  const history = (await weighted.json()).dog.weights;
  expect(history.map((entry: { value: number }) => entry.value)).toEqual([12.4, 12.1]);
  const edit = await context.request.patch(`/api/mi-expediente/dogs/${dog.id}`, { headers: { origin }, data: { ...form, name: "Perfil persistente", initialWeight: "99", ageMode: "estimate", ageYears: "3", ageMonths: "2" } });
  expect(edit.status()).toBe(200);
  const estimated = (await edit.json()).dog;
  expect(estimated.weights).toEqual(history);
  expect(estimated.ageMonthsEstimate).toBe(38);
  expect(estimated.birthDate).toBeNull();
  const unrelated = await context.request.patch(`/api/mi-expediente/dogs/${dog.id}`, { headers: { origin }, data: { ...form, name: "Perfil persistente", breed: "Mestizo", ageMode: "estimate", ageYears: "3", ageMonths: "2", ageEstimatedAt: estimated.ageEstimatedAt } });
  expect(unrelated.status()).toBe(200);
  expect((await unrelated.json()).dog.ageEstimatedAt).toBe(estimated.ageEstimatedAt);
  await page.reload();
  await expect(page.getByText("Perfil persistente", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page).toHaveURL(/\/login$/);
  expect((await context.request.get("/api/mi-expediente/dogs")).status()).toBe(401);
  await page.goto("/mi-expediente");
  await expect(page).toHaveURL(/\/login$/);
  await login(page, owner);
  const saved = (await (await context.request.get(`/api/mi-expediente/dogs/${dog.id}`)).json()).dog;
  expect(saved.weights).toEqual(history);
  const otherDevice = await browser.newContext({ baseURL: origin });
  try {
    await login(await otherDevice.newPage(), owner);
    expect((await (await otherDevice.request.get(`/api/mi-expediente/dogs/${dog.id}`)).json()).dog).toEqual(saved);
  } finally { await otherDevice.close(); }
});

test("Supabase local real: API rechaza redondeos y persiste el objetivo vacío como SQL NULL", async ({ request, page, context }) => {
  const owner = await account(request);
  await login(page, owner);
  for (const changes of [{ initialWeight: "12.46" }, { initialWeight: "" }, { targetWeight: "12.46" }]) {
    expect((await context.request.post("/api/mi-expediente/dogs", { headers: { origin }, data: { ...form, targetWeight: "", ...changes } })).status()).toBe(400);
  }
  const before = await request.get(`${api.origin}/rest/v1/dogs?select=id`, { headers: owner.headers });
  expect(before.status()).toBe(200);
  expect(await before.json()).toEqual([]);
  const created = await context.request.post("/api/mi-expediente/dogs", { headers: { origin }, data: { ...form, targetWeight: "" } });
  expect(created.status()).toBe(200);
  const dog = (await created.json()).dog;
  expect(dog.targetWeight).toBeNull();
  expect(dog.weights[0].value).toBe(12.4);
  const path = `/api/mi-expediente/dogs/${dog.id}`;
  expect((await context.request.post(`${path}/weights`, { headers: { origin }, data: { value: 12.46 } })).status()).toBe(400);
  expect((await (await context.request.get(path)).json()).dog.weights).toEqual(dog.weights);
  expect((await context.request.post(`${path}/weights`, { headers: { origin }, data: { value: 12.4 } })).status()).toBe(200);
  const stored = await request.get(`${api.origin}/rest/v1/dogs?id=eq.${dog.id}&select=target_weight_kg`, { headers: owner.headers });
  expect(stored.status()).toBe(200);
  expect(await stored.json()).toEqual([{ target_weight_kg: null }]);
  const weights = await request.get(`${api.origin}/rest/v1/weight_entries?dog_id=eq.${dog.id}&select=weight_kg`, { headers: owner.headers });
  expect(weights.status()).toBe(200);
  expect(await weights.json()).toEqual([{ weight_kg: 12.4 }, { weight_kg: 12.4 }]);
});

test("Supabase local real: RLS bloquea lectura y escritura cruzada por API Next y PostgREST", async ({ request, page, context, browser }) => {
  const a = await account(request);
  const b = await account(request);
  await login(page, a);
  const created = await context.request.post("/api/mi-expediente/dogs", { headers: { origin }, data: form });
  expect(created.status()).toBe(200);
  const own = (await created.json()).dog;
  const second = await browser.newContext({ baseURL: origin });
  try {
    await login(await second.newPage(), b);
    expect((await (await second.request.get("/api/mi-expediente/dogs")).json()).dogs).toEqual([]);
    expect((await second.request.get(`/api/mi-expediente/dogs/${own.id}`)).status()).toBe(404);
    expect((await second.request.patch(`/api/mi-expediente/dogs/${own.id}`, { headers: { origin }, data: { ...form, name: "No autorizado" } })).status()).toBe(404);
    expect((await second.request.post(`/api/mi-expediente/dogs/${own.id}/weights`, { headers: { origin }, data: { value: 50 } })).status()).toBe(404);
    for (const resource of [`dogs?id=eq.${own.id}`, `weight_entries?dog_id=eq.${own.id}`]) {
      const response = await request.get(`${api.origin}/rest/v1/${resource}`, { headers: b.headers });
      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual([]);
    }
    const denied = await request.post(`${api.origin}/rest/v1/weight_entries`, { headers: b.headers, data: { dog_id: own.id, weight_kg: 50, recorded_at: new Date().toISOString() } });
    expect(denied.status()).toBe(403);
    const patch = await request.patch(`${api.origin}/rest/v1/dogs?id=eq.${own.id}`, { headers: b.headers, data: { name: "No autorizado" } });
    expect(patch.status()).toBe(200);
    expect(await patch.json()).toEqual([]);
    const remove = await request.delete(`${api.origin}/rest/v1/dogs?id=eq.${own.id}`, { headers: b.headers });
    expect(remove.status()).toBe(200);
    expect(await remove.json()).toEqual([]);
    expect((await (await context.request.get(`/api/mi-expediente/dogs/${own.id}`)).json()).dog).toEqual(own);
  } finally { await second.close(); }
});

test("Supabase local real: RPC rechaza anon y cancela el perro cuando falla su primer peso", async ({ request }) => {
  const a = await account(request);
  const rejected = await request.post(`${api.origin}/rest/v1/rpc/create_dog_with_initial_weight`, { headers: a.headers, data: { ...rpcInput, p_initial_weight_kg: 0 } });
  expect(rejected.status()).toBe(400);
  for (const table of ["dogs", "weight_entries"]) {
    const response = await request.get(`${api.origin}/rest/v1/${table}?select=id`, { headers: a.headers });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual([]);
  }
  const anonymous = await request.post(`${api.origin}/rest/v1/rpc/create_dog_with_initial_weight`, { headers: { apikey: status.PUBLISHABLE_KEY }, data: rpcInput });
  expect([401, 403]).toContain(anonymous.status());
  const accepted = await request.post(`${api.origin}/rest/v1/rpc/create_dog_with_initial_weight`, { headers: a.headers, data: rpcInput });
  expect(accepted.status()).toBe(200);
  const result = await accepted.json();
  expect(result.dog.user_id).toBe(a.id);
  expect(result.weight.dog_id).toBe(result.dog.id);
});

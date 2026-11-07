import { test, expect, type APIRequestContext, type Page } from "@playwright/test";

// These tests use the HTTP double. Real RLS/atomicity evidence comes from local PostgreSQL tests.
const origin = "http://127.0.0.1:3100";
const fake = "http://127.0.0.1:54329";
const password = "test-password-123";
const legacyKey = "lobo.mi-expediente.v1";
const accountLegacyKey = "lobo.mi-expediente.auth-v1.11111111-1111-4111-8111-111111111111";
const legacyValue = JSON.stringify({ version: 1, dogs: [{ id: "legacy-dog", name: "Anterior sin importar", breed: "Mestizo", age: "4-5 años", sex: "Hembra", dailyPortion: 250, targetWeight: 11, photoUrl: "https://example.invalid/original.jpg", weights: [{ id: "legacy-weight", value: 12, recordedAt: "2025-03-01T12:00:00.000Z" }] }] }, null, 2);
const baseForm = { name: "Nala", breed: "", sex: "unknown", ageMode: "unknown", birthDate: "", ageYears: "", ageMonths: "", ageEstimatedAt: "", initialWeight: "12", targetWeight: "11" };

async function login(page: Page, email = "a@example.com") {
  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Iniciar sesión", exact: true }).click();
  await expect(page).toHaveURL(/\/mi-expediente$/);
  await expect(page.getByRole("button", { name: "Cerrar sesión" })).toBeVisible();
}

async function createDog(request: APIRequestContext, changes: Record<string, unknown> = {}) {
  const response = await request.post("/api/mi-expediente/dogs", { headers: { origin }, data: { ...baseForm, ...changes } });
  expect(response.ok(), await response.text()).toBe(true);
  return (await response.json()).dog;
}

async function openCreate(page: Page, name = "Nala") {
  await page.getByRole("button", { name: "Crear primer expediente" }).click();
  await page.getByLabel("Nombre*").fill(name);
  await page.getByLabel("Peso inicial (kg)*").fill("12");
  await page.getByLabel("Peso objetivo (kg) (opcional)").fill("11");
}

test.beforeEach(async ({ request }) => { await request.post(`${fake}/__reset`); });

test("persistencia simulada: crear, editar y agregar peso conserva ambos espacios legacy y sobrevive logout/login", async ({ page, context }) => {
  await page.goto("/login");
  await page.evaluate(({ keys, value }) => { for (const key of keys) localStorage.setItem(key, value); }, { keys: [legacyKey, accountLegacyKey], value: legacyValue });
  await page.addInitScript(() => {
    const original = Storage.prototype.getItem;
    const reads: string[] = [];
    Object.defineProperty(window, "__legacyReads", { value: reads });
    Storage.prototype.getItem = function (key: string) {
      if (key.startsWith("lobo.mi-expediente.")) reads.push(key);
      return original.call(this, key);
    };
  });
  await login(page);
  await expect(page.getByText(/no se importaron automáticamente/)).toBeVisible();
  await expect(page.getByText(/Pueden conservarse en este navegador si su almacenamiento no ha sido eliminado/)).toBeVisible();
  await expect(page.getByText("Anterior sin importar", { exact: true })).toHaveCount(0);
  await openCreate(page);
  await expect(page.getByLabel(/Porción diaria/)).toHaveCount(0);
  await expect(page.getByLabel(/URL de fotografía/)).toHaveCount(0);
  await page.getByRole("button", { name: "Crear expediente", exact: true }).click();
  await expect(page.getByText("Nala", { exact: true }).first()).toBeVisible();
  const created = (await (await context.request.get("/api/mi-expediente/dogs")).json()).dogs[0];
  expect(created.weights).toHaveLength(1);
  expect(created.weights[0].value).toBe(12);
  expect(created).not.toHaveProperty("dailyPortion");
  expect(created).not.toHaveProperty("photoUrl");
  await page.getByRole("button", { name: /Registrar nuevo peso/ }).click();
  await page.getByLabel("Peso actual").fill("12.4");
  await page.getByRole("button", { name: "Guardar en su expediente" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Peso de Nala registrado." })).toBeVisible();
  await page.getByRole("button", { name: /Corregir datos/ }).click();
  await expect(page.getByLabel("Peso inicial (kg)*")).toHaveCount(0);
  await page.getByLabel("Nombre*").fill("Nala editada");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByText("Nala editada", { exact: true }).first()).toBeVisible();
  const saved = (await (await context.request.get(`/api/mi-expediente/dogs/${created.id}`)).json()).dog;
  expect(saved.weights.map((entry: { value: number }) => entry.value)).toEqual([12, 12.4]);
  expect(saved.weights[0]).toEqual(created.weights[0]);
  expect(saved.weights.map((entry: { recordedAt: string }) => entry.recordedAt)).toEqual(saved.weights.map((entry: { recordedAt: string }) => entry.recordedAt).sort());
  expect(await page.evaluate(() => (window as unknown as Window & { __legacyReads: string[] }).__legacyReads)).toEqual([]);
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await login(page);
  await expect(page.getByText("Nala editada", { exact: true }).first()).toBeVisible();
  expect(await page.evaluate(({ keys }) => keys.map((key) => localStorage.getItem(key)), { keys: [legacyKey, accountLegacyKey] })).toEqual([legacyValue, legacyValue]);
});

test("formulario: objetivo opcional y décimas exactas en alta y registro de peso", async ({ page, context }) => {
  await login(page);
  await openCreate(page, "Sin objetivo");
  await page.getByLabel("Peso objetivo (kg) (opcional)").fill("");
  const initial = page.getByLabel("Peso inicial (kg)*");
  await initial.fill("");
  await page.getByRole("button", { name: "Crear expediente", exact: true }).click();
  expect(await initial.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
  await initial.fill("12.46");
  await page.getByRole("button", { name: "Crear expediente", exact: true }).click();
  expect(await initial.evaluate((input: HTMLInputElement) => input.validity.stepMismatch)).toBe(true);
  expect((await (await context.request.get("/api/mi-expediente/dogs")).json()).dogs).toEqual([]);
  await initial.fill("12.4");
  await page.getByRole("button", { name: "Crear expediente", exact: true }).click();
  await expect(page.getByText("Sin objetivo", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("definition").filter({ hasText: /^No definido$/ })).toBeVisible();
  const dog = (await (await context.request.get("/api/mi-expediente/dogs")).json()).dogs[0];
  expect(dog.targetWeight).toBeNull();
  expect(dog.weights[0].value).toBe(12.4);
  await page.getByRole("button", { name: /Corregir datos/ }).click();
  await expect(page.getByLabel("Peso objetivo (kg) (opcional)")).toHaveValue("");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByRole("heading", { name: "Editar a Sin objetivo" })).toHaveCount(0);
  await page.getByRole("button", { name: /Registrar nuevo peso/ }).click();
  const weight = page.getByLabel("Peso actual");
  await weight.fill("12.46");
  await page.getByRole("button", { name: "Guardar en su expediente" }).click();
  expect(await weight.evaluate((input: HTMLInputElement) => input.validity.stepMismatch)).toBe(true);
  expect((await (await context.request.get(`/api/mi-expediente/dogs/${dog.id}`)).json()).dog.weights).toHaveLength(1);
  await weight.fill("12.4");
  await page.getByRole("button", { name: "Guardar en su expediente" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Peso de Sin objetivo registrado." })).toBeVisible();
  const saved = (await (await context.request.get(`/api/mi-expediente/dogs/${dog.id}`)).json()).dog;
  expect(saved.targetWeight).toBeNull();
  expect(saved.weights.map((entry: { value: number }) => entry.value)).toEqual([12.4, 12.4]);
});

test("API: rechaza precisión extra sin insertar y conserva objetivo NULL", async ({ page, context }) => {
  await login(page);
  for (const changes of [{ initialWeight: "12.46" }, { initialWeight: "" }, { targetWeight: "12.46" }]) {
    expect((await context.request.post("/api/mi-expediente/dogs", { headers: { origin }, data: { ...baseForm, targetWeight: "", ...changes } })).status()).toBe(400);
  }
  expect((await (await context.request.get("/api/mi-expediente/dogs")).json()).dogs).toEqual([]);
  const dog = await createDog(context.request, { initialWeight: "12.4", targetWeight: "" });
  expect(dog.targetWeight).toBeNull();
  expect(dog.weights[0].value).toBe(12.4);
  const path = `/api/mi-expediente/dogs/${dog.id}`;
  expect((await context.request.post(`${path}/weights`, { headers: { origin }, data: { value: 12.46 } })).status()).toBe(400);
  expect((await (await context.request.get(path)).json()).dog.weights).toEqual(dog.weights);
  const accepted = await context.request.post(`${path}/weights`, { headers: { origin }, data: { value: 12.4 } });
  expect(accepted.status()).toBe(200);
  expect((await accepted.json()).dog.weights.map((entry: { value: number }) => entry.value)).toEqual([12.4, 12.4]);
  const edited = await context.request.patch(path, { headers: { origin }, data: { ...baseForm, targetWeight: "" } });
  expect(edited.status()).toBe(200);
  expect((await edited.json()).dog.targetWeight).toBeNull();
});

test("persistencia simulada: formulario acepta nacimiento, estimación y edad desconocida sin transformar fechas", async ({ page, context }) => {
  await login(page);
  await openCreate(page, "Edad conocida");
  await page.getByRole("radio", { name: "Conozco su fecha de nacimiento (recomendado)", exact: true }).check();
  await page.getByLabel("Nacimiento", { exact: true }).fill("2022-03-04");
  await page.getByRole("button", { name: "Crear expediente", exact: true }).click();
  await expect(page.getByText("Edad conocida", { exact: true }).first()).toBeVisible();
  const known = (await (await context.request.get("/api/mi-expediente/dogs")).json()).dogs[0];
  expect(known).toMatchObject({ birthDate: "2022-03-04", ageMonthsEstimate: null, ageEstimatedAt: null });
  await page.getByRole("button", { name: /Corregir datos/ }).click();
  await page.getByRole("radio", { name: "Sé su edad aproximada", exact: true }).check();
  await page.getByLabel("Años", { exact: true }).fill("3");
  await page.getByLabel("Meses", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByRole("heading", { name: "Editar a Edad conocida" })).toHaveCount(0);
  const estimated = (await (await context.request.get(`/api/mi-expediente/dogs/${known.id}`)).json()).dog;
  expect(estimated).toMatchObject({ birthDate: null, ageMonthsEstimate: 38 });
  expect(estimated.ageEstimatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  await page.getByRole("button", { name: /Corregir datos/ }).click();
  await page.getByLabel("Raza", { exact: true }).fill("Mestizo");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByRole("heading", { name: "Editar a Edad conocida" })).toHaveCount(0);
  const edited = (await (await context.request.get(`/api/mi-expediente/dogs/${known.id}`)).json()).dog;
  expect(edited.ageEstimatedAt).toBe(estimated.ageEstimatedAt);
  expect(edited.ageMonthsEstimate).toBe(38);
  await page.getByRole("button", { name: /Corregir datos/ }).click();
  await page.getByRole("radio", { name: "No conozco su edad", exact: true }).check();
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByRole("heading", { name: "Editar a Edad conocida" })).toHaveCount(0);
  const unknown = (await (await context.request.get(`/api/mi-expediente/dogs/${known.id}`)).json()).dog;
  expect(unknown).toMatchObject({ birthDate: null, ageMonthsEstimate: null, ageEstimatedAt: null });
  expect(unknown.weights).toEqual(known.weights);
});

test("persistencia simulada: dos sesiones no comparten perfiles ni permiten escribir un ID ajeno", async ({ page, browser, context }) => {
  await login(page);
  const own = await createDog(context.request, { name: "Solo A" });
  const second = await browser.newContext({ baseURL: origin });
  try {
    const other = await second.newPage();
    await login(other, "b@example.com");
    await expect(other.getByRole("button", { name: "Crear primer expediente" })).toBeVisible();
    expect((await (await second.request.get("/api/mi-expediente/dogs")).json()).dogs).toEqual([]);
    expect((await second.request.get(`/api/mi-expediente/dogs/${own.id}`)).status()).toBe(404);
    expect((await second.request.patch(`/api/mi-expediente/dogs/${own.id}`, { headers: { origin }, data: { ...baseForm, name: "Alterado" } })).status()).toBe(404);
    expect((await second.request.post(`/api/mi-expediente/dogs/${own.id}/weights`, { headers: { origin }, data: { value: 99 } })).status()).toBe(404);
    const unchanged = (await (await context.request.get(`/api/mi-expediente/dogs/${own.id}`)).json()).dog;
    expect(unchanged.name).toBe("Solo A");
    expect(unchanged.weights).toEqual(own.weights);
    const b = await createDog(second.request, { name: "Solo B" });
    expect((await context.request.get(`/api/mi-expediente/dogs/${b.id}`)).status()).toBe(404);
  } finally { await second.close(); }
});

test("API autenticada: rechaza ausencia de sesión, origen externo, identidad inyectada y datos inválidos", async ({ page, context, request }) => {
  expect((await request.get("/api/mi-expediente/dogs")).status()).toBe(401);
  expect((await request.post("/api/mi-expediente/dogs", { headers: { origin }, data: baseForm })).status()).toBe(401);
  await login(page);
  expect((await context.request.post("/api/mi-expediente/dogs", { headers: { origin: "https://evil.example" }, data: baseForm })).status()).toBe(403);
  expect((await context.request.post("/api/mi-expediente/dogs", { headers: { origin }, data: { ...baseForm, user_id: "22222222-2222-4222-8222-222222222222" } })).status()).toBe(400);
  expect((await context.request.post("/api/mi-expediente/dogs", { headers: { origin, "content-type": "application/json" }, data: "{" })).status()).toBe(400);
  for (const invalid of [{ initialWeight: "0" }, { ageMode: "estimate", ageYears: "2", ageMonths: "12" }, { ageMode: "birth_date", birthDate: "2024-02-30" }]) {
    const response = await context.request.post("/api/mi-expediente/dogs", { headers: { origin }, data: { ...baseForm, ...invalid } });
    expect(response.status()).toBe(400);
    expect(await response.text()).not.toMatch(/postgres|23514|stack|user_id/i);
  }
  const list = await context.request.get("/api/mi-expediente/dogs");
  expect(list.headers()["cache-control"]).toContain("no-store");
  expect((await list.json()).dogs).toEqual([]);
});

test("persistencia simulada: fallo al listar muestra error sin fingir una lista vacía ni usar legacy", async ({ page, request }) => {
  await request.post(`${fake}/__database-unavailable`, { data: { enabled: true } });
  await login(page);
  await expect(page.getByRole("alert").filter({ hasText: "No pudimos cargar tus datos" })).toBeVisible();
  await expect(page.getByRole("button", { name: "+ Nuevo perro", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Crear primer expediente" })).toHaveCount(0);
  await expect(page.getByText(/Internal test database detail/)).toHaveCount(0);
  await request.post(`${fake}/__database-unavailable`, { data: { enabled: false } });
  await page.getByRole("button", { name: "Intentar de nuevo" }).click();
  await expect(page.getByRole("button", { name: "Crear primer expediente" })).toBeVisible();
  await expect(page.getByRole("button", { name: "+ Nuevo perro", exact: true })).toBeEnabled();
});

test("persistencia simulada: error de escritura conserva el formulario y no anuncia un guardado", async ({ page, context, request }) => {
  await login(page);
  await openCreate(page, "Sin guardar");
  await request.post(`${fake}/__database-unavailable`, { data: { enabled: true } });
  await page.getByRole("button", { name: "Crear expediente", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "No pudimos confirmar el guardado" })).toBeVisible();
  await expect(page.getByLabel("Nombre*")).toHaveValue("Sin guardar");
  await expect(page.getByRole("status").filter({ hasText: "ya tiene expediente" })).toHaveCount(0);
  await expect(page.getByText(/Internal test database detail/)).toHaveCount(0);
  await request.post(`${fake}/__database-unavailable`, { data: { enabled: false } });
  expect((await (await context.request.get("/api/mi-expediente/dogs")).json()).dogs).toEqual([]);
});

test("persistencia simulada: respuesta perdida tras guardar no anuncia éxito ni reintenta automáticamente", async ({ page, context }) => {
  await login(page);
  await openCreate(page, "Respuesta perdida");
  let attempts = 0;
  await page.route("**/api/mi-expediente/dogs", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    attempts++;
    const response = await route.fetch();
    expect(response.ok()).toBe(true);
    await route.abort("failed");
  });
  await page.getByRole("button", { name: "Crear expediente", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "No pudimos confirmar el guardado" })).toBeVisible();
  await expect(page.getByLabel("Nombre*")).toHaveValue("Respuesta perdida");
  await expect(page.getByRole("status").filter({ hasText: "ya tiene expediente" })).toHaveCount(0);
  await page.getByRole("button", { name: "Crear expediente", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "No pudimos confirmar el guardado" })).toBeVisible();
  expect(attempts).toBe(1);
  const saved = (await (await context.request.get("/api/mi-expediente/dogs")).json()).dogs;
  expect(saved).toHaveLength(1);
  expect(saved[0].name).toBe("Respuesta perdida");
});

test("persistencia simulada: historial paginado conserva más de mil mediciones y su orden", async ({ page, context, request }) => {
  await login(page);
  const dog = await createDog(context.request);
  expect((await request.post(`${fake}/__seed-history`, { data: { dogId: dog.id, count: 1005 } })).ok()).toBe(true);
  const list = (await (await context.request.get("/api/mi-expediente/dogs")).json()).dogs;
  expect(list[0].weights).toHaveLength(1005);
  const detail = (await (await context.request.get(`/api/mi-expediente/dogs/${dog.id}`)).json()).dog;
  expect(detail.weights).toEqual(list[0].weights);
  expect(new Set(detail.weights.map((entry: { id: string }) => entry.id)).size).toBe(1005);
  const dates = detail.weights.map((entry: { recordedAt: string }) => entry.recordedAt);
  expect(dates).toEqual([...dates].sort());
  await page.reload();
  await page.getByText("Todos los registros (1005)", { exact: true }).click();
  await expect(page.getByRole("table", { name: "Historial completo de peso de Nala" }).locator("tbody tr")).toHaveCount(1005);
});

test("persistencia simulada: expediente y formulario no desbordan móvil o escritorio", async ({ page, context }) => {
  await login(page);
  await createDog(context.request, { name: "Nombre largo para revisar el perfil" });
  await page.reload();
  await expect(page.getByText("Nombre largo para revisar el perfil", { exact: true }).first()).toBeVisible();
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 850 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/persistence-${width}.png`, fullPage: true });
    await page.getByRole("button", { name: /Corregir datos/ }).click();
    await page.getByRole("radio", { name: "Sé su edad aproximada", exact: true }).check();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/persistence-form-${width}.png`, fullPage: true });
    await page.getByRole("button", { name: "Cerrar", exact: true }).click();
  }
});

import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && context.parentURL?.endsWith(".ts") && !/\.[a-z]+$/.test(specifier)) return nextResolve(`${specifier}.ts`, context);
  return nextResolve(specifier, context);
} });
const { profileInput, normalizeDog, isDogResponse, weightValue } = await import("../../../lib/expediente/model.ts");
const { createRemoteRepository } = await import("../remoteRepository.ts");
const { createPackRepository } = await import("../repository.ts");
const { emptyForm } = await import("../types.ts");
const form = { ...emptyForm, name: " Nala ", targetWeight: "12", initialWeight: "12.4" };
const id = "11111111-1111-4111-8111-111111111111";
const row = { id, name: "Nala", breed: null, sex: "unknown", birth_date: null, age_months_estimate: null, age_estimated_at: null, target_weight_kg: null };
const w = (n, at = "2026-01-01T12:00:00.000Z") => ({ id: `22222222-2222-4222-8222-${String(n).padStart(12, "0")}`, dog_id: id, weight_kg: "12.4", recorded_at: at });
const dog = normalizeDog(row, [w(1)]);

test("perfil remoto admite edades exactas, estimadas o desconocidas sin inventar nacimiento", () => {
  const unknown = profileInput(form, undefined, "2026-10-18");
  assert.equal(unknown.profile.name, "Nala");
  assert.equal(unknown.initialWeight, 12.4);
  assert.equal(unknown.profile.birth_date, null);
  assert.equal(unknown.profile.age_months_estimate, null);
  assert.equal(unknown.profile.age_estimated_at, null);
  const estimated = profileInput({ ...form, ageMode: "estimate", ageYears: "3", ageMonths: "2" }, undefined, "2026-10-18");
  assert.equal(estimated.profile.age_months_estimate, 38);
  assert.equal(estimated.profile.age_estimated_at, "2026-10-18");
  assert.equal(estimated.profile.birth_date, null);
  const known = profileInput({ ...form, ageMode: "birth_date", birthDate: "2024-02-29" }, undefined, "2026-10-18");
  assert.equal(known.profile.birth_date, "2024-02-29");
  assert.equal(known.profile.age_months_estimate, null);
});

test("edición conserva la referencia original y rechaza referencias inventadas", () => {
  const existing = { ...dog, ageMonthsEstimate: 38, ageEstimatedAt: "2025-01-02" };
  const edit = { ...form, ageMode: "estimate", ageYears: "3", ageMonths: "2", ageEstimatedAt: "2025-01-02", initialWeight: "9999" };
  assert.equal(profileInput(edit, existing, "2026-10-18").profile.age_estimated_at, "2025-01-02");
  assert.equal(profileInput(edit, existing).initialWeight, null);
  assert.throws(() => profileInput({ ...edit, ageEstimatedAt: "2020-01-01" }, existing));
  assert.throws(() => profileInput(edit));
  assert.equal(profileInput({ ...edit, ageEstimatedAt: "", ageYears: "4" }, existing, "2026-10-18").profile.age_estimated_at, "2026-10-18");
});

test("rechaza campos de propiedad, legacy y validaciones inválidas antes de PostgreSQL", () => {
  for (const change of [{ user_id: id }, { dailyPortion: "300" }, { photoUrl: "https://example.com/a.jpg" }, { name: " " }, { targetWeight: "NaN" }, { initialWeight: "151" }, { sex: "Hembra" }, { ageMode: "estimate", ageYears: "1", ageMonths: "12" }, { ageMode: "estimate", ageYears: "1.2", ageMonths: "0" }, { ageMode: "birth_date", birthDate: "2024-02-30" }, { ageMode: "birth_date", birthDate: "2099-01-01" }]) assert.throws(() => profileInput({ ...form, ...change }));
  for (const invalid of [null, [], {}, "string"]) assert.throws(() => profileInput(invalid));
  for (const invalid of [NaN, Infinity, 0, 150.1, "12"]) assert.throws(() => weightValue(invalid));
  assert.equal(profileInput({ ...form, targetWeight: "" }, dog).profile.target_weight_kg, null);
});

test("normaliza NUMERIC y NULL, ordena sin perder historia y rechaza pesos de otro perro", () => {
  const normalized = normalizeDog(row, [w(2, "2026-02-01T00:00:00Z"), w(3), w(1)]);
  assert.equal(normalized.breed, null);
  assert.equal(normalized.targetWeight, null);
  assert.equal(normalizeDog({ ...row, target_weight_kg: "12.4" }, []).targetWeight, 12.4);
  assert.deepEqual(normalized.weights.map((entry) => entry.id), [w(1).id, w(3).id, w(2).id]);
  assert.equal(normalized.weights[0].value, 12.4);
  assert.deepEqual(normalizeDog(row, []).weights, []);
  assert.throws(() => normalizeDog(row, [{ ...w(1), dog_id: "another" }]));
  assert.throws(() => normalizeDog(row, [w(1), w(1)]));
  assert.throws(() => normalizeDog({ ...row, age_months_estimate: 12 }, []));
  assert.equal(isDogResponse({ ...dog, weights: [{}] }), false);
  assert.equal(isDogResponse({ ...dog, targetWeight: "12" }), false);
  assert.equal(isDogResponse({ ...dog, weights: [{ ...dog.weights[0], value: "12" }] }), false);
});

test("creación y registro de peso aceptan décimas exactas y nunca redondean", () => {
  for (const value of [1, 12.4, 64.1, 149.9, 150]) {
    assert.equal(weightValue(value), value);
    assert.equal(profileInput({ ...form, initialWeight: String(value) }).initialWeight, value);
  }
  for (const value of [12.46, 12.41, 12.400000000000002, 0.99, 150.01]) {
    assert.throws(() => weightValue(value));
    assert.throws(() => profileInput({ ...form, initialWeight: String(value) }));
    assert.throws(() => profileInput({ ...form, targetWeight: String(value) }));
  }
  assert.equal(profileInput({ ...form, initialWeight: "12.400" }).initialWeight, 12.4);
  assert.throws(() => profileInput({ ...form, initialWeight: "12.40000000000000000001" }));
});

test("peso objetivo vacío se normaliza a NULL al crear o editar, sin inventar cero", () => {
  for (const targetWeight of ["", "  "]) {
    const created = profileInput({ ...form, targetWeight });
    assert.equal(created.profile.target_weight_kg, null);
    assert.equal(created.initialWeight, 12.4);
    assert.equal(profileInput({ ...form, targetWeight }, { ...dog, targetWeight: 12 }).profile.target_weight_kg, null);
  }
  assert.equal(isDogResponse(dog), true);
  for (const initialWeight of ["", " "]) assert.throws(() => profileInput({ ...form, initialWeight, targetWeight: "" }));
  assert.throws(() => profileInput({ ...form, targetWeight: "0" }));
});

test("adaptador usa rutas propias sin identidad cliente ni acceso a localStorage", async () => {
  const calls = [];
  const transport = async (url, options) => { calls.push({ url, options }); return Response.json(options.method === "GET" ? { dogs: [dog] } : { dog }); };
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", { configurable: true, get() { throw new Error("Must not access storage"); } });
  try {
    assert.ok(createPackRepository());
    const repository = createRemoteRepository(transport);
    assert.deepEqual(await repository.list(), [dog]);
    assert.deepEqual(await repository.create(form), dog);
    await repository.update(id, form);
    await repository.recordWeight(id, 13);
    assert.deepEqual(calls.map(({ options }) => options.method), ["GET", "POST", "PATCH", "POST"]);
    assert.ok(calls.every(({ options }) => options.credentials === "same-origin" && options.cache === "no-store"));
    assert.deepEqual(JSON.parse(calls[3].options.body), { value: 13 });
    await assert.rejects(repository.update("../checkout", form));
    assert.equal(calls.length, 4);
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original); else delete globalThis.localStorage;
  }
});

test("respuesta perdida bloquea reintentos hasta revisar lista, sin guardados ficticios", async () => {
  let calls = 0;
  const repository = createRemoteRepository(async (_url, options) => { calls++; if (options.method !== "GET") throw new Error("PRIVATE transport details"); return Response.json({ dogs: [dog] }); });
  await assert.rejects(repository.create(form), /No pudimos confirmar/);
  await assert.rejects(repository.create(form), /No pudimos confirmar/);
  assert.equal(calls, 1);
  assert.deepEqual(await repository.list(), [dog]);
  await assert.rejects(repository.create(form), /No pudimos confirmar/);
  assert.equal(calls, 3);
});

test("errores HTTP o respuestas malformadas no filtran detalles ni sustituyen datos con lista vacía", async () => {
  const failure = createRemoteRepository(async () => Response.json({ error: "PRIVATE database detail" }, { status: 503 }));
  await assert.rejects(failure.list(), (error) => !error.message.includes("PRIVATE"));
  await assert.rejects(failure.create(form), /No pudimos confirmar/);
  const malformed = createRemoteRepository(async () => Response.json({ dogs: [{}], dog: {} }));
  await assert.rejects(malformed.list(), /No pudimos leer/);
  await assert.rejects(malformed.create(form), /No pudimos confirmar/);
  const network = createRemoteRepository(async () => { throw new Error("PRIVATE network"); });
  await assert.rejects(network.list(), /No pudimos conectar/);
});

test("una lectura iniciada antes del fallo no desbloquea una escritura incierta", async () => {
  let release;
  let writes = 0;
  const repository = createRemoteRepository(async (_url, options) => {
    if (options.method === "GET") return new Promise((resolve) => { release = resolve; });
    writes++;
    throw new Error("Connection lost");
  });
  const pending = repository.list();
  await assert.rejects(repository.create(form), /No pudimos confirmar/);
  release(Response.json({ dogs: [dog] }));
  await pending;
  await assert.rejects(repository.create(form), /No pudimos confirmar/);
  assert.equal(writes, 1);
});

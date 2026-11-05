import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { after, mock, test } from "node:test";

// Actual route handlers/model/response handling; only Auth configuration and
// the Supabase client are replaced. No Next server, .env loading or network.
const root = new URL("../../../", import.meta.url);
const serverUrl = new URL("lib/expediente/server.ts", root).href;
const authUrl = new URL("lib/auth/server.ts", root).href;
const configUrl = new URL("lib/auth/config.ts", root).href;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("lobo-test:")) return { url: specifier, shortCircuit: true };
    if (specifier === "server-only" && context.parentURL === serverUrl) return { url: "lobo-test:server-only", shortCircuit: true };
    if (specifier.startsWith("@/")) specifier = new URL(`${specifier.slice(2)}.ts`, root).href;
    if (specifier.startsWith(".") && context.parentURL?.endsWith(".ts") && !/\.[a-z]+$/.test(specifier)) specifier += ".ts";
    const resolved = nextResolve(specifier, context);
    if (resolved.url === authUrl) return { url: "lobo-test:auth", shortCircuit: true };
    if (resolved.url === configUrl && context.parentURL === serverUrl) return { url: "lobo-test:config", shortCircuit: true };
    return resolved;
  },
  load(url, context, nextLoad) {
    const sources = {
      "lobo-test:server-only": "export {};",
      "lobo-test:auth": "export const state = { client: null }; export async function serverAuth() { if (!state.client) throw new Error('Missing test client'); return state.client; }",
      "lobo-test:config": `export { validPostOrigin } from ${JSON.stringify(configUrl)}; export const authConfig = () => ({ origin: 'http://127.0.0.1:3100', url: 'http://127.0.0.1:54329', key: 'sb_publishable_fictitious_only', secure: false });`,
    };
    if (Object.hasOwn(sources, url)) return { format: "module", source: sources[url], shortCircuit: true };
    return nextLoad(url, context);
  },
});
const network = mock.method(globalThis, "fetch", () => { throw new Error("Network forbidden in handler tests"); });
const { state } = await import("lobo-test:auth");
const { POST: create } = await import("../../api/mi-expediente/dogs/route.ts");
const { POST: addWeight } = await import("../../api/mi-expediente/dogs/[id]/weights/route.ts");
const { PATCH: edit } = await import("../../api/mi-expediente/dogs/[id]/route.ts");
const { normalizeDog } = await import("../../../lib/expediente/model.ts");
const { dogToForm, todayInMexicoCity } = await import("../age.ts");
const { emptyForm } = await import("../types.ts");
after(() => {
  assert.equal(network.mock.callCount(), 0, "No test may attempt a network request");
  network.mock.restore();
  hooks.deregister();
});

const origin = "http://127.0.0.1:3100";
const dogId = "11111111-1111-4111-8111-111111111111";
const actorId = "22222222-2222-4222-8222-222222222222";
const newId = "33333333-3333-4333-8333-333333333333";
const historicalDate = "2025-01-02";
const context = () => ({ params: Promise.resolve({ id: dogId }) });
const request = (path, method, body) => new Request(origin + path, { method, headers: { origin, "content-type": "application/json" }, body: JSON.stringify(body) });
const form = { ...emptyForm, name: "QA local nuevo", initialWeight: "12.4", targetWeight: "" };

function fixture() {
  const db = {
    dogs: [{ id: dogId, user_id: actorId, name: "QA local existente", breed: null, sex: "unknown", birth_date: null, age_months_estimate: 38, age_estimated_at: historicalDate, target_weight_kg: null, created_at: "2025-01-02T12:00:00Z" }],
    weight_entries: [12.4, 12.1].map((weight_kg, index) => ({ id: `44444444-4444-4444-8444-${String(index).padStart(12, "0")}`, dog_id: dogId, weight_kg, recorded_at: `2025-01-0${index + 2}T12:00:00Z` })),
  };
  const writes = [];
  const chain = (result) => ({ retry() { return this; }, abortSignal() { return this; }, then(resolve, reject) { return Promise.resolve(result).then(resolve, reject); } });
  state.client = {
    auth: { async getUser() { return { data: { user: { id: actorId } }, error: null }; } },
    rpc(name, input) {
      assert.equal(name, "create_dog_with_initial_weight");
      writes.push({ operation: "rpc", input: structuredClone(input) });
      const dog = { ...db.dogs[0], id: newId, name: input.p_name, breed: input.p_breed, sex: input.p_sex, birth_date: input.p_birth_date, age_months_estimate: input.p_age_months_estimate, age_estimated_at: input.p_age_estimated_at, target_weight_kg: input.p_target_weight_kg };
      const weight = { id: newId, dog_id: newId, weight_kg: input.p_initial_weight_kg, recorded_at: "2026-01-01T12:00:00Z" };
      db.dogs.push(dog); db.weight_entries.push(weight);
      return chain({ data: { dog, weight }, error: null });
    },
    from(table) {
      assert.ok(Object.hasOwn(db, table));
      const filters = [];
      let change, inserted, single = false, start = 0, end = Infinity;
      return {
        select() { return this; },
        eq(key, value) { filters.push((row) => row[key] === value); return this; },
        in(key, values) { filters.push((row) => values.includes(row[key])); return this; },
        order() { return this; },
        range(first, last) { start = first; end = last; return this; },
        maybeSingle() { single = true; return this; },
        retry() { return this; },
        abortSignal() { return this; },
        update(input) { writes.push({ operation: "update", table, input: structuredClone(input) }); change = input; return this; },
        insert(input) { writes.push({ operation: "insert", table, input: structuredClone(input) }); inserted = input; return this; },
        then(resolve, reject) {
          return Promise.resolve().then(() => {
            if (inserted) db[table].push({ id: newId, ...inserted });
            const rows = db[table].filter((row) => filters.every((filter) => filter(row)));
            if (change) for (const row of rows) Object.assign(row, change);
            return { data: structuredClone(single ? rows[0] ?? null : rows.slice(start, end + 1)), error: null, count: rows.length };
          }).then(resolve, reject);
        },
      };
    },
  };
  return { db, writes };
}

test("handler POST alta: 12.46 devuelve 400 sin RPC ni cambios en perfiles/pesos existentes", async () => {
  const { db, writes } = fixture();
  const before = structuredClone(db);
  const response = await create(request("/api/mi-expediente/dogs", "POST", { ...form, initialWeight: "12.46" }));
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Introduce un peso con un máximo de una decimal de kg." });
  assert.deepEqual(writes, []);
  assert.deepEqual(db, before);
});

test("handler POST peso: 12.46 devuelve 400 sin inserción ni medición adicional", async () => {
  const { db, writes } = fixture();
  const before = structuredClone(db);
  const response = await addWeight(request(`/api/mi-expediente/dogs/${dogId}/weights`, "POST", { value: 12.46 }), context());
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Introduce un peso con un máximo de una decimal de kg." });
  assert.deepEqual(writes, []);
  assert.deepEqual(db, before);
});

test("handler POST alta: control positivo 12.4 llama a la RPC y conserva objetivo NULL", async () => {
  const { db, writes } = fixture();
  const response = await create(request("/api/mi-expediente/dogs", "POST", form));
  assert.equal(response.status, 200);
  const { dog } = await response.json();
  assert.equal(dog.targetWeight, null);
  assert.deepEqual(dog.weights.map((entry) => entry.value), [12.4]);
  assert.equal(writes.length, 1);
  assert.equal(writes[0].operation, "rpc");
  assert.equal(writes[0].input.p_initial_weight_kg, 12.4);
  assert.equal(db.dogs.length, 2);
});

test("handler POST peso: control positivo 12.4 agrega una medición y conserva el historial", async () => {
  const { db, writes } = fixture();
  const before = structuredClone(db.weight_entries);
  const response = await addWeight(request(`/api/mi-expediente/dogs/${dogId}/weights`, "POST", { value: 12.4 }), context());
  assert.equal(response.status, 200);
  const { dog } = await response.json();
  assert.deepEqual(dog.weights.map((entry) => entry.value), [12.4, 12.1, 12.4]);
  assert.deepEqual(db.weight_entries.slice(0, 2), before);
  assert.equal(writes.length, 1);
  assert.equal(writes[0].operation, "insert");
});

for (const [field, value] of [["name", "QA local renombrado"], ["breed", "Raza ficticia editada"]]) {
  test(`handler PATCH ${field}: conserva 38 meses y fecha histórica al editar otro campo`, async () => {
    const { db, writes } = fixture();
    const before = structuredClone(db);
    assert.ok(historicalDate < todayInMexicoCity());
    const input = { ...dogToForm(normalizeDog(db.dogs[0], db.weight_entries)), [field]: value };
    const response = await edit(request(`/api/mi-expediente/dogs/${dogId}`, "PATCH", input), context());
    assert.equal(response.status, 200);
    const { dog } = await response.json();
    assert.equal(dog[field], value);
    assert.equal(dog.ageMonthsEstimate, 38);
    assert.equal(dog.ageEstimatedAt, historicalDate);
    assert.equal(writes.length, 1);
    assert.equal(writes[0].input.age_months_estimate, 38);
    assert.equal(writes[0].input.age_estimated_at, historicalDate);
    assert.deepEqual(db.dogs, [{ ...before.dogs[0], [field]: value }]);
    assert.deepEqual(db.weight_entries, before.weight_entries);
  });
}

for (const change of [{ ageEstimatedAt: "2024-01-02" }, { ageMonths: "3" }]) {
  test(`handler PATCH: referencia incompatible ${Object.keys(change)[0]} devuelve 400 sin escribir`, async () => {
    const { db, writes } = fixture();
    const before = structuredClone(db);
    const input = { ...dogToForm(normalizeDog(db.dogs[0], db.weight_entries)), ...change };
    const response = await edit(request(`/api/mi-expediente/dogs/${dogId}`, "PATCH", input), context());
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "Revisa la referencia de la edad aproximada." });
    assert.deepEqual(writes, []);
    assert.deepEqual(db, before);
  });
}

import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

// Next.js resolves extensionless TypeScript imports; mirror that resolution
// for these native Node tests without adding a runtime/test dependency.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("./") && /\/(localStorageRepository|repository)\.ts$/.test(context.parentURL ?? "")) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});

const { createLocalStorageRepository, STORAGE_KEY } = await import("../localStorageRepository.ts");
const { buildDog, emptyForm } = await import("../data.ts");
const form = { ...emptyForm, name: "Nala", initialWeight: "12.4", targetWeight: "12", dailyPortion: "320" };

function setup() {
  const entries = new Map();
  const storage = {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
  };
  const events = new EventTarget();
  const repository = createLocalStorageRepository({ getStorage: () => storage, events });
  return { repository, entries, storage, events };
}

function storageEvent(key) {
  return Object.assign(new Event("storage"), { key });
}

test("puede importarse y construirse sin window ni acceso a almacenamiento durante SSR", () => {
  let accessed = false;
  createLocalStorageRepository({ getStorage() { accessed = true; throw new Error("SSR"); } });
  assert.equal(accessed, false);
  assert.equal(typeof window, "undefined");
});

test("lee el formato v1 existente sin migrar ni sobrescribir datos", async () => {
  const { repository, entries } = setup();
  const dogs = [buildDog(form)];
  const original = JSON.stringify({ version: 1, dogs });
  entries.set(STORAGE_KEY, original);
  const pending = repository.list();
  assert.ok(pending instanceof Promise);
  assert.deepEqual(await pending, dogs);
  assert.equal(entries.get(STORAGE_KEY), original);
});

test("crear, editar y registrar pesos comparten el contrato asíncrono", async () => {
  const { repository } = setup();
  const created = await repository.create(form);
  const weighed = await repository.recordWeight(created.id, 12.1);
  const edited = await repository.update(created.id, { ...form, name: "Nala actualizada", initialWeight: "80" });
  assert.equal(edited.id, created.id);
  assert.equal(edited.name, "Nala actualizada");
  assert.deepEqual(edited.weights, weighed.weights);
  assert.deepEqual(edited.weights.map((entry) => entry.value), [12.4, 12.1]);
  assert.deepEqual(await repository.list(), [edited]);
});

test("una edición lee el historial más reciente de otra instancia del repositorio", async () => {
  const { repository, storage, events } = setup();
  const otherTab = createLocalStorageRepository({ getStorage: () => storage, events });
  const created = await repository.create(form);
  await otherTab.recordWeight(created.id, 12.2);
  const edited = await repository.update(created.id, { ...form, breed: "Mestizo" });
  assert.deepEqual(edited.weights.map((entry) => entry.value), [12.4, 12.2]);
});

test("los errores de validación o de expediente inexistente rechazan la promesa sin escribir", async () => {
  const { repository, entries } = setup();
  await assert.rejects(repository.create({ ...form, name: " " }), /nombre/);
  await assert.rejects(repository.update("missing", form), /no está disponible/);
  await assert.rejects(repository.recordWeight("missing", 12), /no está disponible/);
  assert.equal(entries.size, 0);
});

test("un almacenamiento corrupto no se sobrescribe al crear un expediente", async () => {
  const { repository, entries } = setup();
  entries.set(STORAGE_KEY, "{corrupto");
  await assert.rejects(repository.list(), /no se han sobrescrito/);
  await assert.rejects(repository.create(form), /no se han sobrescrito/);
  assert.equal(entries.get(STORAGE_KEY), "{corrupto");
});

test("un error de cuota conserva los datos y no notifica un guardado exitoso", async () => {
  const { repository, storage, events, entries } = setup();
  const dog = await repository.create(form);
  const original = entries.get(STORAGE_KEY);
  let changes = 0;
  const failing = createLocalStorageRepository({
    getStorage: () => ({ getItem: storage.getItem, setItem() { throw new Error("QuotaExceededError"); } }),
    events,
  });
  const unsubscribe = failing.subscribe(() => { changes++; });
  await assert.rejects(failing.recordWeight(dog.id, 12), /No pudimos guardar/);
  assert.equal(entries.get(STORAGE_KEY), original);
  assert.equal(changes, 0);
  unsubscribe();
});

test("el acceso bloqueado al almacenamiento rechaza la lectura y la escritura", async () => {
  const repository = createLocalStorageRepository({ getStorage() { throw new Error("SecurityError"); }, events: new EventTarget() });
  await assert.rejects(repository.list(), /Permite el almacenamiento/);
  await assert.rejects(repository.create(form), /Permite el almacenamiento/);
});

test("las suscripciones notifican cambios locales y de otras pestañas y permiten limpiarse", async () => {
  const { repository, events } = setup();
  let changes = 0;
  const unsubscribe = repository.subscribe(() => { changes++; });
  await repository.create(form);
  assert.equal(changes, 1);
  events.dispatchEvent(storageEvent("unrelated-key"));
  assert.equal(changes, 1);
  events.dispatchEvent(storageEvent(STORAGE_KEY));
  events.dispatchEvent(storageEvent(null));
  assert.equal(changes, 3);
  unsubscribe();
  await repository.create({ ...form, name: "Bruno" });
  events.dispatchEvent(storageEvent(STORAGE_KEY));
  assert.equal(changes, 3);
});

test("cuentas nuevas nunca leen ni modifican legacy y mantienen datos separados", async () => {
  const { entries, storage, events } = setup();
  const original = JSON.stringify({ version: 1, dogs: [buildDog({ ...form, name: "Legacy" })] });
  entries.set(STORAGE_KEY, original);
  const reads = [];
  const options = { events, getStorage: () => ({ ...storage, getItem(key) { reads.push(key); return storage.getItem(key); } }) };
  const a = createLocalStorageRepository({ ...options, storageKey: "lobo.mi-expediente.auth-v1.11111111-1111-4111-8111-111111111111" });
  const b = createLocalStorageRepository({ ...options, storageKey: "lobo.mi-expediente.auth-v1.22222222-2222-4222-8222-222222222222" });
  assert.deepEqual(await a.list(), []);
  assert.deepEqual(await b.list(), []);
  let bChanges = 0;
  const unsubscribe = b.subscribe(() => bChanges++);
  const dog = await a.create(form);
  await a.recordWeight(dog.id, 13);
  assert.deepEqual(await b.list(), []);
  await assert.rejects(b.update(dog.id, form), /no está disponible/);
  assert.equal(bChanges, 0);
  assert.equal(entries.get(STORAGE_KEY), original);
  assert.equal(reads.includes(STORAGE_KEY), false);
  unsubscribe();
});

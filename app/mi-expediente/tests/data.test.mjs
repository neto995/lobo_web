import assert from "node:assert/strict";
import { test } from "node:test";
import { addWeight, buildDog, decodeDogs, emptyForm, validateWeight } from "../data.ts";

const form = { ...emptyForm, name: "  Nala  ", initialWeight: "12.4", targetWeight: "12", dailyPortion: "320" };

test("crear un expediente conserva el peso inicial y normaliza los campos opcionales", () => {
  const dog = buildDog(form);
  assert.equal(dog.name, "Nala");
  assert.equal(dog.breed, "Sin especificar");
  assert.equal(dog.dailyPortion, 320);
  assert.equal(dog.weights.length, 1);
  assert.equal(dog.weights[0].value, 12.4);
  assert.ok(Number.isFinite(Date.parse(dog.weights[0].recordedAt)));
});

test("editar el perfil preserva el ID y todo el historial", () => {
  const dog = addWeight(buildDog(form), 12.1);
  const edited = buildDog({ ...form, name: "Nala actualizada", initialWeight: "90", targetWeight: "11.8" }, dog);
  assert.equal(edited.id, dog.id);
  assert.equal(edited.name, "Nala actualizada");
  assert.equal(edited.targetWeight, 11.8);
  assert.deepEqual(edited.weights, dog.weights);
});

test("registrar un peso acumula entradas sin modificar los registros anteriores", () => {
  const dog = buildDog(form);
  const updated = addWeight(dog, 12.2);
  assert.equal(dog.weights.length, 1);
  assert.equal(updated.weights.length, 2);
  assert.deepEqual(updated.weights[0], dog.weights[0]);
  assert.equal(updated.weights[1].value, 12.2);
  assert.notEqual(updated.weights[0].id, updated.weights[1].id);
});

test("el guardado y la lectura mantienen varios perros y su historial completo", () => {
  const dogs = [addWeight(buildDog(form), 12.2), buildDog({ ...form, name: "Bruno" })];
  assert.deepEqual(decodeDogs(JSON.stringify({ version: 1, dogs })), dogs);
  assert.deepEqual(decodeDogs(null), []);
});

test("rechaza pesos fuera de rango y valores no finitos", () => {
  for (const value of [NaN, Infinity, -1, 0, .9, 150.1]) {
    assert.throws(() => validateWeight(value));
  }
  assert.equal(validateWeight(1), 1);
  assert.equal(validateWeight(150), 150);
});

test("rechaza nombres vacíos, porciones inválidas y protocolos de fotografía no seguros", () => {
  for (const values of [{ name: " " }, { dailyPortion: "NaN" }, { dailyPortion: "-1" }, { dailyPortion: "2.5" }, { photoUrl: "javascript:alert(1)" }]) {
    assert.throws(() => buildDog({ ...form, ...values }));
  }
});

test("los datos corruptos o de otra versión producen un error en lugar de un expediente vacío", () => {
  for (const raw of ["{", "null", "[]", '{"version":2,"dogs":[]}', '{"version":1,"dogs":[{}]}']) {
    assert.throws(() => decodeDogs(raw), /no se han sobrescrito/);
  }
  const dog = buildDog(form);
  assert.throws(() => decodeDogs(JSON.stringify({ version: 1, dogs: [dog, dog] })));
  dog.weights[0].recordedAt = "fecha inválida";
  assert.throws(() => decodeDogs(JSON.stringify({ version: 1, dogs: [dog] })));
});

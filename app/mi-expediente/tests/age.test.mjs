import assert from "node:assert/strict";
import { test } from "node:test";
import { ageLabel, dogToForm, elapsedMonths, todayInMexicoCity, validCalendarDate } from "../age.ts";
import { currentWeight, emptyForm, weightLabel } from "../types.ts";

const unknownAge = { birthDate: null, ageMonthsEstimate: null, ageEstimatedAt: null };
const dog = { id: "fixture-dog", name: "Nala", breed: null, sex: "unknown", targetWeight: null, weights: [], ...unknownAge };

test("la referencia de estimacion usa el calendario de Ciudad de Mexico", () => {
  assert.equal(todayInMexicoCity(new Date("2026-10-18T05:59:59Z")), "2026-10-17");
  assert.equal(todayInMexicoCity(new Date("2026-10-18T06:00:00Z")), "2026-10-18");
});

test("las fechas de calendario rechazan dias inexistentes sin normalizarlos", () => {
  for (const value of ["2026-02-29", "2026-04-31", "2026-00-10", "0000-01-01", "26-01-01", "2026-1-01", "2026-01-01T00:00:00Z", "texto", ""]) {
    assert.equal(validCalendarDate(value), false, value);
  }
  for (const value of ["2024-02-29", "2026-04-30", "0099-01-01"]) assert.equal(validCalendarDate(value), true, value);
});

test("la edad exacta avanza por meses de calendario y no por dias divididos entre 30", () => {
  assert.equal(elapsedMonths("2026-01-15", "2026-02-14"), 0);
  assert.equal(elapsedMonths("2026-01-15", "2026-02-15"), 1);
  assert.equal(elapsedMonths("2025-01-15", "2026-02-15"), 13);
  assert.equal(ageLabel({ ...unknownAge, birthDate: "2025-01-15" }, "2026-02-15"), "1 año y 1 mes");
  assert.equal(ageLabel({ ...unknownAge, birthDate: "2026-02-15" }, "2026-02-15"), "0 meses");
});

test("los aniversarios al final del mes respetan meses cortos y anos bisiestos", () => {
  assert.equal(elapsedMonths("2026-01-31", "2026-02-27"), 0);
  assert.equal(elapsedMonths("2026-01-31", "2026-02-28"), 1);
  assert.equal(elapsedMonths("2024-02-29", "2025-02-28"), 12);
  assert.equal(elapsedMonths("2024-02-29", "2028-02-28"), 47);
});

test("una edad aproximada avanza desde su referencia y sigue identificada como aproximada", () => {
  const age = { ...unknownAge, ageMonthsEstimate: 24, ageEstimatedAt: "2025-10-18" };
  assert.equal(ageLabel(age, "2026-10-17"), "2 años y 11 meses (aprox.)");
  assert.equal(ageLabel(age, "2026-10-18"), "3 años (aprox.)");
});

test("edad desconocida o referencia invalida no inventan edad ni nacimiento", () => {
  assert.equal(ageLabel(unknownAge, "2026-10-18"), "Edad desconocida");
  assert.equal(ageLabel({ ...unknownAge, birthDate: "2027-01-01" }, "2026-10-18"), "Edad desconocida");
  assert.equal(ageLabel({ ...unknownAge, ageMonthsEstimate: 4, ageEstimatedAt: "invalida" }), "Edad desconocida");
  assert.equal(elapsedMonths("2026-02-30", "2026-03-20"), null);
});

test("editar conserva la estimacion original y su referencia en lugar de recalcularlas", () => {
  const original = { ...dog, ageMonthsEstimate: 26, ageEstimatedAt: "2024-01-15" };
  const form = dogToForm(original);
  assert.equal(form.ageMode, "estimate");
  assert.equal(form.ageYears, "2");
  assert.equal(form.ageMonths, "2");
  assert.equal(form.ageEstimatedAt, "2024-01-15");
  assert.equal({ ...form, name: "Nombre nuevo" }.ageEstimatedAt, "2024-01-15");
  assert.equal(form.birthDate, "");
});

test("el formulario remoto conserva NULL como desconocido y no incluye los campos legacy", () => {
  const form = dogToForm(dog);
  assert.equal(form.ageMode, "unknown");
  assert.equal(form.breed, "");
  assert.equal(form.targetWeight, "");
  assert.equal(form.initialWeight, "");
  assert.equal("dailyPortion" in form, false);
  assert.equal("photoUrl" in form, false);
  assert.equal("age" in form, false);
  assert.equal(emptyForm.ageEstimatedAt, "");
  assert.equal(emptyForm.ageMode, "unknown");
  assert.equal(dogToForm({ ...dog, birthDate: "2023-06-04" }).ageMode, "birth_date");
});

test("un historial vacio nunca se presenta como un peso de cero", () => {
  assert.equal(currentWeight(dog), null);
  assert.equal(weightLabel(currentWeight(dog)), "Sin registro");
  assert.equal(currentWeight({ ...dog, weights: [{ id: "one", value: 12.1, recordedAt: "2026-10-18T12:00:00Z" }] }), 12.1);
  assert.equal(weightLabel(12.1), "12.1 kg");
});

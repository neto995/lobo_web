import { todayInMexicoCity, validCalendarDate } from "../../app/mi-expediente/age";
import type { Dog, WeightEntry } from "../../app/mi-expediente/types";

export class InputError extends Error {}
export const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
export const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const formFields = ["name", "breed", "sex", "ageMode", "birthDate", "ageYears", "ageMonths", "ageEstimatedAt", "initialWeight", "targetWeight"];

export function weightValue(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 1 || value > 150) throw new InputError("Introduce un peso entre 1 y 150 kg.");
  if (Math.round(value * 10) / 10 !== value) throw new InputError("Introduce un peso con un máximo de una decimal de kg.");
  return value;
}

function formWeight(value: string) {
  if (!/^\d+(?:\.\d+)?$/.test(value.trim())) throw new InputError("Introduce un peso entre 1 y 150 kg.");
  // Check the text before Number() can lose extra decimal precision.
  if (!/^\d+(?:\.\d0*)?$/.test(value.trim())) throw new InputError("Introduce un peso con un máximo de una decimal de kg.");
  return weightValue(Number(value));
}

export function profileInput(input: unknown, existing?: Dog, today = todayInMexicoCity()) {
  if (!isRecord(input) || Object.keys(input).some((key) => !formFields.includes(key)) || formFields.some((key) => typeof input[key] !== "string")) throw new InputError("Revisa los datos del perfil.");
  const form = input as Record<string, string>;
  const name = form.name.trim();
  const breed = form.breed.trim();
  if (!name || name.length > 80) throw new InputError("Escribe un nombre de hasta 80 caracteres.");
  if (breed.length > 120) throw new InputError("La raza debe tener como máximo 120 caracteres.");
  if (!["male", "female", "unknown"].includes(form.sex)) throw new InputError("Selecciona un sexo válido.");
  const targetWeight = !form.targetWeight.trim() ? null : formWeight(form.targetWeight);
  let birthDate: string | null = null;
  let ageMonthsEstimate: number | null = null;
  let ageEstimatedAt: string | null = null;
  if (form.ageMode === "birth_date") {
    if (!validCalendarDate(form.birthDate) || form.birthDate > today) throw new InputError("Introduce una fecha de nacimiento válida, no futura.");
    birthDate = form.birthDate;
  } else if (form.ageMode === "estimate") {
    if (!/^\d+$/.test(form.ageYears) || !/^\d+$/.test(form.ageMonths) || Number(form.ageMonths) > 11) throw new InputError("Introduce años completos y meses entre 0 y 11.");
    ageMonthsEstimate = Number(form.ageYears) * 12 + Number(form.ageMonths);
    if (!Number.isSafeInteger(ageMonthsEstimate) || ageMonthsEstimate > 2147483647) throw new InputError("Revisa la edad aproximada.");
    if (form.ageEstimatedAt) {
      if (!existing || form.ageEstimatedAt !== existing.ageEstimatedAt || ageMonthsEstimate !== existing.ageMonthsEstimate) throw new InputError("Revisa la referencia de la edad aproximada.");
      ageEstimatedAt = existing.ageEstimatedAt;
    } else {
      ageEstimatedAt = today;
    }
  } else if (form.ageMode !== "unknown") {
    throw new InputError("Selecciona cómo conoces su edad.");
  }
  return {
    profile: { name, breed: breed || null, sex: form.sex, target_weight_kg: targetWeight, birth_date: birthDate, age_months_estimate: ageMonthsEstimate, age_estimated_at: ageEstimatedAt },
    initialWeight: existing ? null : formWeight(form.initialWeight),
  };
}

function numeric(value: unknown): number {
  if (typeof value !== "number" && (typeof value !== "string" || !/^-?\d+(?:\.\d+)?$/.test(value))) throw new Error("Invalid database number");
  const result = Number(value);
  if (!Number.isFinite(result)) throw new Error("Invalid database number");
  return result;
}

export function normalizeWeight(row: Record<string, unknown>): WeightEntry {
  if (typeof row.id !== "string" || !isUuid(row.id) || typeof row.recorded_at !== "string" || !Number.isFinite(Date.parse(row.recorded_at))) throw new Error("Invalid weight record");
  const value = numeric(row.weight_kg);
  if (value < 1 || value > 150) throw new Error("Invalid weight record");
  return { id: row.id, value, recordedAt: row.recorded_at };
}

export function normalizeDog(row: Record<string, unknown>, weights: Record<string, unknown>[]): Dog {
  if (typeof row.id !== "string" || !isUuid(row.id) || typeof row.name !== "string" || !row.name.trim() || !(row.breed === null || typeof row.breed === "string") || !["male", "female", "unknown"].includes(String(row.sex))) throw new Error("Invalid dog record");
  for (const field of ["birth_date", "age_estimated_at"]) if (!(row[field] === null || (typeof row[field] === "string" && validCalendarDate(row[field])))) throw new Error("Invalid age date");
  const estimate = row.age_months_estimate === null ? null : numeric(row.age_months_estimate);
  if (estimate !== null && (!Number.isInteger(estimate) || estimate < 0)) throw new Error("Invalid age estimate");
  if ((estimate === null) !== (row.age_estimated_at === null) || (row.birth_date !== null && estimate !== null)) throw new Error("Invalid age source");
  const entries = weights.map((weight) => {
    if (weight.dog_id !== row.id) throw new Error("Mismatched weight owner");
    return normalizeWeight(weight);
  }).sort((a, b) => Date.parse(a.recordedAt) - Date.parse(b.recordedAt) || a.id.localeCompare(b.id));
  if (new Set(entries.map((entry) => entry.id)).size !== entries.length) throw new Error("Duplicate weight record");
  return {
    id: row.id, name: row.name, breed: row.breed, sex: row.sex as Dog["sex"],
    birthDate: row.birth_date as string | null, ageMonthsEstimate: estimate, ageEstimatedAt: row.age_estimated_at as string | null,
    targetWeight: row.target_weight_kg === null ? null : numeric(row.target_weight_kg), weights: entries,
  };
}

export function isDogResponse(value: unknown): value is Dog {
  if (!isRecord(value) || !Array.isArray(value.weights)) return false;
  if (!(value.targetWeight === null || typeof value.targetWeight === "number") || !(value.ageMonthsEstimate === null || typeof value.ageMonthsEstimate === "number")) return false;
  try {
    normalizeDog({ id: value.id, name: value.name, breed: value.breed, sex: value.sex, birth_date: value.birthDate, age_months_estimate: value.ageMonthsEstimate, age_estimated_at: value.ageEstimatedAt, target_weight_kg: value.targetWeight }, value.weights.map((weight: unknown) => {
      if (!isRecord(weight) || typeof weight.value !== "number") throw new Error("Invalid weight");
      return { id: weight.id, dog_id: value.id, weight_kg: weight.value, recorded_at: weight.recordedAt };
    }));
    return true;
  } catch { return false; }
}

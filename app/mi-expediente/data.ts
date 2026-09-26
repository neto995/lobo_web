import type { Dog, DogFormValues, WeightEntry } from "./types";

export const emptyForm: DogFormValues = {
  name: "", breed: "", age: "", sex: "", initialWeight: "", targetWeight: "", dailyPortion: "", photoUrl: "",
};

export function validateWeight(value: number) {
  if (!Number.isFinite(value) || value < 1 || value > 150) {
    throw new Error("Introduce un peso entre 1 y 150 kg.");
  }
  return Math.round(value * 10) / 10;
}

function validPhoto(value: string) {
  if (!value) return true;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export function buildDog(form: DogFormValues, existing?: Dog): Dog {
  const name = form.name.trim();
  if (!name) throw new Error("Escribe el nombre de tu perro.");
  if (name.length > 80) throw new Error("El nombre debe tener como máximo 80 caracteres.");
  const targetWeight = validateWeight(Number(form.targetWeight));
  const dailyPortion = Number(form.dailyPortion || 0);
  if (!Number.isSafeInteger(dailyPortion) || dailyPortion < 0) {
    throw new Error("La porción diaria debe ser un número entero mayor o igual a cero.");
  }
  const photoUrl = form.photoUrl.trim();
  if (!validPhoto(photoUrl)) throw new Error("La fotografía debe tener una URL que comience con http:// o https://.");

  return {
    id: existing?.id ?? crypto.randomUUID(),
    name,
    breed: form.breed.trim() || "Sin especificar",
    age: form.age.trim() || "Sin especificar",
    sex: form.sex.trim() || "Sin especificar",
    targetWeight,
    dailyPortion,
    photoUrl,
    weights: existing?.weights ?? [{ id: crypto.randomUUID(), value: validateWeight(Number(form.initialWeight)), recordedAt: new Date().toISOString() }],
  };
}

export function addWeight(dog: Dog, value: number): Dog {
  return {
    ...dog,
    weights: [...dog.weights, { id: crypto.randomUUID(), value: validateWeight(value), recordedAt: new Date().toISOString() }],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isWeight(entry: unknown): entry is WeightEntry {
  return isRecord(entry) && typeof entry.id === "string" && typeof entry.value === "number" && Number.isFinite(entry.value) && entry.value >= 1 && entry.value <= 150 && typeof entry.recordedAt === "string" && Number.isFinite(Date.parse(entry.recordedAt));
}

function isDog(dog: unknown): dog is Dog {
  if (!isRecord(dog)) return false;
  return typeof dog.id === "string" && dog.id.length > 0 &&
    typeof dog.name === "string" && dog.name.trim().length > 0 &&
    typeof dog.breed === "string" && typeof dog.age === "string" && typeof dog.sex === "string" &&
    typeof dog.photoUrl === "string" && validPhoto(dog.photoUrl) &&
    typeof dog.targetWeight === "number" && Number.isFinite(dog.targetWeight) && dog.targetWeight >= 1 && dog.targetWeight <= 150 &&
    typeof dog.dailyPortion === "number" && Number.isSafeInteger(dog.dailyPortion) && dog.dailyPortion >= 0 &&
    Array.isArray(dog.weights) && dog.weights.length > 0 && dog.weights.every(isWeight) &&
    new Set(dog.weights.map((entry) => entry.id)).size === dog.weights.length;
}

export function decodeDogs(raw: string | null): Dog[] {
  if (raw === null) return [];
  try {
    const payload: unknown = JSON.parse(raw);
    if (!isRecord(payload) || payload.version !== 1 || !Array.isArray(payload.dogs) || !payload.dogs.every(isDog) || new Set(payload.dogs.map((dog) => dog.id)).size !== payload.dogs.length) {
      throw new Error("invalid");
    }
    return payload.dogs;
  } catch {
    throw new Error("No pudimos leer los expedientes guardados. Los datos originales siguen en este navegador y no se han sobrescrito.");
  }
}

export type WeightEntry = { id: string; value: number; recordedAt: string };

export type Dog = {
  id: string;
  name: string;
  breed: string | null;
  birthDate: string | null;
  ageMonthsEstimate: number | null;
  ageEstimatedAt: string | null;
  sex: "male" | "female" | "unknown";
  targetWeight: number | null;
  weights: WeightEntry[];
};

export type DogFormValues = {
  name: string;
  breed: string;
  ageMode: "birth_date" | "estimate" | "unknown";
  birthDate: string;
  ageYears: string;
  ageMonths: string;
  ageEstimatedAt: string;
  sex: Dog["sex"];
  initialWeight: string;
  targetWeight: string;
};

export const emptyForm: DogFormValues = {
  name: "", breed: "", ageMode: "unknown", birthDate: "", ageYears: "", ageMonths: "",
  ageEstimatedAt: "", sex: "unknown", initialWeight: "", targetWeight: "",
};

export type Section = "resumen" | "manada" | "alimentacion" | "evolucion";

export const currentWeight = (dog: Dog) => dog.weights.at(-1)?.value ?? null;
export const weightLabel = (value: number | null) => value === null ? "Sin registro" : `${value.toFixed(1)} kg`;
export const sexLabel = (sex: Dog["sex"]) => ({ male: "Macho", female: "Hembra", unknown: "Sexo no especificado" })[sex];

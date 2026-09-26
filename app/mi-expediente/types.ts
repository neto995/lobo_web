export type WeightEntry = { id: string; value: number; recordedAt: string };

export type Dog = {
  id: string;
  name: string;
  breed: string;
  age: string;
  sex: string;
  targetWeight: number;
  dailyPortion: number;
  photoUrl: string;
  weights: WeightEntry[];
};

export type DogFormValues = {
  name: string;
  breed: string;
  age: string;
  sex: string;
  initialWeight: string;
  targetWeight: string;
  dailyPortion: string;
  photoUrl: string;
};

export type Section = "resumen" | "manada" | "alimentacion" | "evolucion";

export const currentWeight = (dog: Dog) => dog.weights.at(-1)?.value ?? 0;

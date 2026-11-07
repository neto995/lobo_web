// These types describe the unchanged v1 browser payload, not PostgreSQL records.
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

export interface LegacyPackRepository {
  readonly storageDescription: string;
  list(): Promise<Dog[]>;
  create(values: DogFormValues): Promise<Dog>;
  update(id: string, values: DogFormValues): Promise<Dog>;
  recordWeight(id: string, value: number): Promise<Dog>;
  subscribe?(onChange: () => void): () => void;
}

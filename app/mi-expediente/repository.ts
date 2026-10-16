import { createLocalStorageRepository, type LocalStorageOptions } from "./localStorageRepository";
import type { Dog, DogFormValues } from "./types";

/** The UI depends on this contract, never on a storage format or transport. */
export interface PackRepository {
  readonly storageDescription: string;
  list(): Promise<Dog[]>;
  create(values: DogFormValues): Promise<Dog>;
  update(id: string, values: DogFormValues): Promise<Dog>;
  recordWeight(id: string, value: number): Promise<Dog>;
  /** Optional invalidation events, e.g. other tabs, polling, or server events. */
  subscribe?(onChange: () => void): () => void;
}

// This namespace prevents accidental mixing, not access by another browser user.
export function createPackRepository(userId: string, options: Omit<LocalStorageOptions, "storageKey"> = {}): PackRepository {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) throw new Error("Identidad no válida.");
  return createLocalStorageRepository({ ...options, storageKey: `lobo.mi-expediente.auth-v1.${userId}` });
}

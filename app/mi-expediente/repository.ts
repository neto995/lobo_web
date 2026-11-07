import { createRemoteRepository } from "./remoteRepository";
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

export function createPackRepository(): PackRepository {
  return createRemoteRepository();
}

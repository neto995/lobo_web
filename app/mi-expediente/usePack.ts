"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { packRepository, type PackRepository } from "./repository";
import type { Dog, DogFormValues } from "./types";

type PackState = { dogs: Dog[]; loading: boolean; error: string };

/** All reads and mutations work with either local or remote async repositories. */
export function usePack(repository: PackRepository = packRepository) {
  const [state, setState] = useState<PackState>({ dogs: [], loading: true, error: "" });
  const mounted = useRef(false);
  const requests = useRef({ id: 0 });

  const refresh = useCallback(async () => {
    const request = ++requests.current.id;
    try {
      const dogs = await repository.list();
      if (mounted.current && request === requests.current.id) setState({ dogs, loading: false, error: "" });
    } catch (cause) {
      if (mounted.current && request === requests.current.id) {
        setState((current) => ({ ...current, loading: false, error: cause instanceof Error ? cause.message : "No pudimos abrir los expedientes." }));
      }
    }
  }, [repository]);

  useEffect(() => {
    const pendingRequests = requests.current;
    mounted.current = true;
    const unsubscribe = repository.subscribe?.(() => { void refresh(); });
    void refresh();
    return () => {
      mounted.current = false;
      ++pendingRequests.id;
      unsubscribe?.();
    };
  }, [repository, refresh]);

  async function createDog(values: DogFormValues) {
    const dog = await repository.create(values);
    await refresh();
    return dog;
  }

  async function updateDog(id: string, values: DogFormValues) {
    const dog = await repository.update(id, values);
    await refresh();
    return dog;
  }

  async function recordWeight(id: string, value: number) {
    const dog = await repository.recordWeight(id, value);
    await refresh();
    return dog;
  }

  return { ...state, storageDescription: repository.storageDescription, refresh, createDog, updateDog, recordWeight };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PackRepository } from "./repository";
import type { Dog, DogFormValues } from "./types";

type PackState = { dogs: Dog[]; loading: boolean; error: string };

/** Only confirmed mutations update the visible records. */
export function usePack(repository: PackRepository) {
  const [state, setState] = useState<PackState>({ dogs: [], loading: true, error: "" });
  const mounted = useRef(false);
  const requests = useRef({ id: 0 });
  const activeRepository = useRef(repository);

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
    activeRepository.current = repository;
    const unsubscribe = repository.subscribe?.(() => { void refresh(); });
    void refresh();
    return () => {
      mounted.current = false;
      ++pendingRequests.id;
      unsubscribe?.();
    };
  }, [repository, refresh]);

  function acceptMutation(dog: Dog) {
    if (!mounted.current || activeRepository.current !== repository) return;
    // A pre-mutation list response must never replace the confirmed result.
    ++requests.current.id;
    setState((current) => ({
      dogs: current.dogs.some((entry) => entry.id === dog.id)
        ? current.dogs.map((entry) => entry.id === dog.id ? dog : entry)
        : [...current.dogs, dog],
      loading: false,
      error: "",
    }));
  }

  async function createDog(values: DogFormValues) {
    ++requests.current.id;
    const dog = await repository.create(values);
    acceptMutation(dog);
    return dog;
  }

  async function updateDog(id: string, values: DogFormValues) {
    ++requests.current.id;
    const dog = await repository.update(id, values);
    acceptMutation(dog);
    return dog;
  }

  async function recordWeight(id: string, value: number) {
    ++requests.current.id;
    const dog = await repository.recordWeight(id, value);
    acceptMutation(dog);
    return dog;
  }

  return { ...state, storageDescription: repository.storageDescription, refresh, createDog, updateDog, recordWeight };
}

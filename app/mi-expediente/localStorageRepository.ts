import { addWeight, buildDog, decodeDogs } from "./data";
import type { PackRepository } from "./repository";
import type { Dog } from "./types";

export const STORAGE_KEY = "lobo.mi-expediente.v1";
const CHANGE_EVENT = "lobo:expediente-changed";

type StorageAccess = Pick<Storage, "getItem" | "setItem">;

export type LocalStorageOptions = {
  getStorage?: () => StorageAccess;
  events?: EventTarget;
};

export function createLocalStorageRepository(options: LocalStorageOptions = {}): PackRepository {
  // Browser APIs are resolved only when called, never during module import/SSR.
  const getStorage = options.getStorage ?? (() => window.localStorage);
  const getEvents = () => options.events ?? window;

  function read(): Dog[] {
    let raw: string | null;
    try {
      raw = getStorage().getItem(STORAGE_KEY);
    } catch {
      throw new Error("Permite el almacenamiento local en tu navegador para abrir y guardar expedientes.");
    }
    return decodeDogs(raw);
  }

  function write(dogs: Dog[]) {
    try {
      getStorage().setItem(STORAGE_KEY, JSON.stringify({ version: 1, dogs }));
    } catch {
      throw new Error("No pudimos guardar los cambios. Revisa el espacio disponible y los permisos de almacenamiento del navegador.");
    }
    getEvents().dispatchEvent(new Event(CHANGE_EVENT));
  }

  function changeDog(id: string, transform: (dog: Dog) => Dog): Dog {
    // Always read the latest persisted record; never replace a history with
    // the potentially stale copy that was displayed when a form was opened.
    const dogs = read();
    const existing = dogs.find((dog) => dog.id === id);
    if (!existing) throw new Error("Este expediente ya no está disponible. Cierra el formulario y vuelve a intentarlo.");
    const updated = transform(existing);
    write(dogs.map((dog) => dog.id === id ? updated : dog));
    return updated;
  }

  return {
    storageDescription: "Guardado local · Tus expedientes permanecen en este navegador. No se sincronizan entre dispositivos y se eliminan si borras los datos del sitio.",
    async list() {
      return read();
    },
    async create(values) {
      const dogs = read();
      const dog = buildDog(values);
      write([...dogs, dog]);
      return dog;
    },
    async update(id, values) {
      return changeDog(id, (dog) => buildDog(values, dog));
    },
    async recordWeight(id, value) {
      return changeDog(id, (dog) => addWeight(dog, value));
    },
    subscribe(onChange) {
      const events = getEvents();
      const onStorage = (event: Event) => {
        const change = event as StorageEvent;
        if ((change.key === STORAGE_KEY || change.key === null) && (!change.storageArea || change.storageArea === getStorage())) onChange();
      };
      events.addEventListener("storage", onStorage);
      events.addEventListener(CHANGE_EVENT, onChange);
      return () => {
        events.removeEventListener("storage", onStorage);
        events.removeEventListener(CHANGE_EVENT, onChange);
      };
    },
  };
}

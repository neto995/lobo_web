import { useRef, useState, type FormEvent } from "react";
import { emptyForm } from "../data";
import { currentWeight, type Dog, type DogFormValues } from "../types";
import styles from "../expediente.module.css";

export default function DogForm({ dog, saving, onSave }: { dog?: Dog; saving: boolean; onSave: (values: DogFormValues) => Promise<void> }) {
  const submitting = useRef(false);
  const [form, setForm] = useState<DogFormValues>(() => dog ? {
    name: dog.name, breed: dog.breed, age: dog.age, sex: dog.sex === "Sin especificar" ? "" : dog.sex,
    initialWeight: String(currentWeight(dog)), targetWeight: String(dog.targetWeight),
    dailyPortion: String(dog.dailyPortion), photoUrl: dog.photoUrl,
  } : emptyForm);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setError("");
    try { await onSave(form); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No pudimos guardar el perfil."); }
    finally { submitting.current = false; }
  }

  return (
    <form onSubmit={submit} aria-busy={saving}>
      <h2 id="expediente-modal-title">{dog ? `Editar a ${dog.name}` : "Abrir expediente"}</h2>
      <p>Comienza con lo esencial. Podrás corregir estos datos cuando lo necesites.</p>
      <fieldset className={styles["form-grid"]} disabled={saving}>
        <label>Nombre*<input required maxLength={80} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>Raza<input maxLength={120} value={form.breed} onChange={(event) => setForm({ ...form, breed: event.target.value })} /></label>
        <label>Edad<input maxLength={80} placeholder="Ej. 4 años" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} /></label>
        <label>Sexo<select value={form.sex} onChange={(event) => setForm({ ...form, sex: event.target.value })}><option value="">Selecciona</option><option>Macho</option><option>Hembra</option></select></label>
        {!dog && <label>Peso inicial (kg)*<input required inputMode="decimal" type="number" min="1" max="150" step="0.1" value={form.initialWeight} onChange={(event) => setForm({ ...form, initialWeight: event.target.value })} /></label>}
        <label>Peso objetivo (kg)*<input required inputMode="decimal" type="number" min="1" max="150" step="0.1" value={form.targetWeight} onChange={(event) => setForm({ ...form, targetWeight: event.target.value })} /></label>
        <label>Porción diaria (g)<input type="number" inputMode="numeric" min="0" step="1" value={form.dailyPortion} onChange={(event) => setForm({ ...form, dailyPortion: event.target.value })} /></label>
        <label className={styles["full-field"]}>URL de fotografía <span>opcional</span><input type="url" placeholder="https://…" value={form.photoUrl} onChange={(event) => setForm({ ...form, photoUrl: event.target.value })} /></label>
      </fieldset>
      {error && <p className={styles["form-error"]} role="alert">{error}</p>}
      <button className={`${styles["black-button"]} ${styles.wide}`} type="submit" disabled={saving}>{saving ? "Guardando…" : dog ? "Guardar cambios" : "Crear expediente"}</button>
    </form>
  );
}

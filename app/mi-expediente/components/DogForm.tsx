import { useRef, useState, type FormEvent } from "react";
import { emptyForm, type Dog, type DogFormValues } from "../types";
import { dogToForm, todayInMexicoCity } from "../age";
import styles from "../expediente.module.css";

export default function DogForm({ dog, saving, onSave }: { dog?: Dog; saving: boolean; onSave: (values: DogFormValues) => Promise<void> }) {
  const submitting = useRef(false);
  const [form, setForm] = useState<DogFormValues>(() => dog ? dogToForm(dog) : { ...emptyForm });
  const [error, setError] = useState("");

  function changeAge(change: Partial<DogFormValues>) {
    setForm({ ...form, ...change, ageEstimatedAt: "" });
  }

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
        <label>Sexo<select value={form.sex} onChange={(event) => setForm({ ...form, sex: event.target.value as Dog["sex"] })}><option value="unknown">Sin especificar</option><option value="male">Macho</option><option value="female">Hembra</option></select></label>
        <fieldset className={`${styles["age-fields"]} ${styles["full-field"]}`}>
          <legend>Edad</legend>
          <div className={styles["age-options"]}>
            <label><input type="radio" name="age-mode" value="birth_date" checked={form.ageMode === "birth_date"} onChange={() => changeAge({ ageMode: "birth_date" })} />Conozco su fecha de nacimiento (recomendado)</label>
            <label><input type="radio" name="age-mode" value="estimate" checked={form.ageMode === "estimate"} onChange={() => changeAge({ ageMode: "estimate", ageYears: form.ageYears || "0", ageMonths: form.ageMonths || "0" })} />Sé su edad aproximada</label>
            <label><input type="radio" name="age-mode" value="unknown" checked={form.ageMode === "unknown"} onChange={() => changeAge({ ageMode: "unknown" })} />No conozco su edad</label>
          </div>
          {form.ageMode === "birth_date" && <label>Nacimiento<input required type="date" max={todayInMexicoCity()} value={form.birthDate} onChange={(event) => changeAge({ birthDate: event.target.value })} /></label>}
          {form.ageMode === "estimate" && <>
            <div className={styles["age-estimate"]}>
              <label>Años<input required type="number" inputMode="numeric" min="0" step="1" value={form.ageYears} onChange={(event) => changeAge({ ageYears: event.target.value })} /></label>
              <label>Meses<input required type="number" inputMode="numeric" min="0" max="11" step="1" value={form.ageMonths} onChange={(event) => changeAge({ ageMonths: event.target.value })} /></label>
            </div>
            {form.ageEstimatedAt && <p className={styles["age-reference"]}>Estimación original del {form.ageEstimatedAt}.</p>}
          </>}
        </fieldset>
        {!dog && <label>Peso inicial (kg)*<input required inputMode="decimal" type="number" min="1" max="150" step="0.1" value={form.initialWeight} onChange={(event) => setForm({ ...form, initialWeight: event.target.value })} /></label>}
        <label>Peso objetivo (kg) (opcional)<input inputMode="decimal" type="number" min="1" max="150" step="0.1" value={form.targetWeight} onChange={(event) => setForm({ ...form, targetWeight: event.target.value })} /></label>
      </fieldset>
      {error && <p className={styles["form-error"]} role="alert">{error}</p>}
      <button className={`${styles["black-button"]} ${styles.wide}`} type="submit" disabled={saving}>{saving ? "Guardando…" : dog ? "Guardar cambios" : "Crear expediente"}</button>
    </form>
  );
}

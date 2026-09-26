import { useRef, useState, type FormEvent } from "react";
import { currentWeight, type Dog } from "../types";
import styles from "../expediente.module.css";

export default function WeightForm({ dog, saving, onSave }: { dog: Dog; saving: boolean; onSave: (value: number) => Promise<void> }) {
  const submitting = useRef(false);
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setError("");
    try { await onSave(Number(weight)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No pudimos guardar el peso."); }
    finally { submitting.current = false; }
  }

  return (
    <form onSubmit={submit} aria-busy={saving}>
      <h2 id="expediente-modal-title">¿Cuánto pesa hoy?</h2>
      <p>Este dato se añadirá al historial. Los registros anteriores se conservan.</p>
      <label>Peso actual<div className={styles["weight-input"]}>
        <input required disabled={saving} inputMode="decimal" type="number" min="1" max="150" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} placeholder={currentWeight(dog).toFixed(1)} />
        <span>kg</span>
      </div></label>
      {error && <p className={styles["form-error"]} role="alert">{error}</p>}
      <button className={`${styles["black-button"]} ${styles.wide}`} type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar en su expediente"}</button>
    </form>
  );
}

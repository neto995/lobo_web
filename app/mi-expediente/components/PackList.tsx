import { currentWeight, weightLabel, type Dog } from "../types";
import { ageLabel } from "../age";
import styles from "../expediente.module.css";

export default function PackList({ dogs, selectedId, onSelect }: {
  dogs: Dog[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section aria-labelledby="manada-title">
      <div className={styles["section-heading"]}><h2 id="manada-title">La manada</h2><span>Selecciona un expediente</span></div>
      <div className={styles["dog-list"]}>
        {dogs.map((dog, index) => {
          const latest = currentWeight(dog);
          const difference = latest === null || !dog.weights.length ? null : latest - dog.weights[0].value;
          return (
            <button key={dog.id} className={`${styles["dog-row"]} ${dog.id === selectedId ? styles.selected : ""}`} onClick={() => onSelect(dog.id)} aria-pressed={dog.id === selectedId}>
              <span className={styles["dog-index"]}>{String(index + 1).padStart(2, "0")}</span>
              <span aria-hidden="true" className={`${styles["dog-image"]} ${styles["dog-placeholder"]}`}>{dog.name.slice(0, 1).toLocaleUpperCase("es-MX")}</span>
              <span className={styles["dog-identity"]}><small>{dog.breed ?? "Raza no especificada"} · {ageLabel(dog)}</small><strong>{dog.name}</strong></span>
              <span className={styles["dog-stat"]}><small>Peso actual</small><b>{weightLabel(latest)}</b></span>
              <span className={styles["dog-stat"]}><small>Objetivo</small><b>{dog.targetWeight === null ? "No definido" : weightLabel(dog.targetWeight)}</b></span>
              <span className={styles["dog-stat"]}><small>Tendencia</small><b>{difference === null ? "Sin registro" : Math.abs(difference) < .05 ? "Inicio" : `${difference > 0 ? "+" : ""}${difference.toFixed(1)} kg`}</b></span>
              <span className={styles["row-arrow"]} aria-hidden="true">↗</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

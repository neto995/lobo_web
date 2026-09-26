import type { CSSProperties } from "react";
import { currentWeight, type Dog } from "../types";
import styles from "../expediente.module.css";

const dateLabel = (date: string) => new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" }).format(new Date(date)).replace(".", "");

export default function WeightHistory({ dog, onRegister }: { dog: Dog; onRegister: () => void }) {
  const weights = dog.weights.slice(-6);
  const values = [...weights.map((entry) => entry.value), dog.targetWeight];
  const min = Math.min(...values) - .3;
  const max = Math.max(...values) + .3;
  const height = (value: number) => ((value - min) / (max - min)) * 100;

  return (
    <article aria-labelledby="evolucion-title">
      <div className={`${styles["section-heading"]} ${styles["chart-title"]}`}>
        <div><span className={styles["section-code"]}>HISTORIAL / {String(weights.length).padStart(2, "0")} REGISTROS</span><h2 id="evolucion-title">Evolución de {dog.name}</h2></div>
        <div className={styles["current-number"]}>{currentWeight(dog).toFixed(1)} <small>KG ÚLTIMO</small></div>
      </div>
      <div className={styles["chart-area"]} aria-label={`Últimos ${weights.length} registros de peso de ${dog.name}`}>
        <div className={styles["chart-plot"]}>
          <div className={styles["target-line"]} style={{ bottom: `${height(dog.targetWeight)}%` }}><span>Meta {dog.targetWeight.toFixed(1)} kg</span></div>
          <div className={styles.bars}>
            {weights.map((entry) => (
              <div className={styles["bar-column"]} key={entry.id} style={{ "--bar-height": `${height(entry.value)}%` } as CSSProperties}>
                <span className={styles["bar-value"]}>{entry.value.toFixed(1)}</span>
                <i aria-hidden="true" />
                <small><time dateTime={entry.recordedAt}>{dateLabel(entry.recordedAt)}</time></small>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles["chart-caption"]}>
        <p><strong>Cada registro cuenta.</strong> El historial nunca se reemplaza; se acumula para que puedas ver el cambio real.</p>
        <button onClick={onRegister}>Registrar nuevo peso →</button>
      </div>
    </article>
  );
}

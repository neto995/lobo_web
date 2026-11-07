import type { CSSProperties } from "react";
import { currentWeight, type Dog } from "../types";
import styles from "../expediente.module.css";

const dateLabel = (date: string) => new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", timeZone: "America/Mexico_City" }).format(new Date(date)).replace(".", "");

export default function WeightHistory({ dog, onRegister }: { dog: Dog; onRegister: () => void }) {
  const weights = dog.weights.slice(-6);
  const values = [...weights.map((entry) => entry.value), ...(dog.targetWeight === null ? [] : [dog.targetWeight])];
  const min = Math.min(...values) - .3;
  const max = Math.max(...values) + .3;
  const height = (value: number) => ((value - min) / (max - min)) * 100;

  return (
    <article aria-labelledby="evolucion-title">
      <div className={`${styles["section-heading"]} ${styles["chart-title"]}`}>
        <div><span className={styles["section-code"]}>HISTORIAL / {String(dog.weights.length).padStart(2, "0")} REGISTROS</span><h2 id="evolucion-title">Evolución de {dog.name}</h2></div>
        {currentWeight(dog) !== null && <div className={styles["current-number"]}>{currentWeight(dog)?.toFixed(1)} <small>KG ÚLTIMO</small></div>}
      </div>
      {weights.length > 0 ? <div className={styles["chart-area"]} aria-label={`Últimos ${weights.length} registros de peso de ${dog.name}`}>
        <div className={styles["chart-plot"]}>
          {dog.targetWeight !== null && <div className={styles["target-line"]} style={{ bottom: `${height(dog.targetWeight)}%` }}><span>Meta {dog.targetWeight.toFixed(1)} kg</span></div>}
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
      </div> : <p className={styles["empty-history"]}>Todavía no hay registros de peso.</p>}
      {dog.weights.length > 0 && <details className={styles["weight-records"]}>
        <summary>Todos los registros ({dog.weights.length})</summary>
        <div className={styles["weight-table"]}>
          <table>
            <caption className={styles["visually-hidden"]}>Historial completo de peso de {dog.name}</caption>
            <thead><tr><th scope="col">Fecha</th><th scope="col">Peso</th></tr></thead>
            <tbody>{dog.weights.map((entry) => <tr key={entry.id}>
              <td><time dateTime={entry.recordedAt}>{new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Mexico_City" }).format(new Date(entry.recordedAt))}</time></td>
              <td>{entry.value.toFixed(1)} kg</td>
            </tr>)}</tbody>
          </table>
        </div>
      </details>}
      <div className={styles["chart-caption"]}>
        <p><strong>Cada registro cuenta.</strong> El historial nunca se reemplaza; se acumula para que puedas ver el cambio real.</p>
        <button onClick={onRegister}>Registrar nuevo peso →</button>
      </div>
    </article>
  );
}

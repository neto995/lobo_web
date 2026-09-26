import { currentWeight, type Dog } from "../types";
import styles from "../expediente.module.css";

export default function FeedingPlan({ dog, onEdit }: { dog: Dog; onEdit: () => void }) {
  return (
    <aside aria-labelledby="plan-title">
      <div className={styles["section-heading"]}><h2 id="plan-title">Plan actual</h2><span>Editable</span></div>
      <dl className={styles["plan-data"]}>
        <div><dt>Porción diaria</dt><dd>{dog.dailyPortion ? `${dog.dailyPortion} g` : "—"}</dd></div>
        <div><dt>Peso objetivo</dt><dd>{dog.targetWeight.toFixed(1)} kg</dd></div>
        <div><dt>Último peso</dt><dd>{currentWeight(dog).toFixed(1)} kg</dd></div>
        <div><dt>Registros</dt><dd>{dog.weights.length}</dd></div>
      </dl>
      <button className={styles.critical} onClick={onEdit}><span>AJUSTAR INFORMACIÓN</span><span>Editar →</span></button>
    </aside>
  );
}

import Link from "next/link";
import { currentWeight, weightLabel, type Dog } from "../types";
import styles from "../expediente.module.css";

export default function FeedingPlan({ dog, onEdit }: { dog: Dog; onEdit: () => void }) {
  return (
    <aside aria-labelledby="plan-title">
      <div className={styles["section-heading"]}><h2 id="plan-title">Datos de referencia</h2><span>Perfil</span></div>
      <dl className={styles["plan-data"]}>
        <div><dt>Peso objetivo</dt><dd>{dog.targetWeight === null ? "No definido" : weightLabel(dog.targetWeight)}</dd></div>
        <div><dt>Último peso</dt><dd>{weightLabel(currentWeight(dog))}</dd></div>
        <div><dt>Registros</dt><dd>{dog.weights.length}</dd></div>
      </dl>
      <button className={styles.critical} onClick={onEdit}><span>AJUSTAR INFORMACIÓN</span><span>Editar →</span></button>
      <Link className={styles["calculator-link"]} href="/calculadora">Calculadora de alimentación →</Link>
    </aside>
  );
}

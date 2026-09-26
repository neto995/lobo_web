import { currentWeight, type Dog } from "../types";
import styles from "../expediente.module.css";

const fallbackPhotos = [
  "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=85",
];

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
          const difference = currentWeight(dog) - (dog.weights[0]?.value ?? 0);
          return (
            <button key={dog.id} className={`${styles["dog-row"]} ${dog.id === selectedId ? styles.selected : ""}`} onClick={() => onSelect(dog.id)} aria-pressed={dog.id === selectedId}>
              <span className={styles["dog-index"]}>{String(index + 1).padStart(2, "0")}</span>
              <span aria-hidden="true" className={`${styles["dog-image"]} ${dog.photoUrl ? "" : styles["dog-placeholder"]}`} style={{ backgroundImage: `url(${JSON.stringify(dog.photoUrl || fallbackPhotos[index % fallbackPhotos.length])})` }} />
              <span className={styles["dog-identity"]}><small>{dog.breed} · {dog.age}</small><strong>{dog.name}</strong></span>
              <span className={styles["dog-stat"]}><small>Peso actual</small><b>{currentWeight(dog).toFixed(1)} kg</b></span>
              <span className={styles["dog-stat"]}><small>Objetivo</small><b>{dog.targetWeight.toFixed(1)} kg</b></span>
              <span className={styles["dog-stat"]}><small>Tendencia</small><b>{Math.abs(difference) < .05 ? "Inicio" : `${difference > 0 ? "+" : ""}${difference.toFixed(1)} kg`}</b></span>
              <span className={styles["row-arrow"]} aria-hidden="true">↗</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

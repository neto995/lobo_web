import type { Section } from "../types";
import styles from "../expediente.module.css";

const sections: { id: Section; label: string }[] = [
  { id: "resumen", label: "Resumen" },
  { id: "manada", label: "Mis perros" },
  { id: "alimentacion", label: "Alimentación" },
  { id: "evolucion", label: "Evolución" },
];

export function Brand() {
  return <div className={styles.brand}>LOBO<span>.</span></div>;
}

export default function Sidebar({ count, active, open, onNavigate, onClose }: {
  count: number;
  active: Section;
  open: boolean;
  onNavigate: (section: Section) => void;
  onClose: () => void;
}) {
  return (
    <aside id="expediente-menu" className={`${styles.rail} ${open ? styles["rail-open"] : ""}`}>
      <Brand />
      <button className={styles["rail-close"]} onClick={onClose} aria-label="Cerrar menú">×</button>
      <p className={styles["rail-kicker"]}>Mi manada</p>
      <nav aria-label="Navegación del expediente">
        {sections.map(({ id, label }) => (
          <button key={id} className={active === id ? styles.active : undefined} aria-current={active === id ? "page" : undefined} onClick={() => onNavigate(id)}>
            {label}{id === "manada" && <span>{String(count).padStart(2, "0")}</span>}
          </button>
        ))}
      </nav>
      <div className={styles["rail-quote"]}><span>Principio 01</span><p>Si no lo medimos, estamos adivinando.</p></div>
      <div className={styles.person}>
        <div className={styles.avatar} aria-hidden="true">MI</div>
        <div><strong>Mi manada</strong><span>{count} {count === 1 ? "perro" : "perros"}</span></div>
      </div>
    </aside>
  );
}

import styles from "../expediente.module.css";

export default function Topbar({ hasDog, menuOpen, onMenu, onEdit, onCreate }: {
  hasDog: boolean;
  menuOpen: boolean;
  onMenu: () => void;
  onEdit: () => void;
  onCreate: () => void;
}) {
  return (
    <header className={styles.topbar}>
      <button className={styles.menu} onClick={onMenu} aria-label="Abrir menú" aria-expanded={menuOpen} aria-controls="expediente-menu">Menú</button>
      <span className={styles.mono}>MI LOBO · EXPEDIENTE VIVO</span>
      <div className={styles["top-actions"]}>
        {hasDog && <button className={styles["text-button"]} onClick={onEdit}>Editar perfil</button>}
        <button className={styles["black-button"]} onClick={onCreate}>+ Nuevo perro</button>
      </div>
    </header>
  );
}

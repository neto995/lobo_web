import styles from "../expediente.module.css";
import { LogoutButton } from "../SessionBoundary";

export default function Topbar({ hasDog, menuOpen, disabled, onMenu, onEdit, onCreate }: {
  hasDog: boolean;
  menuOpen: boolean;
  disabled: boolean;
  onMenu: () => void;
  onEdit: () => void;
  onCreate: () => void;
}) {
  return (
    <header className={styles.topbar}>
      <button className={styles.menu} onClick={onMenu} aria-label="Abrir menú" aria-expanded={menuOpen} aria-controls="expediente-menu">Menú</button>
      <span className={styles.mono}>MI LOBO · EXPEDIENTE VIVO</span>
      <div className={styles["top-actions"]}>
        <LogoutButton />
        {hasDog && <button className={styles["text-button"]} onClick={onEdit} disabled={disabled}>Editar perfil</button>}
        <button className={styles["black-button"]} onClick={onCreate} disabled={disabled}>+ Nuevo perro</button>
      </div>
    </header>
  );
}

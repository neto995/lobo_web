import { useEffect, useRef, type ReactNode } from "react";
import styles from "../expediente.module.css";

export default function Modal({ code, busy = false, onClose, children }: { code: string; busy?: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const dialog = ref.current;
    dialog?.showModal();
    dialog?.querySelector<HTMLInputElement>("input")?.focus();
    return () => {
      dialog?.close();
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  return (
    <dialog ref={ref} className={`${styles.modal} ${styles["modal-wide"]}`} aria-labelledby="expediente-modal-title" onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }} onClick={(event) => {
      if (busy || event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }}>
      <button type="button" className={styles["modal-close"]} disabled={busy} onClick={onClose} aria-label="Cerrar">×</button>
      <span className={styles["section-code"]}>{code}</span>
      {children}
    </dialog>
  );
}

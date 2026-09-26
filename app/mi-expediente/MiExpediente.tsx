"use client";

import { useEffect, useRef, useState } from "react";
import { usePack } from "./usePack";
import type { DogFormValues, Section } from "./types";
import Sidebar, { Brand } from "./components/Sidebar";
import Topbar from "./components/Topbar";
import PackList from "./components/PackList";
import WeightHistory from "./components/WeightHistory";
import FeedingPlan from "./components/FeedingPlan";
import Modal from "./components/Modal";
import DogForm from "./components/DogForm";
import WeightForm from "./components/WeightForm";
import styles from "./expediente.module.css";

const sectionLabels: Record<Section, string> = { resumen: "Resumen", manada: "Mis perros", alimentacion: "Alimentación", evolucion: "Evolución" };

export default function MiExpediente() {
  const { dogs, loading, error, storageDescription, refresh, createDog, updateDog, recordWeight } = usePack();
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [section, setSection] = useState<Section>("resumen");
  const [mobileNav, setMobileNav] = useState(false);
  const [modal, setModal] = useState<"create" | "edit" | "weight" | null>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedDog = dogs.find((dog) => dog.id === selectedId) ?? dogs[0] ?? null;

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  function flash(message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(""), 4000);
  }

  function navigate(next: Section) {
    setSection(next);
    setMobileNav(false);
  }

  async function saveDog(form: DogFormValues) {
    const editingId = modal === "edit" ? selectedDog?.id : undefined;
    setSaving(true);
    try {
      const saved = editingId ? await updateDog(editingId, form) : await createDog(form);
      setSelectedId(saved.id);
      setModal(null);
      flash(editingId ? "Perfil actualizado." : `${saved.name} ya tiene expediente.`);
    } finally {
      setSaving(false);
    }
  }

  async function saveWeight(value: number) {
    if (!selectedDog) return;
    setSaving(true);
    try {
      const saved = await recordWeight(selectedDog.id, value);
      setModal(null);
      flash(`Peso de ${saved.name} registrado.`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className={`${styles.root} ${styles["loading-screen"]}`} aria-busy="true"><Brand /><p role="status">Abriendo el expediente…</p></main>;

  return (
    <div className={`${styles.root} ${styles["app-shell"]}`}>
      <Sidebar count={dogs.length} active={section} open={mobileNav} onNavigate={navigate} onClose={() => setMobileNav(false)} />
      {mobileNav && <button className={styles["menu-backdrop"]} aria-label="Cerrar menú" onClick={() => setMobileNav(false)} />}
      <main className={styles.workspace}>
        <Topbar hasDog={!!selectedDog} menuOpen={mobileNav} onMenu={() => setMobileNav(true)} onEdit={() => setModal("edit")} onCreate={() => setModal("create")} />
        {error ? (
          <div className={styles["page-error"]} role="alert"><strong>No pudimos cargar tus datos.</strong><span>{error}</span><button onClick={() => { void refresh(); }}>Intentar de nuevo</button></div>
        ) : !selectedDog ? (
          <section className={styles["empty-state"]}>
            <p className={styles["section-code"]}>PRIMER REGISTRO / 01</p>
            <h1>Empieza con<br /><em>un solo perro.</em></h1>
            <p>Nombre, peso y objetivo. Es suficiente para abrir su expediente y dejar de improvisar.</p>
            <button className={styles["black-button"]} onClick={() => setModal("create")}>Crear primer expediente</button>
          </section>
        ) : (
          <>
            <section className={`${styles.opening} ${styles["compact-opening"]}`}>
              <div>
                <p className={styles["section-code"]}>EXPEDIENTE VIVO / {sectionLabels[section]}</p>
                <h1>Tu manada,<br /><em>sin improvisar.</em></h1>
              </div>
              <aside className={styles["profile-summary"]}>
                <span className={styles.mono}>PERFIL ACTIVO</span><strong>{selectedDog.name}</strong>
                <p>{selectedDog.breed} · {selectedDog.age} · {selectedDog.sex}</p>
                <button onClick={() => setModal("edit")}>Corregir datos →</button>
              </aside>
            </section>
            <PackList dogs={dogs} selectedId={selectedDog.id} onSelect={setSelectedId} />
            {section !== "manada" && (
              <section className={`${styles["dashboard-grid"]} ${section !== "resumen" ? styles["single-panel"] : ""}`}>
                {section !== "alimentacion" && <WeightHistory dog={selectedDog} onRegister={() => setModal("weight")} />}
                {section !== "evolucion" && <FeedingPlan dog={selectedDog} onEdit={() => setModal("edit")} />}
              </section>
            )}
          </>
        )}
        <p className={styles["storage-note"]}>{storageDescription}</p>
      </main>
      {modal && (
        <Modal code={modal === "weight" ? `${selectedDog?.name} / NUEVO REGISTRO` : modal === "edit" ? "EDITAR EXPEDIENTE" : "NUEVO EXPEDIENTE"} busy={saving} onClose={() => setModal(null)}>
          {modal === "weight" && selectedDog ? <WeightForm dog={selectedDog} saving={saving} onSave={saveWeight} /> : <DogForm dog={modal === "edit" ? selectedDog ?? undefined : undefined} saving={saving} onSave={saveDog} />}
        </Modal>
      )}
      <div className={styles.toast} role="status" aria-live="polite" aria-atomic="true">{toast}</div>
    </div>
  );
}

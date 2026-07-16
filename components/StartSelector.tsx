"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import TabImageCarousel from "@/components/TabImageCarousel";

const probarImages = [
  {
    src: "/images/tabs/probar/probar-premium-box-dana-card.webp",
    alt: "Dana mostrando el Premium Box de LOBO",
    position: "object-[50%_20%]",
  },
  {
    src: "/images/tabs/probar/probar-premium-box-open-card.webp",
    alt: "Premium Box de LOBO abierto con producto",
  },
  {
    src: "/images/tabs/probar/probar-premium-box-ribbon-card.webp",
    alt: "Premium Box de LOBO con listón y producto listo para entregar",
  },
];

const mezclarImages = [
  {
    src: "/images/tabs/mezclar/mezclar-ia-1.jpg",
    alt: "Dana mostrando porciones LOBO para mix feeding",
  },
  {
    src: "/images/tabs/mezclar/mezclar-ia-2.jpg",
    alt: "Porciones LOBO listas para mezclar con comida actual",
  },
  {
    src: "/images/tabs/mezclar/mezclar-ia-3.jpg",
    alt: "Perros probando LOBO como parte de mix feeding",
  },
];

const startOptions = [
  {
    id: "probar",
    label: "Probar",
    title: "Premium Box.",
    eyebrow: "10 porciones",
    copy: "10 porciones para ver si le gusta y cómo le cae. Sin comprar todo el mes.",
    cta: "Ver Premium Box",
    href: "/#planes",
    image: {
      src: probarImages[0].src,
      alt: probarImages[0].alt,
      position: "object-center",
    },
  },
  {
    id: "plan",
    label: "Plan mensual",
    title: "Plan mensual.",
    eyebrow: "Entrega programada",
    copy: "Porciones programadas para hacerlo constante. Sin volver a improvisar cada semana.",
    cta: "Ver planes",
    href: "/#planes",
    image: {
      src: "/ingredientes_3.png",
      alt: "Porciones LOBO programadas para el plato diario de un perro",
      position: "object-[50%_34%]",
    },
  },
  {
    id: "mezclar",
    label: "Mezclar",
    title: "Mix feeding.",
    eyebrow: "20-30% LOBO",
    copy: "Empieza con 20-30% LOBO sin quitar toda su comida actual. El problema no es mezclar. Es hacerlo sin criterio.",
    cta: "Calcular su mix",
    href: "/calculadora",
    image: {
      src: "/lobo_brutal.png",
      alt: "Comida LOBO con res, camote y vegetales para mezclar con la comida actual",
      position: "object-[18%_78%]",
    },
  },
];

type StartOption = (typeof startOptions)[number];

export default function StartSelector() {
  const [activeId, setActiveId] = useState<StartOption["id"]>("probar");
  const active = useMemo(
    () =>
      startOptions.find((option) => option.id === activeId) ?? startOptions[1],
    [activeId],
  );
  const isCalculator = active.href === "/calculadora";

  return (
    <section className="relative overflow-clip bg-white px-4 py-14 text-carbon sm:px-6 md:py-20">
      {/* Manchas difusas: materia para que el cristal del toggle refracte */}
      <div
        aria-hidden="true"
        className="aurora-drift-layer pointer-events-none absolute inset-0"
      >
        <div className="absolute right-[2%] top-[4%] h-64 w-64 rounded-full bg-rojo/22 blur-2xl" />
        <div className="absolute right-[24%] top-[12%] h-56 w-56 rounded-full bg-[#8A6632]/26 blur-2xl" />
        <div className="absolute right-[12%] top-[2%] h-48 w-48 rounded-full bg-[#5C6E3C]/18 blur-2xl" />
        <div className="absolute left-[4%] top-[34%] h-80 w-80 rounded-full bg-[#8A6632]/14 blur-3xl" />
        <div className="absolute bottom-[4%] right-[26%] h-72 w-72 rounded-full bg-hueso/90 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-7 md:grid-cols-[0.7fr_1fr] md:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-rojo sm:text-[11px]">
              Elige una entrada
            </p>
            <h2 className="mt-4 text-4xl uppercase leading-[0.92] sm:text-5xl">
              ¿Cómo quieres empezar?
            </h2>
          </div>

          <div
            aria-label="Opciones para empezar con LOBO"
            className="liquid-glass grid grid-cols-3 overflow-hidden rounded-full p-1"
            role="tablist"
          >
            {startOptions.map((option) => {
              const selected = option.id === active.id;

              return (
                <button
                  key={option.id}
                  aria-controls="start-selector-panel"
                  aria-selected={selected}
                  className={`min-h-12 items-center rounded-full px-3 text-xs font-black uppercase tracking-wide transition sm:text-sm ${
                    selected
                      ? "liquid-glass-strong text-carbon"
                      : "border border-transparent text-carbon/52 hover:bg-white/30 hover:text-carbon"
                  }`}
                  role="tab"
                  type="button"
                  onClick={() => setActiveId(option.id)}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full transition ${
                        selected ? "bg-rojo" : "bg-transparent"
                      }`}
                    />
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <article
          id="start-selector-panel"
          className="frosted-glass mt-8 grid overflow-hidden rounded-lg md:grid-cols-[1.08fr_0.92fr]"
          role="tabpanel"
        >
          <div className="relative min-h-[19rem] overflow-hidden bg-negro sm:min-h-[24rem] md:min-h-[30rem]">
            {active.id === "probar" ? (
              <TabImageCarousel key="probar" images={probarImages} />
            ) : active.id === "plan" ? (
              <video
                className="aspect-[4/5] w-full rounded-3xl border border-black/10 bg-black object-cover shadow-2xl"
                controls
                playsInline
                preload="metadata"
                poster="/videos/plan-mensual-poster-card.webp"
              >
                <source
                  src="/videos/plan-mensual-lobo.mp4"
                  type="video/mp4"
                />
                Tu navegador no soporta video.
              </video>
            ) : (
              <TabImageCarousel key="mezclar" images={mezclarImages} />
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,8,0)_35%,rgba(10,9,8,0.58)_100%)]"
            />
          </div>

          <div className="flex flex-col justify-between bg-white/18 p-5 sm:p-7 md:p-9">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-rojo sm:text-[11px]">
                {active.eyebrow}
              </p>
              <h3 className="mt-4 text-4xl uppercase leading-none sm:text-5xl">
                {active.title}
              </h3>
              <p className="mt-5 max-w-sm text-base leading-7 text-ceniza">
                {active.copy}
              </p>
            </div>

            <Link
              href={active.href}
              className={`glass-btn mt-8 inline-flex min-h-13 items-center justify-center rounded-full px-7 text-xs font-black uppercase tracking-wide sm:w-fit ${
                isCalculator
                  ? "glass-btn--dark text-hueso hover:text-white"
                  : "glass-btn--light text-carbon"
              }`}
            >
              {active.cta}
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

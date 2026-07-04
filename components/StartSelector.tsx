"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

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
      src: "/lobo_brutal.png",
      alt: "Premium Box LOBO para probar comida real cocinada para perros",
      position: "object-[54%_36%]",
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
];

type StartOption = (typeof startOptions)[number];

export default function StartSelector() {
  const [activeId, setActiveId] = useState<StartOption["id"]>("mezclar");
  const active = useMemo(
    () =>
      startOptions.find((option) => option.id === activeId) ?? startOptions[1],
    [activeId],
  );
  const isCalculator = active.href === "/calculadora";

  return (
    <section className="relative overflow-clip bg-white px-4 py-14 text-carbon sm:px-6 md:py-20">
      {/* Manchas difusas: materia para que el cristal del toggle refracte */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
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
          className="mt-8 grid overflow-hidden rounded-lg border border-carbon/10 bg-white/44 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_24px_70px_rgba(20,17,15,0.08)] backdrop-blur-xl md:grid-cols-[1.08fr_0.92fr]"
          role="tabpanel"
        >
          <div className="relative min-h-[19rem] overflow-hidden bg-negro sm:min-h-[24rem] md:min-h-[30rem]">
            <Image
              key={active.image.src + active.image.position}
              src={active.image.src}
              alt={active.image.alt}
              fill
              sizes="(min-width: 768px) 56vw, 100vw"
              className={`object-cover ${active.image.position}`}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,8,0)_35%,rgba(10,9,8,0.58)_100%)]"
            />
          </div>

          <div className="flex flex-col justify-between bg-hueso/38 p-5 sm:p-7 md:p-9">
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
              className={`mt-8 inline-flex min-h-13 items-center justify-center rounded-full px-7 text-xs font-black uppercase tracking-wide transition sm:w-fit ${
                isCalculator
                  ? "border border-carbon/20 bg-carbon/92 text-hueso shadow-[inset_0_1px_0_rgba(244,239,227,0.16)] backdrop-blur-md hover:bg-rojo"
                  : "border border-carbon/14 bg-white/54 text-carbon shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-md hover:border-carbon/24 hover:bg-white"
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

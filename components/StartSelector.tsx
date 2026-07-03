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
    () => startOptions.find((option) => option.id === activeId) ?? startOptions[1],
    [activeId],
  );
  const isCalculator = active.href === "/calculadora";

  return (
    <section className="bg-white px-4 py-14 text-carbon sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
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
            className="grid grid-cols-3 overflow-hidden rounded-full border border-carbon/12 bg-hueso p-1"
            role="tablist"
          >
            {startOptions.map((option) => {
              const selected = option.id === active.id;

              return (
                <button
                  key={option.id}
                  aria-controls="start-selector-panel"
                  aria-selected={selected}
                  className={`min-h-12 rounded-full px-3 text-xs font-black uppercase tracking-wide transition sm:text-sm ${
                    selected
                      ? "bg-carbon text-hueso shadow-[0_10px_28px_rgba(20,17,15,0.18)]"
                      : "text-carbon/58 hover:text-carbon"
                  }`}
                  role="tab"
                  type="button"
                  onClick={() => setActiveId(option.id)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <article
          id="start-selector-panel"
          className="mt-8 grid overflow-hidden rounded-lg border border-carbon/10 bg-hueso shadow-[0_24px_70px_rgba(20,17,15,0.08)] md:grid-cols-[1.08fr_0.92fr]"
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

          <div className="flex flex-col justify-between p-5 sm:p-7 md:p-9">
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
                  ? "bg-carbon text-hueso hover:bg-rojo"
                  : "border border-carbon/20 bg-white text-carbon hover:border-carbon hover:bg-carbon hover:text-hueso"
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

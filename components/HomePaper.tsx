import Link from "next/link";

const tickerItems = [
  "Más comida. Menos marketing.",
  "Comida real cocinada",
  "Sin rellenos. Sin teatro.",
  "Guadalajara y Zapopan",
];

export function BrandTicker() {
  return (
    <div className="overflow-clip bg-rojo py-3">
      <div className="ticker-track">
        {[0, 1].map((half) => (
          <div
            key={half}
            aria-hidden={half === 1 || undefined}
            className="flex shrink-0 items-center"
          >
            {tickerItems.map((item) => (
              <span
                key={item}
                className="whitespace-nowrap px-6 font-mono text-xs font-bold uppercase tracking-[0.22em] text-hueso"
              >
                {item} <span aria-hidden="true">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const noteReal = [
  { item: "Pollo y res", value: "Proteína real" },
  { item: "Arroz integral y camote", value: "Energía" },
  { item: "Zanahoria · chícharos · manzana", value: "Visibles" },
  { item: "Caldo natural de cocción", value: "Húmedo" },
];

const noteZeros = [
  { item: "Conservadores", value: "0" },
  { item: "Colorantes artificiales", value: "0" },
  { item: "Rellenos", value: "0" },
  { item: "Teatro", value: "0" },
];

export function KitchenNote() {
  return (
    <section className="bg-hueso px-4 py-16 text-carbon sm:px-6 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1fr] md:items-center">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-rojo sm:text-[11px]">
            Qué es LOBO
          </p>
          <h2 className="mt-4 text-4xl uppercase leading-[0.92] sm:text-5xl md:text-6xl">
            Lo que lleva. Y lo que no.
          </h2>
          <p className="mt-6 max-w-[27rem] text-base leading-7 text-ceniza md:text-lg md:leading-8">
            Comida húmeda cocinada, porcionada en 200 g, lista para servir sola
            o mezclar con croquetas. Sin letra chica: la receta completa cabe en
            una nota.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <article className="reveal-card rotate-1 border border-carbon/15 bg-white p-6 font-mono shadow-[0_24px_50px_rgba(20,17,15,0.12)] sm:p-8">
            <header className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em]">
                LOBO
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-ceniza">
                Nota de cocina · GDL / Zapopan
              </p>
            </header>

            <div className="my-5 border-t border-dashed border-carbon/30" />

            <ul className="grid gap-2.5 text-xs uppercase tracking-[0.08em]">
              {noteReal.map((line) => (
                <li
                  key={line.item}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span>{line.item}</span>
                  <span className="shrink-0 text-ceniza">{line.value}</span>
                </li>
              ))}
            </ul>

            <div className="my-5 border-t border-dashed border-carbon/30" />

            <ul className="grid gap-2.5 text-xs uppercase tracking-[0.08em]">
              {noteZeros.map((line) => (
                <li
                  key={line.item}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span>{line.item}</span>
                  <span className="shrink-0 font-bold text-rojo">
                    {line.value}
                  </span>
                </li>
              ))}
            </ul>

            <div className="my-5 border-t border-dashed border-carbon/30" />

            <p className="flex items-baseline justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.22em]">
                Total
              </span>
              <span className="font-display text-2xl uppercase leading-none">
                Comida real
              </span>
            </p>

            <p className="mt-5 text-[10px] uppercase leading-5 tracking-[0.06em] text-ceniza">
              Porciones listas para mezclar con su comida actual. Entrega en
              Guadalajara y Zapopan.
            </p>
          </article>

          <span className="stamp absolute -top-4 right-1 rotate-6 bg-white px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] sm:text-[11px]">
            12.7% proteína real
          </span>
        </div>
      </div>
    </section>
  );
}

const mixSteps = [
  {
    value: "20%",
    label: "Probar",
    copy: "Entrada suave para ver apetito y tolerancia.",
  },
  {
    value: "30%",
    label: "Mejorar",
    copy: "Más comida real sin cambiar toda la rutina.",
  },
  {
    value: "40%",
    label: "Sostener",
    copy: "Un mix diario con más presencia de LOBO.",
  },
];

export function MixNumbers() {
  return (
    <section className="bg-white px-4 py-16 text-carbon sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-rojo sm:text-[11px]">
              Mix feeding
            </p>
            <h2 className="mt-4 text-4xl uppercase leading-[0.92] sm:text-5xl md:text-6xl">
              No cambies todo. Cambia el criterio.
            </h2>
          </div>
          <p className="text-base leading-7 text-ceniza md:text-lg md:leading-8">
            Empieza con un porcentaje realista, mantén la base que tu perro ya
            conoce y ajusta según apetito, popó, peso y saciedad.
          </p>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-6">
          {mixSteps.map((step) => (
            <article key={step.value} className="reveal-card">
              <p className="font-display text-7xl uppercase leading-none text-rojo md:text-8xl">
                {step.value}
              </p>
              <h3 className="mt-4 text-2xl uppercase leading-none">
                {step.label}
              </h3>
              <p className="mt-3 max-w-[18rem] text-sm leading-6 text-ceniza">
                {step.copy}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 border-t border-carbon/10 pt-6">
          <Link
            href="/calculadora"
            className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-carbon underline decoration-rojo decoration-2 underline-offset-4 transition hover:text-rojo"
          >
            Calcular el porcentaje de tu perro →
          </Link>
        </div>
      </div>
    </section>
  );
}

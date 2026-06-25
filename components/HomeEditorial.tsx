import Link from "next/link";

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

export function HomeIntro() {
  return (
    <section className="bg-[#F4EFE3] px-4 py-16 text-[#14110F] sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#A93622]">
            Qué es LOBO
          </p>
          <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] tracking-normal sm:text-5xl md:text-6xl">
            Comida real para mejorar el plato diario.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="rounded-lg bg-white p-6 shadow-[0_18px_55px_rgba(20,17,15,0.08)] md:col-span-2 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#A93622]">
              En una frase
            </p>
            <h3 className="mt-4 text-2xl font-black uppercase leading-tight md:text-4xl">
              LOBO es comida real cocinada para perros en Guadalajara.
            </h3>
            <p className="mt-5 max-w-2xl text-base leading-7 text-black/66 md:text-lg md:leading-8">
              Porciones húmedas, listas para servir o mezclar con croquetas.
            </p>
          </article>

          <article className="rounded-lg bg-[#14110F] p-6 text-[#F4EFE3] shadow-[0_18px_55px_rgba(20,17,15,0.12)] md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#C9BDAA]">
              Sin cambiar todo
            </p>
            <h3 className="mt-4 text-2xl font-black uppercase leading-tight">
              Empieza con mix feeding.
            </h3>
            <p className="mt-4 text-sm leading-6 text-[#DED4C4]">
              Mejora el plato sin mover toda la rutina desde el primer día.
            </p>
          </article>

          <article className="rounded-lg bg-white/70 p-6 shadow-[0_18px_55px_rgba(20,17,15,0.06)] md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#A93622]">
              Criterio
            </p>
            <h3 className="mt-4 text-2xl font-black uppercase leading-tight">
              Mide, observa y ajusta.
            </h3>
            <p className="mt-4 text-sm leading-6 text-black/62">
              El problema no es mezclar. El problema es hacerlo sin criterio.
            </p>
          </article>

          <article className="rounded-lg bg-white/70 p-6 shadow-[0_18px_55px_rgba(20,17,15,0.06)] md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#A93622]">
              GDL / Zapopan
            </p>
            <h3 className="mt-4 text-2xl font-black uppercase leading-tight">
              Comida para perros en GDL.
            </h3>
            <p className="mt-4 text-sm leading-6 text-black/62">
              Entregas locales y planes claros para hacerlo práctico.
            </p>
          </article>

          <article className="rounded-lg border border-black/10 bg-[#FBF7EF] p-6 shadow-[0_18px_55px_rgba(20,17,15,0.06)] md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#A93622]">
              Siguiente paso
            </p>
            <h3 className="mt-4 text-2xl font-black uppercase leading-tight">
              Elige cómo empezar.
            </h3>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link
              href="/comida-real-cocinada-para-perros"
              className="inline-flex justify-center rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-wide text-[#F4EFE3] transition hover:bg-[#A93622]"
            >
              Comida real cocinada
            </Link>
            <Link
              href="/comida-cocinada-para-perros-guadalajara"
              className="inline-flex justify-center rounded-full border border-black/15 px-5 py-3 text-xs font-black uppercase tracking-wide text-black/70 transition hover:bg-white hover:text-black"
            >
              Comida para perros en GDL
            </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function MixFeedingSection() {
  return (
    <section className="bg-white px-4 py-16 text-[#14110F] sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#A93622]">
              Mix feeding
            </p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] tracking-normal sm:text-5xl md:text-6xl">
              No cambies todo. Cambia el criterio.
            </h2>
          </div>

          <p className="text-base leading-7 text-black/66 md:text-xl md:leading-8">
            Empieza con un porcentaje realista de LOBO, mantén una base que tu
            perro ya conoce y ajusta según apetito, popó, peso y saciedad.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden bg-black/10 md:grid-cols-3">
          {mixSteps.map((step) => (
            <article key={step.value} className="bg-white p-6 md:p-8">
              <p className="text-6xl font-black leading-none text-[#A93622] md:text-7xl">
                {step.value}
              </p>
              <h3 className="mt-5 text-2xl font-black uppercase leading-tight">
                {step.label}
              </h3>
              <p className="mt-3 text-sm leading-6 text-black/62">
                {step.copy}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/calculadora"
            className="inline-flex justify-center rounded-full bg-black px-7 py-4 text-xs font-black uppercase tracking-wide text-[#F4EFE3] transition hover:bg-[#A93622]"
          >
            Usa la calculadora LOBO
          </Link>
          <Link
            href="/mix-feeding-para-perros"
            className="inline-flex justify-center rounded-full border border-black/15 px-7 py-4 text-xs font-black uppercase tracking-wide text-[#14110F] transition hover:bg-[#F4EFE3]"
          >
            Leer sobre mix feeding
          </Link>
        </div>
      </div>
    </section>
  );
}

export function CalculatorSpotlight() {
  return (
    <section className="bg-[#14110F] px-4 py-16 text-[#F4EFE3] sm:px-6 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#C9BDAA]">
            Calculadora LOBO
          </p>
          <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] tracking-normal sm:text-5xl md:text-7xl">
            Calcula antes de servir.
          </h2>
        </div>

        <div>
          <p className="text-lg leading-8 text-[#DED4C4] md:text-xl md:leading-9">
            Peso, etapa, silueta, movimiento real y porcentaje de mix feeding.
            La calculadora convierte eso en una porción inicial para empezar con
            más criterio.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden bg-white/10 text-sm font-bold uppercase tracking-wide text-[#F4EFE3] sm:grid-cols-4">
            {["Peso", "Etapa", "Movimiento", "Mix"].map((item) => (
              <div key={item} className="bg-[#14110F] p-4">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/calculadora"
              className="inline-flex justify-center rounded-full bg-[#F4EFE3] px-7 py-4 text-xs font-black uppercase tracking-wide text-black transition hover:bg-white"
            >
              Calcula su mix
            </Link>
            <a
              href="https://wa.me/5213330626243"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-full border border-white/20 px-7 py-4 text-xs font-black uppercase tracking-wide text-[#F4EFE3] transition hover:bg-white/10"
            >
              Mándanos su peso
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CriterionSection() {
  return (
    <section className="bg-[#F4EFE3] px-4 py-16 text-[#14110F] sm:px-6 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1fr] md:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#A93622]">
            Criterio
          </p>
          <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] sm:text-5xl md:text-6xl">
            Medir importa más que prometer.
          </h2>
        </div>

        <div className="grid gap-6 text-base leading-7 text-black/66 md:text-lg md:leading-8">
          <p>
            LOBO no vende curas ni frases enormes. Vendemos una forma práctica
            de sumar comida real, con porciones claras y seguimiento.
          </p>
          <div className="grid gap-px overflow-hidden bg-black/10">
            {["Mide la porción", "Observa respuesta", "Ajusta con calma"].map(
              (item) => (
                <p
                  key={item}
                  className="bg-[#F4EFE3] py-4 text-xl font-black uppercase leading-tight text-black"
                >
                  {item}
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeFooter() {
  return (
    <footer className="bg-black px-4 py-14 text-[#F4EFE3] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1fr_0.7fr] md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#C9BDAA]">
              LOBO
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-[0.92] sm:text-5xl md:text-7xl">
              Más comida. Menos marketing.
            </h2>
          </div>

          <div className="grid gap-3">
            <Link
              href="/calculadora"
              className="inline-flex justify-center rounded-full bg-[#F4EFE3] px-7 py-4 text-xs font-black uppercase tracking-wide text-black transition hover:bg-white"
            >
              Usar calculadora
            </Link>
            <a
              href="https://wa.me/5213330626243"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-full border border-white/20 px-7 py-4 text-xs font-black uppercase tracking-wide text-[#F4EFE3] transition hover:bg-white/10"
            >
              WhatsApp LOBO
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-6 text-xs font-bold uppercase tracking-wide text-white/55">
          <Link href="/comida-real-cocinada-para-perros">Comida real</Link>
          <Link href="/mix-feeding-para-perros">Mix feeding</Link>
          <Link href="/comida-cocinada-para-perros-guadalajara">
            GDL/Zapopan
          </Link>
          <Link href="/articulos">Artículos</Link>
        </div>
      </div>
    </footer>
  );
}

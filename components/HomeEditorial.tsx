import Link from "next/link";

export function CalculatorSpotlight() {
  return (
    <section className="bg-carbon px-4 py-16 text-hueso sm:px-6 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-center">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-arena">
            Calculadora LOBO
          </p>
          <h2 className="mt-4 text-4xl uppercase leading-[0.92] sm:text-5xl md:text-7xl">
            Calcula antes de servir.
          </h2>
        </div>

        <div>
          <p className="text-lg leading-8 text-arena md:text-xl md:leading-9">
            Peso, etapa, silueta, movimiento real y porcentaje de mix feeding.
            La calculadora convierte eso en una porción inicial para empezar con
            más criterio.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden bg-white/10 font-mono text-xs uppercase tracking-[0.14em] text-hueso sm:grid-cols-4">
            {["Peso", "Etapa", "Movimiento", "Mix"].map((item) => (
              <div key={item} className="bg-carbon p-4">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/calculadora"
              className="inline-flex justify-center rounded-full bg-hueso px-7 py-4 text-xs font-black uppercase tracking-wide text-negro transition hover:bg-white"
            >
              Calcula su mix
            </Link>
            <a
              href="https://wa.me/5213330626243"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-full border border-white/20 px-7 py-4 text-xs font-black uppercase tracking-wide text-hueso transition hover:bg-white/10"
            >
              Mándanos su peso
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeFooter() {
  return (
    <footer className="bg-negro px-4 py-14 text-hueso sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1fr_0.7fr] md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-arena">
              LOBO
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl uppercase leading-[0.92] sm:text-5xl md:text-7xl">
              Más comida. Menos marketing.
            </h2>
          </div>

          <div className="grid gap-3">
            <Link
              href="/calculadora"
              className="inline-flex justify-center rounded-full bg-hueso px-7 py-4 text-xs font-black uppercase tracking-wide text-negro transition hover:bg-white"
            >
              Usar calculadora
            </Link>
            <a
              href="https://wa.me/5213330626243"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-full border border-white/20 px-7 py-4 text-xs font-black uppercase tracking-wide text-hueso transition hover:bg-white/10"
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

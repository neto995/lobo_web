import Link from "next/link";

export function CalculatorSpotlight() {
  return (
    <section className="border-y border-carbon/10 bg-white px-4 py-16 text-carbon sm:px-6 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-rojo">
            Calculadora LOBO
          </p>
          <h2 className="mt-4 text-4xl uppercase leading-[0.92] sm:text-5xl md:text-7xl">
            No adivines cuánto darle.
          </h2>
        </div>

        <div>
          <p className="text-lg leading-8 text-ceniza md:text-xl md:leading-9">
            Calcula una opción según su peso, edad y objetivo.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden border border-carbon/15 bg-carbon/10 font-mono text-[10px] uppercase tracking-[0.14em] text-carbon sm:text-xs">
            {["Peso", "Etapa", "Objetivo"].map((item) => (
              <div key={item} className="bg-hueso p-4">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/calculadora"
              className="inline-flex min-h-13 w-full items-center justify-center rounded-full bg-rojo px-7 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#c1442d] sm:w-auto"
            >
              Calcular su mix
            </Link>
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

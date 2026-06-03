import Calculator from "@/components/Calculator";

export default function CalculadoraPage() {
  return (
    <main className="min-h-screen bg-[#F4EFE3] text-black">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(169,54,34,0.16),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(0,0,0,0.08),transparent_28%)]" />

        <header className="relative z-10 px-5 pt-6 md:px-8 md:pt-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <a
              href="/"
              className="rounded-full border border-black/10 bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.35em] text-[#F4EFE3] shadow-lg shadow-black/10 transition hover:bg-[#A93622]"
            >
              LOBO
            </a>

            <a
              href="/#planes"
              className="rounded-full border border-black/10 bg-white/60 px-5 py-3 text-xs font-bold uppercase tracking-wide text-black backdrop-blur transition hover:bg-white"
            >
              Ver planes
            </a>
          </div>
        </header>

        <section className="relative z-10 mx-auto max-w-6xl px-5 pb-12 pt-14 md:px-8 md:pb-20 md:pt-20">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="uppercase tracking-[0.3em] text-xs font-bold text-[#A93622] md:text-sm">
                Calculadora LOBO
              </p>

              <h1 className="mt-5 max-w-3xl text-5xl font-black uppercase leading-[0.88] tracking-tight text-black md:text-7xl lg:text-8xl">
                Arma su plan con criterio.
              </h1>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white/55 p-5 shadow-xl shadow-black/5 backdrop-blur md:p-7">
              <p className="text-base leading-7 text-black/70 md:text-lg">
                Calcula una estimación inicial según peso, etapa, silueta,
                movimiento real y objetivo. Luego ajusta el porcentaje de LOBO
                para encontrar un plan realista.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#F4EFE3]">
                  Mix feeding
                </span>

                <span className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-wide text-black/70">
                  Sin cambiar todo
                </span>

                <span className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-wide text-black/70">
                  Plan personalizado
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 md:mt-14">
            <Calculator />
          </div>
        </section>
      </div>
    </main>
  );
}
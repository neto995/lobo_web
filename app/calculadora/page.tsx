import type { Metadata } from "next";
import Calculator from "@/components/Calculator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Calculadora LOBO | Calcula el plan ideal para tu perro",
  description:
    "Calcula una estimación inicial de porciones LOBO según peso, etapa, silueta, movimiento real y mix feeding con croquetas.",
  alternates: {
    canonical: "/calculadora",
  },
  openGraph: {
    title: "Calculadora LOBO | Calcula el plan ideal para tu perro",
    description:
      "Calcula una estimación inicial de porciones LOBO según peso, etapa, silueta, movimiento real y mix feeding con croquetas.",
    url: "/calculadora",
  },
  twitter: {
    title: "Calculadora LOBO | Calcula el plan ideal para tu perro",
    description:
      "Calcula una estimación inicial de porciones LOBO según peso, etapa, silueta, movimiento real y mix feeding con croquetas.",
  },
};

export default function CalculadoraPage() {
  return (
    <main className="min-h-screen bg-[#F4EFE3] text-black">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(169,54,34,0.16),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(0,0,0,0.08),transparent_28%)]" />

        <header className="relative z-10 px-4 pt-4 sm:px-5 sm:pt-6 md:px-8 md:pt-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link
              href="/"
              className="rounded-full border border-black/10 bg-black px-4 py-2.5 text-xs font-black uppercase tracking-[0.3em] text-[#F4EFE3] shadow-lg shadow-black/10 transition hover:bg-[#A93622] sm:px-5 sm:py-3 sm:text-sm sm:tracking-[0.35em]"
            >
              LOBO
            </Link>

            <Link
              href="/#planes"
              className="rounded-full border border-black/10 bg-white/60 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-black backdrop-blur transition hover:bg-white sm:px-5 sm:py-3 sm:text-xs"
            >
              Ver planes
            </Link>
          </div>
        </header>

        <section className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-5 sm:pt-14 md:px-8 md:pb-20 md:pt-20">
          <div>
            <p className="uppercase tracking-[0.3em] text-xs font-bold text-[#A93622] md:text-sm">
              Calculadora LOBO
            </p>

            <h1 className="mt-4 max-w-[12ch] text-4xl font-black uppercase leading-[0.9] tracking-tight text-black sm:mt-5 sm:max-w-none sm:text-5xl md:text-7xl lg:whitespace-nowrap lg:text-7xl">
              Arma su plan con criterio.
            </h1>

            <div className="mt-8 sm:mt-10 md:mt-14">
              <Calculator />
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-black/10 bg-white/45 p-4 shadow-xl shadow-black/5 backdrop-blur sm:mt-10 sm:rounded-3xl sm:p-5 md:mt-14 md:p-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#A93622] md:text-xs">
                Metodología
              </p>

              <p className="mt-4 text-sm leading-6 text-black/65 md:text-base md:leading-7">
                <span className="font-bold text-black">
                  No calculamos “al tanteo”.
                </span>{" "}
                Usamos RER/MER como base energética, ajustamos por etapa,
                silueta y movimiento real, y después convertimos esas kcal en
                una mezcla práctica de LOBO + croqueta.{" "}
                <span className="font-semibold text-black/80">
                  Es una estimación, pero tiene criterio.
                </span>
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
              <Link
                href="/mix-feeding-para-perros"
                className="rounded-full bg-black px-3 py-2 text-[9px] font-bold uppercase tracking-wide text-[#F4EFE3] transition hover:bg-[#A93622] sm:text-[10px] md:text-xs"
              >
                Mix feeding
              </Link>

              <Link
                href="/comida-real-cocinada-para-perros"
                className="rounded-full border border-black/10 bg-white/60 px-3 py-2 text-[9px] font-bold uppercase tracking-wide text-black/65 transition hover:bg-white hover:text-black sm:text-[10px] md:text-xs"
              >
                Comida real cocinada
              </Link>

              <a
                href="https://wa.me/5213330626243"
                target="_blank"
                className="rounded-full border border-black/10 bg-white/60 px-3 py-2 text-[9px] font-bold uppercase tracking-wide text-black/65 transition hover:bg-white hover:text-black sm:text-[10px] md:text-xs"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

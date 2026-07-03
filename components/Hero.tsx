import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate overflow-clip bg-negro px-4 pb-8 pt-24 text-hueso sm:px-6 md:min-h-[760px] md:pb-14 md:pt-32"
    >
      <Image
        src="/lobo_brutal.png"
        alt="Bolsa LOBO de comida real cocinada para perros con ingredientes visibles"
        fill
        preload
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[58%_40%] md:object-[62%_46%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,9,8,0.28)_0%,rgba(10,9,8,0.42)_34%,rgba(10,9,8,0.86)_100%)] md:bg-[linear-gradient(90deg,rgba(10,9,8,0.88)_0%,rgba(10,9,8,0.62)_42%,rgba(10,9,8,0.16)_100%)]"
      />

      <div className="mx-auto flex min-h-[calc(100svh-8rem)] max-w-6xl items-end md:min-h-[600px] md:items-center">
        <div className="hero-enter glass-panel w-full max-w-xl p-5 shadow-[0_28px_80px_rgba(0,0,0,0.34)] sm:p-7 md:p-8">
          <h1 className="text-[2.125rem] uppercase leading-[0.9] sm:text-6xl md:text-7xl">
            Tu perro no necesita más marketing.
          </h1>

          <p className="mt-5 max-w-md text-lg leading-7 text-hueso/82 md:text-xl md:leading-8">
            Empieza con comida real cocinada, sin cambiar todo de golpe.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/calculadora"
              className="inline-flex min-h-13 items-center justify-center rounded-full bg-hueso px-8 text-sm font-black uppercase tracking-wide text-negro transition hover:bg-white"
            >
              Calcular su mix
            </Link>

            <Link
              href="/#planes"
              className="text-sm font-bold text-hueso/70 underline decoration-hueso/25 underline-offset-4 transition hover:text-hueso hover:decoration-hueso"
            >
              Ver planes
            </Link>
          </div>

          <p className="mt-7 border-t border-hueso/14 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-hueso/62 sm:text-[11px]">
            Guadalajara y Zapopan · Premium Box · Plan mensual
          </p>
        </div>
      </div>
    </section>
  );
}

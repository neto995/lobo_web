import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen overflow-hidden bg-black text-[#F4EFE3]"
    >
      {/* Imagen de fondo / derecha */}
      <div className="absolute inset-0 lg:right-0 lg:left-auto lg:top-0 lg:h-full lg:w-[55%]">
        <div className="relative h-full w-full">
          <Image
            src="/lobo_brutal.png"
            alt="Bolsa de comida real LOBO para perros"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover object-center opacity-80"
          />

          {/* Overlay para lectura */}
          <div className="absolute inset-0 bg-black/45 lg:bg-black/20" />
        </div>
      </div>

      {/* Fondo oscuro para que el texto lea bien */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.9)_42%,rgba(0,0,0,0.45)_72%,rgba(0,0,0,0.2)_100%)]" />

      {/* Contenido */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 pt-28 pb-10">
        <div className="max-w-6xl mx-auto w-full">

          <p className="uppercase tracking-[0.25em] text-xs md:text-sm text-[#C9BDAA]">
            Si parece comida es porque lo es.
          </p>

          <div className="mt-8 max-w-4xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.88] tracking-tight">
              Más comida.
              <br />
              <span className="relative inline-block overflow-hidden text-[#A93622]">
                Menos marketing.
                <span className="absolute top-0 left-0 h-full w-[20%] bg-gradient-to-r from-transparent via-[#F4EFE3]/35 to-transparent animate-shine pointer-events-none" />
              </span>
            </h1>
          </div>

          <div className="mt-10 max-w-xl">
            <p className="text-lg md:text-xl text-[#C9BDAA] leading-relaxed">
              LOBO es comida húmeda real, porcionada y lista para servir.
              Sin rellenos. Sin teatro. Sin promesas infladas.
            </p>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Link
              href="/#planes"
              className="inline-flex justify-center rounded-full bg-[#F4EFE3] px-8 py-4 text-sm font-bold uppercase tracking-wide text-black transition hover:bg-white"
            >
              Ver planes
            </Link>

            <Link
              href="/calculadora"
              className="inline-flex justify-center rounded-full border border-[#F4EFE3]/20 px-8 py-4 text-sm font-bold uppercase tracking-wide text-[#F4EFE3] transition hover:bg-[#F4EFE3]/10"
            >
              Personalizar plan
            </Link>
          </div>

          {/* Cómo usar */}
          <div className="mt-14 max-w-2xl border-y border-[#F4EFE3]/10 bg-black/20 backdrop-blur">
            <div className="grid grid-cols-[2.25rem_1fr] items-center gap-3 border-b border-[#F4EFE3]/10 py-4 sm:grid-cols-[3rem_1fr] sm:gap-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#A93622]">
                01
              </p>
              <p className="text-sm font-black uppercase leading-tight text-[#F4EFE3] sm:text-lg">
                No tienes que cambiar todo
              </p>
            </div>

            <div className="grid grid-cols-[2.25rem_1fr] items-center gap-3 border-b border-[#F4EFE3]/10 py-4 sm:grid-cols-[3rem_1fr] sm:gap-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#A93622]">
                02
              </p>
              <p className="text-sm font-black uppercase leading-tight text-[#F4EFE3] sm:text-lg">
                Empieza con mix feeding
              </p>
            </div>

            <div className="grid grid-cols-[2.25rem_1fr] items-center gap-3 py-4 sm:grid-cols-[3rem_1fr] sm:gap-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#A93622]">
                03
              </p>
              <p className="text-sm font-black uppercase leading-tight text-[#F4EFE3] sm:text-lg">
                Mide, observa y ajusta
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

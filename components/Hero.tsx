import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen overflow-hidden bg-black text-[#F4EFE3]"
    >
      {/* Imagen derecha */}
      <div className="absolute right-0 top-0 hidden h-full w-[55%] lg:block">
        <div className="relative h-full w-full">
          <Image
            src="/lobo_brutal.png"
            alt="LOBO comida real para perros"
            fill
            priority
            className="object-cover object-center opacity-100"
          />

          {/* Overlay mínimo para mantener lectura */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* Fondo oscuro del lado izquierdo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.95)_42%,rgba(0,0,0,0.35)_72%,rgba(0,0,0,0.15)_100%)]" />

      {/* Contenido */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 pt-28">
        <div className="max-w-6xl mx-auto w-full">

          <p className="uppercase tracking-[0.25em] text-xs md:text-sm text-[#C9BDAA]">
            Si parece comida es porque lo es.
          </p>

          <div className="mt-8 max-w-4xl">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.88] tracking-tight">
              Más comida.
              <br />
              <span className="relative inline-block overflow-hidden text-[#A93622]">
              Menos marketing.
              <span className="absolute top-0 left-0 h-full w-[20%] bg-gradient-to-r from-transparent via-[#F4EFE3]/35 to-transparent animate-shine pointer-events-none" />
              </span>
            </h2>
          </div>

          <div className="mt-10 max-w-xl">
            <p className="text-lg md:text-xl text-[#C9BDAA] leading-relaxed">
              LOBO es comida húmeda real, porcionada y lista para servir.
              Sin rellenos. Sin teatro. Sin promesas infladas.
            </p>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <a
              href="#planes"
              className="inline-flex justify-center rounded-full bg-[#F4EFE3] px-8 py-4 text-sm font-bold uppercase tracking-wide text-black transition hover:bg-white"
            >
              Ver planes
            </a>

            <a
              href="https://wa.me/5213330626243"
              target="_blank"
              className="inline-flex justify-center rounded-full border border-[#F4EFE3]/20 px-8 py-4 text-sm font-bold uppercase tracking-wide text-[#F4EFE3] transition hover:bg-[#F4EFE3]/10"
            >
              Personalizar plan
            </a>
          </div>

          {/* Cómo usar */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
            <div className="border border-[#F4EFE3]/10 bg-[#F4EFE3]/[0.03] rounded-2xl p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-[#8E7F6A]">
              Paso 1
              </p>
              <p className="mt-3 font-bold uppercase">
              Descongela. 
              </p>
            </div>

            <div className="border border-[#F4EFE3]/10 bg-[#F4EFE3]/[0.03] rounded-2xl p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-[#8E7F6A]">
              Paso 2
              </p>
              <p className="mt-3 font-bold uppercase">
              Sirve con su comida actual
              </p>
            </div>

            <div className="border border-[#F4EFE3]/10 bg-[#F4EFE3]/[0.03] rounded-2xl p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-[#8E7F6A]">
              Paso 3
              </p>
              <p className="mt-3 font-bold uppercase">
              Velo disfrutar
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
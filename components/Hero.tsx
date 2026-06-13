import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[88svh] overflow-hidden bg-black text-[#F4EFE3] md:min-h-[92svh]"
    >
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 md:left-auto md:w-[61%]">
          <Image
            src="/lobo_brutal.png"
            alt="Bolsa de comida real LOBO para perros"
            fill
            priority
            sizes="(min-width: 768px) 61vw, 100vw"
            className="object-cover object-[60%_center] opacity-[0.9] md:object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.74)_42%,rgba(0,0,0,0.94)_100%)] md:bg-[linear-gradient(90deg,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_34%,rgba(0,0,0,0.82)_48%,rgba(0,0,0,0.16)_75%,rgba(0,0,0,0.34)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-end px-4 pb-8 pt-28 sm:px-6 md:min-h-[92svh] md:justify-center md:pb-12 md:pt-36">
        <div className="max-w-[42rem] md:max-w-[39rem]">
          <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#D7CABB] md:text-xs">
            Si parece comida es porque lo es.
          </p>

          <h1 className="mt-5 max-w-full text-5xl font-black uppercase leading-[0.86] tracking-normal text-[#F4EFE3] sm:text-6xl md:text-7xl md:leading-[0.82] lg:text-8xl">
            <span className="block md:whitespace-nowrap">Más comida.</span>
            <span className="relative mt-1 block overflow-hidden text-[#A93622]">
              Menos
              <span className="absolute inset-y-0 left-[-40%] w-[34%] rotate-12 bg-gradient-to-r from-transparent via-[#F4EFE3]/28 to-transparent animate-shine" />
            </span>
            <span className="block text-[#A93622]">marketing.</span>
          </h1>

          <p className="mt-6 max-w-[36rem] text-base leading-7 text-[#DED4C4] md:text-xl md:leading-8">
            LOBO es comida húmeda real, lista para servir o mezclar con
            croquetas.
            <span className="block">
              Empieza con mix feeding. Sin rellenos. Sin teatro. Con criterio.
            </span>
          </p>

          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <Link
              href="/#planes"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F4EFE3] px-7 py-4 text-xs font-black uppercase tracking-wide text-black transition hover:bg-white"
            >
              Empieza con Premium Box
            </Link>

            <Link
              href="/calculadora"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#F4EFE3]/25 bg-black/25 px-7 py-4 text-xs font-black uppercase tracking-wide text-[#F4EFE3] transition hover:bg-[#F4EFE3]/10"
            >
              Calcula su mix
            </Link>
          </div>

          <div className="mt-8 grid max-w-2xl grid-cols-3 border-y border-white/10 py-4 text-[10px] font-bold uppercase leading-4 tracking-wide text-[#C9BDAA] sm:text-xs">
            <p>No cambies todo</p>
            <p>Mezcla con criterio</p>
            <p>Observa y ajusta</p>
          </div>
        </div>
      </div>
    </section>
  );
}

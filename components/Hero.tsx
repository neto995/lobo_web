import Image from "next/image";

export default function Hero() {
return (
  <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">

    <div className="absolute inset-0 opacity-20">
      <Image
        src="/lobo_brutal.png"
        alt="LOBO comida real para perros"
        fill
        priority
        className="object-cover scale-70"
      />
    </div>

    <div className="relative z-10">

      <p className="uppercase tracking-[0.3em] text-sm text-gray-400">
        LOBO
      </p>

      <h1 className="text-6xl md:text-8xl font-bold uppercase mt-4">
        Más comida.
        <br />
        Menos marketing.
      </h1>

      <p className="mt-8 max-w-xl text-gray-300 text-lg">
        Comida real para perros.
        Sin rellenos.
        Sin teatro.
      </p>

      <button className="mt-10 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition">
        Ver planes
      </button>

    </div>

  </section>
);
}
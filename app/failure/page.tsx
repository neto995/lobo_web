export default function FailurePage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 text-center">
      <div>
        <p className="uppercase tracking-[0.4em] text-sm text-red-400">
          LOBO
        </p>

        <h1 className="text-5xl md:text-7xl font-black uppercase mt-6">
          Pago no completado.
        </h1>

        <p className="mt-6 text-gray-300 text-lg max-w-xl">
          No se realizó el cobro. Puedes intentarlo nuevamente.
        </p>

        <a
          href="/#planes"
          className="inline-block mt-10 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition"
        >
          Volver a planes
        </a>
      </div>
    </main>
  );
}
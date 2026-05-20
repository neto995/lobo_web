export default function PendingPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 text-center">
      <div>
        <p className="uppercase tracking-[0.4em] text-sm text-yellow-400">
          LOBO
        </p>

        <h1 className="text-5xl md:text-7xl font-black uppercase mt-6">
          Pago pendiente.
        </h1>

        <p className="mt-6 text-gray-300 text-lg max-w-xl">
          Tu pago está en revisión. Te contactaremos cuando se confirme.
        </p>

        <a
          href="/"
          className="inline-block mt-10 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition"
        >
          Volver al inicio
        </a>
      </div>
    </main>
  );
}
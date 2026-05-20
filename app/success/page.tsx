export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 text-center">
      <div>
        <p className="uppercase tracking-[0.4em] text-sm text-gray-500">
          LOBO
        </p>

        <h1 className="text-5xl md:text-7xl font-black uppercase mt-6">
          Compra recibida.
        </h1>

        <p className="mt-6 text-gray-300 text-lg max-w-xl">
          Gracias por comprar comida real. Te contactaremos para coordinar la entrega.
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
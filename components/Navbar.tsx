export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <p className="font-bold tracking-[0.3em]">
          LOBO
        </p>

        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          <a href="#planes" className="hover:text-white transition">
            Planes
          </a>
          <a href="#ingredientes" className="hover:text-white transition">
            Ingredientes
          </a>
          <a href="#faq" className="hover:text-white transition">
            FAQ
          </a>
        </div>

        <a
          href="#planes"
          className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition"
        >
          Comprar
        </a>
      </div>
    </nav>
  );
}
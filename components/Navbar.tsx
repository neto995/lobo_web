import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/#inicio"
          className="font-bold tracking-[0.3em] hover:text-gray-300 transition"
        >
          LOBO
        </Link>

        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          <Link href="/#planes" className="hover:text-white transition">
            Planes
          </Link>

          <Link href="/#ingredientes" className="hover:text-white transition">
            Ingredientes
          </Link>

          <Link href="/#faq" className="hover:text-white transition">
            FAQ
          </Link>

          <Link href="/calculadora" className="hover:text-white transition">
            Calculadora
          </Link>

        </div>

        <Link
          href="/#planes"
          className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition"
        >
          Comprar
        </Link>
      </div>
    </nav>
  );
}

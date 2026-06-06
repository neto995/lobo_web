import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between">
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
            className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 md:inline-flex"
          >
            Comprar
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5 md:hidden">
          <Link
            href="/#ingredientes"
            className="rounded-full border border-white/15 bg-white/8 px-2 py-2 text-center text-[9px] font-bold uppercase tracking-[0.06em] text-white transition hover:bg-white/15 min-[380px]:text-[10px]"
          >
            Ingredientes
          </Link>
          <Link
            href="/calculadora"
            className="rounded-full border border-white/15 bg-white/8 px-2 py-2 text-center text-[9px] font-bold uppercase tracking-[0.06em] text-white transition hover:bg-white/15 min-[380px]:text-[10px]"
          >
            Calculadora
          </Link>
          <Link
            href="/#planes"
            className="rounded-full bg-white px-2 py-2 text-center text-[9px] font-bold uppercase tracking-[0.06em] text-black transition hover:bg-gray-200 min-[380px]:text-[10px]"
          >
            Comprar
          </Link>
        </div>
      </div>
    </nav>
  );
}

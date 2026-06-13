import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/78 text-white backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <Link
            href="/#inicio"
            className="font-black tracking-[0.34em] transition hover:text-[#F4EFE3]"
          >
            LOBO
          </Link>

          <div className="hidden items-center gap-7 text-xs font-bold uppercase tracking-wide text-white/70 md:flex">
            <Link href="/#planes" className="hover:text-white transition">
              Planes
            </Link>

            <Link
              href="/mix-feeding-para-perros"
              className="hover:text-white transition"
            >
              Mix feeding
            </Link>

            <Link href="/#ingredientes" className="hover:text-white transition">
              Producto
            </Link>

            <Link href="/calculadora" className="hover:text-white transition">
              Calculadora
            </Link>
          </div>

          <Link
            href="/#planes"
            className="hidden rounded-full bg-white px-5 py-2.5 text-xs font-black uppercase tracking-wide text-black transition hover:bg-[#F4EFE3] md:inline-flex"
          >
            Empezar
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 md:hidden">
          <Link
            href="/calculadora"
            className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-white/15"
          >
            Calcular mix
          </Link>
          <Link
            href="/#planes"
            className="rounded-full bg-white px-3 py-2.5 text-center text-[10px] font-black uppercase tracking-wide text-black transition hover:bg-[#F4EFE3]"
          >
            Ver planes
          </Link>
        </div>
      </div>
    </nav>
  );
}

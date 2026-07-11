import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/15 bg-black/55 text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
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

            <Link href="/#ingredientes" className="hover:text-white transition">
              Producto
            </Link>

            <Link href="/#faq" className="hover:text-white transition">
              FAQ
            </Link>
          </div>

          <Link
            href="/calculadora"
            className="glass-btn glass-btn--cream inline-flex rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-wide text-black"
          >
            Calcular mix
          </Link>
        </div>
      </div>
    </nav>
  );
}

import Link from "next/link";

const microSeoItems = [
  "Comida real cocinada para perros.",
  "Porciones listas para mezclar con su comida actual.",
  "Entrega en Guadalajara y Zapopan.",
  "Mix feeding con criterio.",
  "Premium Box para probar sin comprar todo el mes.",
  "Plan mensual con porciones programadas.",
];

export function MicroSeo() {
  return (
    <section
      aria-label={microSeoItems.join(" ")}
      className="overflow-hidden border-y border-carbon/10 bg-hueso/92 text-ceniza"
    >
      <div className="micro-seo-track py-3.5">
        {[0, 1].map((set) => (
          <ul
            key={set}
            aria-hidden={set === 1 ? true : undefined}
            className="flex shrink-0 items-center"
          >
            {microSeoItems.map((item) => (
              <li
                key={`${set}-${item}`}
                className="whitespace-nowrap px-7 text-sm leading-6 sm:px-9"
              >
                {item}
                <span aria-hidden="true" className="mx-7 text-carbon/24 sm:mx-9">
                  {" · "}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}

const localLinks = [
  { label: "Comida real cocinada", href: "/comida-real-cocinada-para-perros" },
  {
    label: "Comida para perros en GDL",
    href: "/comida-cocinada-para-perros-guadalajara",
  },
  { label: "Mix feeding", href: "/mix-feeding-para-perros" },
  { label: "Artículos", href: "/articulos" },
];

export function LocalSeoSection() {
  return (
    <section className="bg-hueso px-4 py-16 text-carbon sm:px-6 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1fr] md:items-start">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-rojo sm:text-[11px]">
            GDL · Zapopan
          </p>
          <h2 className="mt-4 text-4xl uppercase leading-[0.92] sm:text-5xl">
            Comida para perros en Guadalajara y Zapopan.
          </h2>
        </div>

        <div>
          <p className="text-base leading-7 text-ceniza md:text-lg md:leading-8">
            LOBO es comida real cocinada para perros en Guadalajara: porciones
            húmedas, listas para servir solas o mezclar con croquetas. Entregas
            locales, porciones claras y seguimiento. Mide la porción, observa
            la respuesta y ajusta con calma — medir importa más que prometer.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {localLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center rounded-full border border-carbon/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-carbon/70 transition hover:bg-white hover:text-carbon"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

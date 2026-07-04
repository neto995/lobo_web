/*
 * Acentos por grupo: tonos tomados de la comida real de la foto
 * (res, camote, chícharos, huevo, caldo). Colores de comida, no de marketing.
 * Clases completas como literales para que el scanner de Tailwind las genere.
 */
export const ingredientGroups = [
  {
    number: "01",
    title: "Proteína",
    items: ["Pollo", "Res"],
    copy: "Base de proteína reconocible para la receta.",
    numberClass: "text-[#A93622]",
    chipClass: "border-[#A93622]/25 bg-[#A93622]/10 text-[#97301E]",
  },
  {
    number: "02",
    title: "Carbohidratos",
    items: ["Arroz integral", "Camote"],
    copy: "Energía práctica y textura real en cada porción.",
    numberClass: "text-[#9A6B2F]",
    chipClass: "border-[#9A6B2F]/28 bg-[#9A6B2F]/10 text-[#7C5524]",
  },
  {
    number: "03",
    title: "Vegetales",
    items: ["Zanahoria", "Chícharos", "Manzana verde"],
    copy: "Ingredientes visibles. Nada que tengas que descifrar.",
    numberClass: "text-[#5C6E3C]",
    chipClass: "border-[#5C6E3C]/28 bg-[#5C6E3C]/10 text-[#4C5C31]",
  },
  {
    number: "04",
    title: "Micronutrientes",
    items: ["Cáscara de huevo", "Sal yodada", "Aceite de girasol"],
    copy: "Detalles medidos para completar la receta con criterio.",
    numberClass: "text-[#8A5A44]",
    chipClass: "border-[#8A5A44]/28 bg-[#8A5A44]/10 text-[#6E4634]",
  },
  {
    number: "05",
    title: "Humedad",
    items: ["Caldo natural de cocción"],
    copy: "Comida húmeda lista para servir o mezclar con croquetas.",
    numberClass: "text-[#5B7268]",
    chipClass: "border-[#5B7268]/28 bg-[#5B7268]/12 text-[#46594F]",
  },
];

export type IngredientGroup = (typeof ingredientGroups)[number];

export function IngredientCard({
  group,
  compact = false,
  reveal = true,
}: {
  group: IngredientGroup;
  compact?: boolean;
  reveal?: boolean;
}) {
  return (
    <article
      className={`${
        reveal ? "reveal-card " : ""
      }liquid-glass overflow-hidden rounded-xl ${
        compact ? "p-5" : "p-5 md:p-6"
      }`}
    >
      <span
        className={`${
          reveal ? "reveal-stamp origin-left " : ""
        }inline-flex items-center rounded-full border border-carbon/10 bg-white/55 px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.22em] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ${group.numberClass}`}
      >
        {group.number}
      </span>

      <h3
        className={`mt-3 font-black uppercase leading-tight text-carbon ${
          compact ? "text-lg" : "text-xl sm:text-2xl"
        }`}
      >
        {group.title}
      </h3>

      <ul className="mt-3.5 flex flex-wrap gap-2">
        {group.items.map((item) => (
          <li
            key={item}
            className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] ${group.chipClass}`}
          >
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-3.5 text-sm leading-6 text-carbon/58">{group.copy}</p>
    </article>
  );
}

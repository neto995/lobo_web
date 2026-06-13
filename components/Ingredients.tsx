import Image from "next/image";

const ingredientGroups = [
  {
    number: "01",
    title: "Proteína",
    items: ["Pollo", "Res"],
    copy: "Base de proteína reconocible para la receta.",
  },
  {
    number: "02",
    title: "Carbohidratos",
    items: ["Arroz integral", "Camote"],
    copy: "Energía práctica y textura real en cada porción.",
  },
  {
    number: "03",
    title: "Vegetales",
    items: ["Zanahoria", "Chícharos", "Manzana verde"],
    copy: "Ingredientes visibles. Nada que tengas que descifrar.",
  },
  {
    number: "04",
    title: "Micronutrientes",
    items: ["Cáscara de huevo", "Sal yodada", "Aceite de girasol"],
    copy: "Detalles medidos para completar la receta con criterio.",
  },
  {
    number: "05",
    title: "Humedad",
    items: ["Caldo natural de cocción"],
    copy: "Comida húmeda lista para servir o mezclar con croquetas.",
  },
];

function IngredientCard({
  group,
  compact = false,
}: {
  group: (typeof ingredientGroups)[number];
  compact?: boolean;
}) {
  return (
    <article
      className={`rounded-lg border border-black/10 bg-[#FBF7EF]/92 p-5 shadow-[0_18px_50px_rgba(20,17,15,0.055)] ${
        compact ? "md:p-5" : "md:p-6"
      }`}
    >
      <p className="text-xs font-black tracking-[0.28em] text-[#A93622]">
        {group.number}
      </p>
      <h3 className="mt-3 text-2xl font-black uppercase leading-tight text-[#14110F]">
        {group.title}
      </h3>

      <ul className="mt-4 flex flex-wrap gap-2">
        {group.items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-[#8A6632]/20 bg-[#8A6632]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#6F4D21]"
          >
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm leading-6 text-black/62">{group.copy}</p>
    </article>
  );
}

export default function Ingredients() {
  const leftGroups = [ingredientGroups[0], ingredientGroups[2]];
  const rightGroups = [ingredientGroups[1], ingredientGroups[3]];
  const humidityGroup = ingredientGroups[4];

  return (
    <section
      id="ingredientes"
      className="scroll-mt-36 overflow-hidden bg-[#F4EFE3] px-4 py-16 text-[#14110F] sm:px-6 md:scroll-mt-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#A93622]">
            Producto
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] tracking-normal sm:text-5xl md:text-7xl">
            Ingredientes que ves
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-black/64 md:text-xl md:leading-8">
            Si tienes que leer veinte ingredientes raros para entender qué
            compras, algo no cuadra.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.86fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="hidden gap-5 lg:grid">
            {leftGroups.map((group) => (
              <IngredientCard key={group.title} group={group} compact />
            ))}
          </div>

          <div className="relative order-first mx-auto grid min-h-[27rem] w-full max-w-[18rem] place-items-center sm:max-w-[22rem] lg:order-none lg:min-h-[31rem] lg:max-w-[27rem]">
            <div
              aria-hidden="true"
              className="absolute inset-x-8 bottom-7 h-16 rounded-full bg-black/18 blur-2xl"
            />
            <Image
              src="/ingredientes_3.png"
              alt="Bolsa de comida real LOBO con ingredientes para perros"
              width={675}
              height={1200}
              sizes="(min-width: 1024px) 27rem, 22rem"
              className="relative h-auto w-full drop-shadow-[0_34px_70px_rgba(20,17,15,0.2)]"
            />
          </div>

          <div className="hidden gap-5 lg:grid">
            {rightGroups.map((group) => (
              <IngredientCard key={group.title} group={group} compact />
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:hidden">
          {ingredientGroups.slice(0, 4).map((group) => (
            <IngredientCard key={group.title} group={group} compact />
          ))}
        </div>

        <div className="mt-5 lg:mx-auto lg:max-w-[34rem]">
          <IngredientCard group={humidityGroup} />
        </div>
      </div>
    </section>
  );
}

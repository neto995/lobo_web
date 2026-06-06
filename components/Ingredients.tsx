import Image from "next/image";

const productImageSrc = "/ingredientes_3.png";

const ingredientGroups = [
  {
    title: "Proteína",
    items: ["Pollo", "Res"],
    copy: "Base animal real para aportar proteína y palatabilidad.",
  },
  {
    title: "Carbohidratos",
    items: ["Arroz integral", "Camote"],
    copy: "Energía práctica, fácil de porcionar y sostener.",
  },
  {
    title: "Vegetales",
    items: ["Zanahoria", "Chícharos", "Manzana verde"],
    copy: "Ingredientes reconocibles. Nada que tengas que descifrar.",
  },
  {
    title: "Micronutrientes",
    items: ["Cáscara de huevo", "Sal yodada", "Aceite de girasol"],
    copy: "Pequeños ajustes que ayudan a completar la receta con criterio.",
  },
  {
    title: "Humedad",
    items: ["Caldo natural de cocción"],
    copy: "Más humedad real. No una bolita seca intentando parecer comida.",
  },
];

function IngredientCard({
  group,
  index,
  className = "",
}: {
  group: (typeof ingredientGroups)[number];
  index: number;
  className?: string;
}) {
  return (
    <article
      className={`rounded-[1.75rem] border border-black/10 bg-[#F4EFE3] p-5 shadow-xl shadow-black/5 transition duration-300 hover:-translate-y-1 hover:border-[#A93622]/45 hover:bg-[#FBF7EF] md:p-6 ${className}`}
    >
      <p className="text-xs font-black tracking-[0.24em] text-[#A93622]">
        {String(index + 1).padStart(2, "0")}
      </p>

      <h3 className="mt-3 text-2xl font-black uppercase leading-none text-[#14110F]">
        {group.title}
      </h3>

      <ul className="mt-4 flex flex-wrap gap-2">
        {group.items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-[#8A6632]/20 bg-[#8A6632]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6F4D21]"
          >
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm leading-6 text-black/65">{group.copy}</p>
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
      className="overflow-hidden bg-white px-4 py-24 text-[#14110F] sm:px-6 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A93622] md:text-sm">
            Ingredientes
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] sm:text-5xl md:text-7xl">
            Si parece comida... es porque lo es.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-black/65 md:text-xl md:leading-8">
            Si tienes que leer veinte ingredientes raros para entender qué compras, algo no cuadra. 
            LOBO usa ingredientes reales que puedes ver. 
            Comida que tiene sentido.

          </p>
        </div>

        <div className="mt-14 lg:hidden">
          <div className="mx-auto flex w-full max-w-[18rem] justify-center sm:max-w-[22rem]">
            <Image
              src={productImageSrc}
              alt="Bolsa de comida real LOBO con ingredientes para perros"
              width={675}
              height={1200}
              sizes="(min-width: 640px) 22rem, 18rem"
              className="h-auto w-full drop-shadow-[0_26px_52px_rgba(20,17,15,0.18)]"
            />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {ingredientGroups.map((group, index) => (
              <IngredientCard key={group.title} group={group} index={index} />
            ))}
          </div>
        </div>

        <div className="relative mt-16 hidden items-center gap-8 lg:grid lg:grid-cols-[minmax(0,18rem)_minmax(24rem,1fr)_minmax(0,18rem)] xl:gap-12">
          <div className="grid gap-10">
            {leftGroups.map((group) => {
              const index = ingredientGroups.indexOf(group);
              return (
                <IngredientCard
                  key={group.title}
                  group={group}
                  index={index}
                />
              );
            })}
          </div>

          <div className="relative mx-auto flex min-h-[660px] w-full max-w-[28rem] items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8A6632]/12"
            />
            <div
              aria-hidden="true"
              className="absolute left-0 top-[32%] h-px w-24 bg-[#8A6632]/25"
            />
            <div
              aria-hidden="true"
              className="absolute right-0 top-[32%] h-px w-24 bg-[#8A6632]/25"
            />
            <div
              aria-hidden="true"
              className="absolute left-4 bottom-[34%] h-px w-24 -rotate-12 bg-[#8A6632]/25"
            />
            <div
              aria-hidden="true"
              className="absolute right-4 bottom-[34%] h-px w-24 rotate-12 bg-[#8A6632]/25"
            />

            <Image
              src={productImageSrc}
              alt="Bolsa de comida real LOBO con ingredientes para perros"
              width={675}
              height={1200}
              sizes="28rem"
              className="relative z-10 h-auto w-full max-w-[24rem] drop-shadow-[0_34px_70px_rgba(20,17,15,0.22)]"
            />
          </div>

          <div className="grid gap-10">
            {rightGroups.map((group) => {
              const index = ingredientGroups.indexOf(group);
              return (
                <IngredientCard
                  key={group.title}
                  group={group}
                  index={index}
                />
              );
            })}
          </div>

          <IngredientCard
            group={humidityGroup}
            index={4}
            className="absolute bottom-0 left-1/2 z-20 w-[18rem] -translate-x-1/2"
          />
        </div>
      </div>
    </section>
  );
}

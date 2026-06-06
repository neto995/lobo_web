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

function MobileIngredientCard({
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
      className={`absolute z-20 rounded-2xl border border-black/10 bg-[#F4EFE3]/95 p-3 shadow-xl shadow-black/5 backdrop-blur ${className}`}
    >
      <p className="text-[10px] font-black tracking-[0.2em] text-[#A93622]">
        {String(index + 1).padStart(2, "0")}
      </p>

      <h3 className="mt-2 text-sm font-black uppercase leading-none text-[#14110F] min-[380px]:text-base">
        {group.title}
      </h3>

      <ul className="mt-2 flex flex-wrap gap-1.5">
        {group.items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-[#8A6632]/20 bg-[#8A6632]/10 px-2 py-1 text-[7px] font-bold uppercase tracking-[0.1em] text-[#6F4D21] min-[380px]:text-[8px]"
          >
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-2 text-[10px] leading-4 text-black/60 min-[380px]:text-xs min-[380px]:leading-5">
        {group.copy}
      </p>
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
            Más comida. Menos marketing.

          </p>
        </div>

        <div className="relative mx-auto mt-12 h-[870px] max-w-[25rem] sm:h-[920px] sm:max-w-[32rem] md:h-[760px] md:max-w-3xl lg:hidden">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[8.5rem] h-[23rem] w-[23rem] -translate-x-1/2 rounded-full border border-[#8A6632]/10 sm:top-[9rem] sm:h-[27rem] sm:w-[27rem] md:top-[5rem]"
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[18rem] h-px w-[86%] -translate-x-1/2 bg-[#8A6632]/18 md:top-[17rem] md:w-[70%]"
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[37.5rem] h-px w-[80%] -translate-x-1/2 bg-[#8A6632]/14 md:top-[34rem] md:w-[64%]"
          />

          <div className="absolute left-1/2 top-[9.75rem] z-10 flex w-full max-w-[17.5rem] -translate-x-1/2 justify-center sm:top-[10.5rem] sm:max-w-[21rem] md:top-[5.25rem] md:max-w-[22rem]">
            <Image
              src={productImageSrc}
              alt="Bolsa de comida real LOBO con ingredientes para perros"
              width={675}
              height={1200}
              sizes="(min-width: 768px) 22rem, (min-width: 640px) 21rem, 17.5rem"
              className="h-auto w-full drop-shadow-[0_26px_52px_rgba(20,17,15,0.18)]"
            />
          </div>

          <MobileIngredientCard
            group={ingredientGroups[0]}
            index={0}
            className="left-0 top-0 w-[10.25rem] min-[380px]:w-[11rem] sm:left-8 sm:w-[12.5rem] md:left-0 md:top-16"
          />

          <MobileIngredientCard
            group={ingredientGroups[1]}
            index={1}
            className="right-0 top-5 w-[10.25rem] min-[380px]:w-[11rem] sm:right-8 sm:w-[12.5rem] md:right-0 md:top-20"
          />

          <MobileIngredientCard
            group={ingredientGroups[2]}
            index={2}
            className="left-0 top-[34rem] w-[11.25rem] min-[380px]:w-[12rem] sm:left-8 sm:top-[38rem] sm:w-[14rem] md:left-8 md:top-[31rem]"
          />

          <MobileIngredientCard
            group={ingredientGroups[3]}
            index={3}
            className="right-0 top-[36.5rem] w-[11.25rem] min-[380px]:w-[12rem] sm:right-8 sm:top-[40.5rem] sm:w-[14rem] md:right-8 md:top-[32.5rem]"
          />

          <MobileIngredientCard
            group={ingredientGroups[4]}
            index={4}
            className="bottom-0 left-1/2 w-[16rem] -translate-x-1/2 min-[380px]:w-[17.5rem] sm:w-[20rem] md:bottom-2"
          />
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

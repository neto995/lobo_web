import Image from "next/image";
import IngredientScene from "@/components/IngredientScene";
import { IngredientCard, ingredientGroups } from "@/components/ingredients-data";

export default function Ingredients() {
  return (
    <section
      id="ingredientes"
      className="relative scroll-mt-36 overflow-clip bg-[#F4EFE3] px-4 py-16 text-[#14110F] sm:px-6 md:scroll-mt-20 md:py-24"
    >
      {/* Manchas de color difusas: dan materia al cristal de las fichas */}
      <div
        aria-hidden="true"
        className="aurora-drift-layer pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[6%] top-[24%] h-80 w-80 rounded-full bg-rojo/14 blur-3xl" />
        <div className="absolute right-[4%] top-[40%] h-96 w-96 rounded-full bg-[#8A6632]/18 blur-3xl" />
        <div className="absolute bottom-[6%] left-[30%] h-72 w-72 rounded-full bg-white/70 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
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

        {/* Desktop: escena 3D interactiva */}
        <div className="mt-6">
          <IngredientScene />
        </div>

        {/* Móvil / tablet: bolsa + fichas apiladas con reveal por scroll */}
        <div className="mt-10 lg:hidden">
          <div className="relative mx-auto grid min-h-[27rem] w-full max-w-[18rem] place-items-center sm:max-w-[22rem]">
            <div
              aria-hidden="true"
              className="absolute inset-x-8 bottom-7 h-16 rounded-full bg-black/18 blur-2xl"
            />
            <Image
              src="/ingredientes_3.png"
              alt="Bolsa de comida real LOBO con ingredientes para perros"
              width={675}
              height={1200}
              sizes="22rem"
              className="relative h-auto w-full drop-shadow-[0_34px_70px_rgba(20,17,15,0.2)]"
            />
          </div>

          <div className="mt-5 grid gap-5">
            {ingredientGroups.map((group) => (
              <IngredientCard key={group.title} group={group} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

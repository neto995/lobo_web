"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { IngredientCard, ingredientGroups } from "@/components/ingredients-data";

/*
 * Coreografía: cerrado = pila de notas bajo la bolsa; abierto = abanico
 * alrededor del producto. Cada slot define posición abierta (x/y/z, rotación,
 * rotateY hacia el centro), posición cerrada (cx/cy/cr) y su delay escalonado.
 */
const slots = [
  { x: "-27rem", y: "-11rem", z: "2rem", r: "-2deg", ry: "16deg", cx: "-1.5rem", cy: "8.5rem", cr: "-6deg", d: "0s" },
  { x: "27rem", y: "-11rem", z: "2rem", r: "2deg", ry: "-16deg", cx: "1.5rem", cy: "9rem", cr: "5deg", d: "0.05s" },
  { x: "-25rem", y: "3.5rem", z: "1rem", r: "1.5deg", ry: "12deg", cx: "-0.75rem", cy: "9.5rem", cr: "3deg", d: "0.1s" },
  { x: "25rem", y: "3.5rem", z: "1rem", r: "-1.5deg", ry: "-12deg", cx: "0.75rem", cy: "10rem", cr: "-4deg", d: "0.15s" },
  { x: "0rem", y: "13.5rem", z: "9rem", r: "0.5deg", ry: "0deg", cx: "0rem", cy: "10.5rem", cr: "1deg", d: "0.2s" },
];

export default function IngredientScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty("--tilt-y", `${(px * 6).toFixed(2)}deg`);
    stage.style.setProperty("--tilt-x", `${(py * -5).toFixed(2)}deg`);
  };

  const close = () => {
    const stage = stageRef.current;
    stage?.style.setProperty("--tilt-x", "0deg");
    stage?.style.setProperty("--tilt-y", "0deg");
    setOpen(false);
  };

  return (
    <div
      className={`ingredient-scene relative hidden lg:block ${
        open ? "is-open" : ""
      }`}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={close}
      onPointerMove={handleMove}
      onFocus={() => setOpen(true)}
      onBlur={close}
      tabIndex={0}
      role="group"
      aria-label="Receta LOBO en cinco grupos: pasa el cursor o enfoca para desplegar los ingredientes"
    >
      <div ref={stageRef} className="ingredient-stage h-[44rem]">
        {ingredientGroups.map((group, index) => (
          <div
            key={group.title}
            className="ingredient-card-3d"
            style={
              {
                "--open-x": slots[index].x,
                "--open-y": slots[index].y,
                "--open-z": slots[index].z,
                "--open-r": slots[index].r,
                "--open-ry": slots[index].ry,
                "--closed-x": slots[index].cx,
                "--closed-y": slots[index].cy,
                "--closed-r": slots[index].cr,
                "--delay": slots[index].d,
              } as CSSProperties
            }
          >
            <div className="ingredient-card-inner">
              <IngredientCard group={group} compact reveal={false} />
            </div>
          </div>
        ))}

        <div className="ingredient-bag absolute left-1/2 top-1/2 w-[19rem]">
          <div
            aria-hidden="true"
            className="absolute inset-x-6 bottom-4 h-14 rounded-full bg-black/18 blur-2xl"
          />
          <Image
            src="/ingredientes_3.png"
            alt="Bolsa de comida real LOBO con ingredientes para perros"
            width={1152}
            height={2048}
            sizes="19rem"
            className="relative h-auto w-full drop-shadow-[0_34px_70px_rgba(20,17,15,0.22)]"
          />
        </div>

        <p className="ingredient-hint absolute inset-x-0 bottom-2 text-center font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-ceniza">
          Pasa el cursor · la receta se despliega
        </p>
      </div>
    </div>
  );
}

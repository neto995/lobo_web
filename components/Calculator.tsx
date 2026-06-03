"use client";

import { useMemo, useState } from "react";

type OptionButtonProps = {
  active: boolean;
  label: string;
  description?: string;
  onClick: () => void;
};

function OptionButton({
  active,
  label,
  description,
  onClick,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        text-left rounded-2xl border p-4 transition
        ${
          active
            ? "border-[#A93622] bg-[#A93622]/20 text-white"
            : "border-white/10 bg-black/30 text-gray-400 hover:bg-white/5"
        }
      `}
    >
      <p className="font-bold uppercase">{label}</p>

      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </button>
  );
}

export default function Calculator() {
  const [step, setStep] = useState(1);

  const [dogName, setDogName] = useState("");
  const [weight, setWeight] = useState(10);
  const [stage, setStage] = useState("adult");
  const [neutered, setNeutered] = useState("yes");
  const [bodyCondition, setBodyCondition] = useState("ideal");
  const [movement, setMovement] = useState("normal");
  const [goal, setGoal] = useState("mix");
  const [loboPercent, setLoboPercent] = useState(40);

  const totalSteps = 5;
  const progress = Math.round((step / totalSteps) * 100);

  const result = useMemo(() => {
    const rer = 70 * Math.pow(weight, 0.75);

    const baseFactor =
      stage === "puppy"
        ? 2.5
        : stage === "senior" && neutered === "yes"
        ? 1.4
        : stage === "senior" && neutered === "no"
        ? 1.6
        : neutered === "yes"
        ? 1.6
        : 1.8;

    const bodyFactor =
      bodyCondition === "thin" ? 1.05 : bodyCondition === "over" ? 0.95 : 1;

    const movementFactor =
      movement === "low" ? 0.95 : movement === "high" ? 1.1 : 1;

    const mer = rer * baseFactor * bodyFactor * movementFactor;

    // Estimación por gramaje hasta tener kcal reales por porción LOBO.
    const estimatedDailyFoodGrams =
      movement === "low"
        ? weight * 1000 * 0.017
        : movement === "high"
        ? weight * 1000 * 0.023
        : weight * 1000 * 0.02;

    const dailyLoboGrams = estimatedDailyFoodGrams * (loboPercent / 100);
    const monthlyLoboGrams = dailyLoboGrams * 30;
    const portions = Math.ceil(monthlyLoboGrams / 170);

    const plan =
      portions <= 10
        ? "Premium Box"
        : portions <= 20
        ? "Plan Chico"
        : portions <= 30
        ? "Plan Mediano"
        : "Plan personalizado";

    const message =
      portions <= 10
        ? "Prueba inteligente, sin apostar el mes completo."
        : portions <= 20
        ? "Mejora el plato sin cambiar todo de golpe."
        : portions <= 30
        ? "Más consistencia sin estar reordenando."
        : "Conviene personalizar. No todos necesitan 100% LOBO para empezar.";

    return {
      rer: Math.round(rer),
      mer: Math.round(mer),
      dailyFoodGrams: Math.round(estimatedDailyFoodGrams),
      dailyLoboGrams: Math.round(dailyLoboGrams),
      portions,
      plan,
      message,
    };
  }, [weight, stage, neutered, bodyCondition, movement, loboPercent]);

  const displayName = dogName.trim() || "tu perro";

  const stageLabel =
    stage === "puppy" ? "Cachorro" : stage === "senior" ? "Senior" : "Adulto";

  const bodyConditionLabel =
    bodyCondition === "thin"
      ? "Delgado"
      : bodyCondition === "over"
      ? "Con pancita"
      : "Ideal";

  const movementLabel =
    movement === "low"
      ? "0 a 45 min al día"
      : movement === "high"
      ? "90+ min / corre / entrena"
      : "45 a 90 min al día";

  const goalLabel =
    goal === "try"
      ? "Solo probar LOBO"
      : goal === "base"
      ? "Base diaria"
      : goal === "adjust"
      ? "Bajar un poco croqueta"
      : "Mix feeding";

  function goNext() {
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }

    setStep(6);
  }

  function goBack() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  function goToResult() {
    setStep(6);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-8">
      {step <= totalSteps && (
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="uppercase tracking-[0.3em] text-xs text-gray-500">
              Paso {step} de {totalSteps}
            </p>

            <p className="text-sm text-gray-500">{progress}% completo</p>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#A93622] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-8 md:mt-10 min-h-[420px] md:min-h-[520px] flex flex-col">
        {step === 1 && (
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-gray-500">
              Tu perro
            </p>

            <h2 className="mt-4 text-4xl md:text-6xl font-black uppercase leading-[0.9]">
              Empecemos con lo básico.
            </h2>

            <div className="mt-8 md:mt-10 grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm uppercase tracking-[0.2em] text-gray-500">
                  Nombre del perro
                </label>

                <input
                  type="text"
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  placeholder="Ej. Nube"
                  className="mt-4 w-full rounded-2xl bg-black border border-white/10 px-4 py-4 text-white placeholder:text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-[0.2em] text-gray-500">
                  Peso: {weight} kg
                </label>

                <input
                  type="range"
                  min="2"
                  max="60"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full mt-7"
                />

                <div className="mt-3 flex justify-between text-xs uppercase tracking-[0.15em] text-gray-600">
                  <span>2kg</span>
                  <span>60kg</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-gray-500">
              Etapa
            </p>

            <h2 className="mt-4 text-4xl md:text-6xl font-black uppercase leading-[0.9]">
              ¿En qué etapa está {displayName}?
            </h2>

            <div className="mt-10 grid md:grid-cols-3 gap-4">
              <OptionButton
                active={stage === "puppy"}
                label="Cachorro"
                description="Está creciendo"
                onClick={() => setStage("puppy")}
              />

              <OptionButton
                active={stage === "adult"}
                label="Adulto"
                description="Mantenimiento"
                onClick={() => setStage("adult")}
              />

              <OptionButton
                active={stage === "senior"}
                label="Senior"
                description="Más cuidado"
                onClick={() => setStage("senior")}
              />
            </div>

            <div className="mt-10">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                ¿Está esterilizado/castrado?
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4 max-w-md">
                <OptionButton
                  active={neutered === "yes"}
                  label="Sí"
                  onClick={() => setNeutered("yes")}
                />

                <OptionButton
                  active={neutered === "no"}
                  label="No"
                  onClick={() => setNeutered("no")}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-gray-500">
              Condición
            </p>

            <h2 className="mt-4 text-4xl md:text-6xl font-black uppercase leading-[0.9]">
              ¿Qué silueta lo representa mejor?
            </h2>

            <div className="mt-10 grid md:grid-cols-3 gap-4">
              <OptionButton
                active={bodyCondition === "thin"}
                label="Delgado"
                description="Se ve muy marcado"
                onClick={() => setBodyCondition("thin")}
              />

              <OptionButton
                active={bodyCondition === "ideal"}
                label="Ideal"
                description="Se ve proporcionado"
                onClick={() => setBodyCondition("ideal")}
              />

              <OptionButton
                active={bodyCondition === "over"}
                label="Con pancita"
                description="Podría ajustar"
                onClick={() => setBodyCondition("over")}
              />
            </div>

            <p className="mt-6 text-sm text-gray-500 max-w-2xl">
              La silueta ayuda a ajustar la estimación inicial. No sustituye una
              evaluación veterinaria.
            </p>
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-gray-500">
              Rutina
            </p>

            <h2 className="mt-4 text-4xl md:text-6xl font-black uppercase leading-[0.9]">
              ¿Cuánto movimiento real tiene al día?
            </h2>

            <div className="mt-10 grid md:grid-cols-3 gap-4">
              <OptionButton
                active={movement === "low"}
                label="Poco"
                description="0–45 min al día"
                onClick={() => setMovement("low")}
              />

              <OptionButton
                active={movement === "normal"}
                label="Normal"
                description="45–90 min al día"
                onClick={() => setMovement("normal")}
              />

              <OptionButton
                active={movement === "high"}
                label="Alto"
                description="90+ min / corre / entrena"
                onClick={() => setMovement("high")}
              />
            </div>

            <p className="mt-6 text-sm text-gray-500 max-w-2xl">
              Cuenta movimiento real: caminatas, juego activo, correr o
              entrenamiento. No solo “es inquieto en casa”.
            </p>
          </div>
        )}

        {step === 5 && (
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-gray-500">
              Objetivo
            </p>

            <h2 className="mt-4 text-4xl md:text-6xl font-black uppercase leading-[0.9]">
              ¿Qué quieres lograr con LOBO?
            </h2>

            <div className="mt-10 grid md:grid-cols-2 gap-4">
              <OptionButton
                active={goal === "try"}
                label="Probar"
                description="Empezar suave"
                onClick={() => {
                  setGoal("try");
                  setLoboPercent(20);
                }}
              />

              <OptionButton
                active={goal === "mix"}
                label="Mix feeding"
                description="Mejorar su plato"
                onClick={() => {
                  setGoal("mix");
                  setLoboPercent(40);
                }}
              />

              <OptionButton
                active={goal === "base"}
                label="Base diaria"
                description="Más LOBO"
                onClick={() => {
                  setGoal("base");
                  setLoboPercent(80);
                }}
              />

              <OptionButton
                active={goal === "adjust"}
                label="Bajar croqueta"
                description="Sin cambiar todo"
                onClick={() => {
                  setGoal("adjust");
                  setLoboPercent(30);
                }}
              />
            </div>

            <div className="mt-10">
              <label className="block text-sm uppercase tracking-[0.2em] text-gray-500">
                LOBO en el plato: {loboPercent}%
              </label>

              <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={loboPercent}
                onChange={(e) => setLoboPercent(Number(e.target.value))}
                className="w-full mt-4"
              />

              <div className="mt-3 flex justify-between text-xs uppercase tracking-[0.15em] text-gray-600">
                <span>Más croqueta</span>
                <span>Más LOBO</span>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 lg:gap-8">
            <div>
              <p className="uppercase tracking-[0.3em] text-xs md:text-sm text-gray-500">
                Resultado
              </p>

              <h2 className="mt-4 text-3xl md:text-6xl font-black uppercase leading-[0.9]">
                Para {displayName}, lo lógico es:
              </h2>

              <p className="mt-5 text-[#C9BDAA] text-base md:text-lg leading-relaxed">
                {result.message}
              </p>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-6 rounded-full border border-white/10 px-5 py-3 text-xs md:text-sm font-bold uppercase text-gray-300 transition hover:bg-white/5"
              >
                Recalcular
              </button>
            </div>

            <div className="rounded-3xl bg-black/50 border border-white/10 p-5 md:p-8">
              <p className="uppercase tracking-[0.3em] text-xs md:text-sm text-gray-500">
                Plan recomendado
              </p>

              <h3 className="text-4xl md:text-5xl font-black mt-4 uppercase text-white">
                {result.plan}
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4">
                <div className="rounded-2xl border border-[#A93622]/40 bg-[#A93622]/10 p-4 md:p-5">
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#C9BDAA]">
                    Porciones / mes
                  </p>
                  <p className="mt-2 text-3xl md:text-4xl font-black">
                    {result.portions}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#C9BDAA]">
                    LOBO diario
                  </p>
                  <p className="mt-2 text-3xl md:text-4xl font-black">
                    {result.dailyLoboGrams}g
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
                <div className="flex items-center justify-between text-[10px] md:text-xs uppercase tracking-[0.18em] text-gray-500">
                  <span>Más croqueta</span>
                  <span>Más LOBO</span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={loboPercent}
                  onChange={(e) => setLoboPercent(Number(e.target.value))}
                  className="mt-5 w-full"
                />

                <p className="mt-4 text-center text-sm md:text-base text-gray-400 leading-relaxed">
                  <span className="font-bold text-white">
                    {loboPercent}% LOBO
                  </span>{" "}
                  +{" "}
                  <span className="font-bold text-white">
                    {100 - loboPercent}% alimento actual
                  </span>
                </p>

                <p className="mt-2 text-center text-xs text-gray-500">
                  Al mover la barra, se recalcula el plan.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-gray-500">Peso</p>
                  <p className="mt-1 font-bold text-white">{weight} kg</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-gray-500">Etapa</p>
                  <p className="mt-1 font-bold text-white">{stageLabel}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-gray-500">Silueta</p>
                  <p className="mt-1 font-bold text-white">
                    {bodyConditionLabel}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-gray-500">Objetivo</p>
                  <p className="mt-1 font-bold text-white">{goalLabel}</p>
                </div>

                <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-gray-500">Movimiento</p>
                  <p className="mt-1 font-bold text-white">{movementLabel}</p>
                </div>

                <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-gray-500">Energía diaria estimada</p>
                  <p className="mt-1 font-bold text-white">
                    {result.mer} kcal/día
                  </p>
                </div>
              </div>

              <p className="mt-6 text-xs md:text-sm text-gray-500 leading-relaxed">
                Estimación inicial. Ajustamos según apetito, popó, peso y
                respuesta del perro.
              </p>

              <a
                href={`https://wa.me/5213330626243?text=${encodeURIComponent(
                  `Hola, quiero calcular un plan LOBO.

Perro: ${displayName}
Peso: ${weight} kg
Etapa: ${stageLabel}
Esterilizado/castrado: ${neutered === "yes" ? "Sí" : "No"}
Silueta: ${bodyConditionLabel}
Movimiento: ${movementLabel}
Objetivo: ${goalLabel}
LOBO en el plato: ${loboPercent}%
LOBO diario estimado: ${result.dailyLoboGrams}g
Porciones estimadas: ${result.portions}
Plan recomendado: ${result.plan}`
                )}`}
                target="_blank"
                className="inline-flex mt-6 w-full justify-center rounded-full bg-white px-6 py-4 text-xs md:text-sm font-bold uppercase text-black transition hover:bg-gray-200"
              >
                Mandar cálculo por WhatsApp
              </a>
            </div>
          </div>
        )}

        {step <= totalSteps && (
          <div className="mt-auto pt-10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1}
              className="rounded-full border border-white/10 px-6 py-3 text-sm font-bold uppercase text-gray-400 transition hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              Atrás
            </button>

            <button
              type="button"
              onClick={step === totalSteps ? goToResult : goNext}
              className="rounded-full bg-white px-8 py-4 text-sm font-bold uppercase text-black transition hover:bg-gray-200"
            >
              {step === totalSteps ? "Ver resultado" : "Continuar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
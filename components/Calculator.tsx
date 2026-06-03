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
  onClick
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group min-h-[104px] rounded-2xl border p-5 text-left transition
        ${
          active
            ? "border-[#A93622] bg-[#A93622]/20 text-[#F4EFE3] shadow-[0_0_36px_rgba(169,54,34,0.18)]"
            : "border-[#F4EFE3]/10 bg-black/30 text-[#C9BDAA] hover:border-[#F4EFE3]/25 hover:bg-[#F4EFE3]/[0.06]"
        }
      `}
    >
      <span
        className={`
          mb-4 grid h-7 w-7 place-items-center rounded-full border transition
          ${
            active
              ? "border-[#A93622] bg-[#A93622]"
              : "border-[#F4EFE3]/20 bg-[#F4EFE3]/[0.03] group-hover:border-[#F4EFE3]/40"
          }
        `}
        aria-hidden="true"
      >
        {active && <span className="h-2.5 w-2.5 rounded-full bg-[#F4EFE3]" />}
      </span>

      <p className="text-sm font-black uppercase tracking-[0.08em]">{label}</p>

      {description && (
        <p className="mt-2 text-sm leading-5 text-[#8E7F6A]">{description}</p>
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
      message
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
    <div className="relative overflow-hidden rounded-[2rem] border border-[#F4EFE3]/10 bg-[#080706] shadow-2xl shadow-black/40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F4EFE3]/30 to-transparent" />
      <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#A93622]/20 blur-3xl" />

      <div className="relative p-5 sm:p-6 md:p-8 lg:p-10">
      {step <= totalSteps && (
        <div className="rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="uppercase tracking-[0.3em] text-xs text-[#8E7F6A]">
              Paso {step} de {totalSteps}
            </p>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C9BDAA]">
              {progress}% completo
            </p>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F4EFE3]/10">
            <div
              className="h-full rounded-full bg-[#A93622] shadow-[0_0_18px_rgba(169,54,34,0.65)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-8 flex min-h-[540px] flex-col md:mt-10">
        {step === 1 && (
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-[#8E7F6A]">
              Tu perro
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.9] text-[#F4EFE3] md:text-6xl">
              Empecemos con lo básico.
            </h2>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-5">
                <label className="block text-xs uppercase tracking-[0.2em] text-[#8E7F6A]">
                  Nombre de tu lobo
                </label>

                <input
                  type="text"
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  placeholder="Ej. Nube"
                  className="mt-4 w-full rounded-2xl border border-[#F4EFE3]/10 bg-[#F4EFE3]/[0.04] px-4 py-4 text-[#F4EFE3] outline-none transition placeholder:text-[#8E7F6A]/60 focus:border-[#A93622] focus:ring-4 focus:ring-[#A93622]/15"
                />
              </div>

              <div className="rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-5">
                <label className="block text-xs uppercase tracking-[0.2em] text-[#8E7F6A]">
                  Peso: {weight} kg
                </label>

                <input
                  type="range"
                  min="2"
                  max="60"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="mt-7 w-full accent-[#A93622]"
                />

                <div className="mt-3 flex justify-between text-xs uppercase tracking-[0.15em] text-[#8E7F6A]">
                  <span>2kg</span>
                  <span>60kg</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-[#8E7F6A]">
              Etapa
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.9] text-[#F4EFE3] md:text-6xl">
              ¿En qué etapa está {displayName}?
            </h2>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
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
              <p className="text-xs uppercase tracking-[0.2em] text-[#8E7F6A]">
                ¿Está esterilizado/castrado?
              </p>

              <div className="mt-4 grid max-w-md grid-cols-2 gap-4">
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
            <p className="uppercase tracking-[0.3em] text-sm text-[#8E7F6A]">
              Condición
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.9] text-[#F4EFE3] md:text-6xl">
              ¿Qué silueta lo representa mejor?
            </h2>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
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

            <p className="mt-6 max-w-2xl rounded-2xl border border-[#F4EFE3]/10 bg-[#F4EFE3]/[0.03] p-4 text-sm leading-6 text-[#8E7F6A]">
              La silueta ayuda a ajustar la estimación inicial. No sustituye una
              evaluación veterinaria.
            </p>
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-[#8E7F6A]">
              Rutina
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.9] text-[#F4EFE3] md:text-6xl">
              ¿Cuánto movimiento real tiene al día?
            </h2>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
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

            <p className="mt-6 max-w-2xl rounded-2xl border border-[#F4EFE3]/10 bg-[#F4EFE3]/[0.03] p-4 text-sm leading-6 text-[#8E7F6A]">
              Cuenta movimiento real: caminatas, juego activo, correr o
              entrenamiento. No solo “es inquieto en casa”.
            </p>
          </div>
        )}

        {step === 5 && (
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-[#8E7F6A]">
              Objetivo
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.9] text-[#F4EFE3] md:text-6xl">
              ¿Qué quieres lograr con LOBO?
            </h2>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
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

            <div className="mt-10 rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-5">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#8E7F6A]">
                LOBO en el plato: {loboPercent}%
              </label>

              <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={loboPercent}
                onChange={(e) => setLoboPercent(Number(e.target.value))}
                className="mt-5 w-full accent-[#A93622]"
              />

              <div className="mt-3 flex justify-between text-xs uppercase tracking-[0.15em] text-[#8E7F6A]">
                <span>Más croqueta</span>
                <span>Más LOBO</span>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="uppercase tracking-[0.3em] text-sm text-[#8E7F6A]">
                Resultado
              </p>

              <h2 className="mt-4 text-4xl font-black uppercase leading-[0.9] text-[#F4EFE3] md:text-6xl">
                Para {displayName}, lo lógico es:
              </h2>

              <p className="mt-6 text-[#C9BDAA] text-lg">{result.message}</p>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-8 rounded-full border border-[#F4EFE3]/15 px-6 py-3 text-sm font-bold uppercase text-[#C9BDAA] transition hover:border-[#F4EFE3]/30 hover:bg-[#F4EFE3]/[0.06]"
              >
                Recalcular
              </button>
            </div>

            <div className="rounded-[2rem] border border-[#F4EFE3]/10 bg-black/50 p-5 shadow-2xl shadow-black/30 sm:p-8">
              <p className="uppercase tracking-[0.3em] text-sm text-[#8E7F6A]">
                Plan recomendado
              </p>

              <h3 className="mt-4 text-4xl font-black uppercase leading-none text-[#F4EFE3] sm:text-5xl">
                {result.plan}
              </h3>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#A93622]/30 bg-[#A93622]/15 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#C9BDAA]">
                    Porciones / mes
                  </p>
                  <p className="mt-2 text-4xl font-black text-[#F4EFE3]">
                    {result.portions}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#F4EFE3]/10 bg-[#F4EFE3]/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8E7F6A]">
                    LOBO diario
                  </p>
                  <p className="mt-2 text-4xl font-black text-[#F4EFE3]">
                    {result.dailyLoboGrams}g
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-[#F4EFE3]/10 bg-[#F4EFE3]/[0.03] p-5">
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.2em] text-[#8E7F6A]">
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
                  className="mt-5 w-full accent-[#A93622]"
                />

                <p className="mt-5 text-center text-sm text-[#C9BDAA]">
                  Mix feeding estimado:{" "}
                  <span className="font-bold text-[#F4EFE3]">
                    {loboPercent}% LOBO
                  </span>{" "}
                  +{" "}
                  <span className="font-bold text-[#F4EFE3]">
                    {100 - loboPercent}% alimento actual
                  </span>
                </p>

                <p className="mt-3 text-center text-xs leading-5 text-[#8E7F6A]">
                  Al mover la barra, se recalculan las porciones mensuales y el
                  plan recomendado.
                </p>
              </div>

              <div className="mt-8 grid gap-3 text-sm text-[#8E7F6A] sm:grid-cols-2">
                <p className="rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-4">
                  Peso
                  <span className="mt-1 block font-bold text-[#F4EFE3]">
                    {weight} kg
                  </span>
                </p>

                <p className="rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-4">
                  Etapa
                  <span className="mt-1 block font-bold text-[#F4EFE3]">
                    {stageLabel}
                  </span>
                </p>

                <p className="rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-4">
                  Silueta
                  <span className="mt-1 block font-bold text-[#F4EFE3]">
                    {bodyConditionLabel}
                  </span>
                </p>

                <p className="rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-4">
                  Movimiento
                  <span className="mt-1 block font-bold text-[#F4EFE3]">
                    {movementLabel}
                  </span>
                </p>

                <p className="rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-4">
                  Objetivo
                  <span className="mt-1 block font-bold text-[#F4EFE3]">
                    {goalLabel}
                  </span>
                </p>

                <p className="rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-4">
                  Energía diaria estimada
                  <span className="mt-1 block font-bold text-[#F4EFE3]">
                    {result.mer} kcal/día
                  </span>
                </p>
              </div>

              <p className="mt-8 text-sm leading-6 text-[#8E7F6A]">
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
                className="mt-8 inline-flex w-full justify-center rounded-full bg-[#F4EFE3] px-7 py-4 text-sm font-bold uppercase tracking-wide text-black transition hover:bg-white"
              >
                Mandar cálculo por WhatsApp
              </a>
            </div>
          </div>
        )}

        {step <= totalSteps && (
          <div className="mt-auto flex items-center justify-between gap-4 pt-10">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1}
              className="rounded-full border border-[#F4EFE3]/15 px-6 py-3 text-sm font-bold uppercase text-[#C9BDAA] transition hover:border-[#F4EFE3]/30 hover:bg-[#F4EFE3]/[0.06] disabled:opacity-30 disabled:hover:border-[#F4EFE3]/15 disabled:hover:bg-transparent"
            >
              Atrás
            </button>

            <button
              type="button"
              onClick={step === totalSteps ? goToResult : goNext}
              className="rounded-full bg-[#F4EFE3] px-8 py-4 text-sm font-bold uppercase tracking-wide text-black transition hover:bg-white"
            >
              {step === totalSteps ? "Ver resultado" : "Continuar"}
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

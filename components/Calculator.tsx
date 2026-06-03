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
            ? "border-[#A93622] bg-[#F4EFE3]/10 text-white shadow-[0_14px_40px_rgba(0,0,0,0.22)]"
            : "border-[#F4EFE3]/15 bg-[#F4EFE3]/[0.055] text-[#F4EFE3] hover:border-[#F4EFE3]/30 hover:bg-[#F4EFE3]/[0.085]"
        }
      `}
    >
      <p className="font-bold uppercase">{label}</p>

      {description && (
        <p className="mt-1 text-sm text-[#C9BDAA]">{description}</p>
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

    // Estimación por gramaje calibrada con observación real LOBO.
    // Cuando tengamos kcal reales por porción, esto se cambia a cálculo energético.
    const estimatedDailyFoodGrams =
      movement === "low"
        ? weight * 1000 * 0.0135
        : movement === "high"
        ? weight * 1000 * 0.018
        : weight * 1000 * 0.016;

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
        ? "Prueba inteligente, sin apostar el mes completo. Premium Box $370."
        : portions <= 20
        ? "Mejora el plato sin cambiar todo de golpe. Sugerencia: Suscripción al Plan Chico. $630/mes."
        : portions <= 30
        ? "Más consistencia sin estar reordenando. Sugerencia: Suscripción al Plan Mensual Mediano $945/mes."
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
    <div className="rounded-[2rem] border border-black/10 bg-[#14110F] p-4 text-[#F4EFE3] shadow-2xl shadow-black/20 sm:p-5 md:p-8">
      {step <= totalSteps && (
        <div className="rounded-2xl border border-[#F4EFE3]/10 bg-[#F4EFE3]/[0.075] p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="uppercase tracking-[0.3em] text-xs text-[#C9BDAA]">
              Paso {step} de {totalSteps}
            </p>

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9BDAA] sm:text-sm">
              {progress}% completo
            </p>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F4EFE3]/15">
            <div
              className="h-full rounded-full bg-[#A93622] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-8 flex min-h-[420px] flex-col md:mt-10 md:min-h-[520px]">
        {step === 1 && (
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-[#C9BDAA] md:text-sm">
              Tu perro
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase leading-[0.92] text-white sm:text-4xl md:text-6xl">
              Empecemos con lo básico.
            </h2>

            <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 md:gap-6">
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#C9BDAA] md:text-sm">
                  Nombre del perro
                </label>

                <input
                  type="text"
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  placeholder="Ej. Nube"
                  className="mt-4 w-full rounded-2xl border border-[#F4EFE3]/15 bg-[#F4EFE3]/[0.055] px-4 py-4 text-white outline-none transition placeholder:text-[#C9BDAA]/55 focus:border-[#A93622] focus:ring-4 focus:ring-[#A93622]/15"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#C9BDAA] md:text-sm">
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

                <div className="mt-3 flex justify-between text-xs uppercase tracking-[0.15em] text-[#C9BDAA]">
                  <span>2kg</span>
                  <span>60kg</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-[#C9BDAA] md:text-sm">
              Etapa
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase leading-[0.92] text-white sm:text-4xl md:text-6xl">
              ¿En qué etapa está {displayName}?
            </h2>

            <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3">
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
              <p className="text-xs uppercase tracking-[0.2em] text-[#C9BDAA] md:text-sm">
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
            <p className="uppercase tracking-[0.3em] text-xs text-[#C9BDAA] md:text-sm">
              Condición
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase leading-[0.92] text-white sm:text-4xl md:text-6xl">
              ¿Qué silueta lo representa mejor?
            </h2>

            <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3">
              <OptionButton
                active={bodyCondition === "thin"}
                label="Delgado"
                description="Se ve muy delgado"
                onClick={() => setBodyCondition("thin")}
              />

              <OptionButton
                active={bodyCondition === "ideal"}
                label="Ideal"
                description="Se ve bien su cintura y costillas"
                onClick={() => setBodyCondition("ideal")}
              />

              <OptionButton
                active={bodyCondition === "over"}
                label="Con pancita"
                description="Podría bajar un poco de peso"
                onClick={() => setBodyCondition("over")}
              />
            </div>

            <p className="mt-6 max-w-2xl rounded-2xl border border-[#F4EFE3]/10 bg-[#F4EFE3]/[0.03] p-4 text-sm leading-6 text-[#C9BDAA]">
              La silueta ayuda a ajustar la estimación inicial. No sustituye una
              evaluación veterinaria.
            </p>
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-[#C9BDAA] md:text-sm">
              Rutina
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase leading-[0.92] text-white sm:text-4xl md:text-6xl">
              ¿Cuánto movimiento real tiene al día?
            </h2>

            <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3">
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

            <p className="mt-6 max-w-2xl rounded-2xl border border-[#F4EFE3]/10 bg-[#F4EFE3]/[0.03] p-4 text-sm leading-6 text-[#C9BDAA]">
              Cuenta movimiento real: caminatas, juego activo, correr o
              entrenamiento. No solo “es inquieto en casa”.
            </p>
          </div>
        )}

        {step === 5 && (
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-[#C9BDAA] md:text-sm">
              Objetivo
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase leading-[0.92] text-white sm:text-4xl md:text-6xl">
              ¿Qué quieres lograr con LOBO?
            </h2>

            <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2">
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
              <label className="block text-xs uppercase tracking-[0.2em] text-[#C9BDAA]">
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

              <div className="mt-3 flex justify-between text-xs uppercase tracking-[0.15em] text-[#C9BDAA]">
                <span>Más croqueta</span>
                <span>Más LOBO</span>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
            <div>
              <p className="uppercase tracking-[0.3em] text-xs text-[#C9BDAA] md:text-sm">
                Resultado
              </p>

              <h2 className="mt-4 text-3xl font-black uppercase leading-[0.9] text-white md:text-6xl">
                Para {displayName}, lo lógico es:
              </h2>

              <p className="mt-5 text-base leading-relaxed text-[#C9BDAA] md:text-lg">
                {result.message}
              </p>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-6 rounded-full border border-[#F4EFE3]/15 px-5 py-3 text-xs font-bold uppercase text-[#C9BDAA] transition hover:bg-[#F4EFE3]/[0.06] md:text-sm"
              >
                Recalcular
              </button>
            </div>

            <div className="rounded-3xl border border-[#F4EFE3]/15 bg-[#F4EFE3]/[0.055] p-5 md:p-8">
              <p className="uppercase tracking-[0.3em] text-xs text-[#C9BDAA] md:text-sm">
                Plan recomendado
              </p>

              <h3 className="mt-4 text-4xl font-black uppercase text-white md:text-5xl">
                {result.plan}
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4">
                <div className="rounded-2xl border border-[#A93622]/40 bg-[#A93622]/10 p-4 md:p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9BDAA] md:text-xs">
                    Porciones / mes
                  </p>

                  <p className="mt-2 text-3xl font-black text-white md:text-4xl">
                    {result.portions}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-4 md:p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9BDAA] md:text-xs">
                    LOBO diario
                  </p>

                  <p className="mt-2 text-3xl font-black text-white md:text-4xl">
                    {result.dailyLoboGrams}g
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-4 md:p-5">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#C9BDAA] md:text-xs">
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

                <p className="mt-4 text-center text-sm leading-relaxed text-[#C9BDAA] md:text-base">
                  <span className="font-bold text-white">
                    {loboPercent}% LOBO
                  </span>{" "}
                  +{" "}
                  <span className="font-bold text-white">
                    {100 - loboPercent}% alimento actual
                  </span>
                </p>

                <p className="mt-2 text-center text-xs text-[#C9BDAA]">
                  Al mover la barra, se recalcula el plan.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-4">
                  <p className="text-[#C9BDAA]">Peso</p>
                  <p className="mt-1 font-bold text-white">{weight} kg</p>
                </div>

                <div className="rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-4">
                  <p className="text-[#C9BDAA]">Etapa</p>
                  <p className="mt-1 font-bold text-white">{stageLabel}</p>
                </div>

                <div className="rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-4">
                  <p className="text-[#C9BDAA]">Silueta</p>
                  <p className="mt-1 font-bold text-white">
                    {bodyConditionLabel}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-4">
                  <p className="text-[#C9BDAA]">Objetivo</p>
                  <p className="mt-1 font-bold text-white">{goalLabel}</p>
                </div>

                <div className="col-span-2 rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-4">
                  <p className="text-[#C9BDAA]">Movimiento</p>
                  <p className="mt-1 font-bold text-white">{movementLabel}</p>
                </div>

                <div className="col-span-2 rounded-2xl border border-[#F4EFE3]/10 bg-black/30 p-4">
                  <p className="text-[#C9BDAA]">Energía diaria estimada</p>
                  <p className="mt-1 font-bold text-white">
                    {result.mer} kcal/día
                  </p>
                </div>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-[#C9BDAA] md:text-sm">
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
                className="mt-6 inline-flex w-full justify-center rounded-full bg-[#F4EFE3] px-6 py-4 text-xs font-bold uppercase text-black transition hover:bg-white md:text-sm"
              >
                Mandar cálculo por WhatsApp
              </a>
            </div>
          </div>
        )}

        {step <= totalSteps && (
          <div className="mt-auto flex flex-col-reverse gap-3 pt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1}
              className="w-full rounded-full border border-[#F4EFE3]/15 px-6 py-3 text-sm font-bold uppercase text-[#C9BDAA] transition hover:border-[#F4EFE3]/30 hover:bg-[#F4EFE3]/[0.06] disabled:opacity-30 disabled:hover:border-[#F4EFE3]/15 disabled:hover:bg-transparent sm:w-auto"
            >
              Atrás
            </button>

            <button
              type="button"
              onClick={step === totalSteps ? goToResult : goNext}
              className="w-full rounded-full bg-[#F4EFE3] px-8 py-4 text-sm font-bold uppercase tracking-wide text-black transition hover:bg-white sm:w-auto"
            >
              {step === totalSteps ? "Ver resultado" : "Continuar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
// Temporary commercial cap for the calculator only; not a nutritional limit.
export const MAX_MONTHLY_LOBO_PORTIONS = 55;
export const MONTHLY_LIMIT_MESSAGE =
  "Tu cálculo supera 55 porciones al mes. Ajustamos el porcentaje de LOBO para mantener tu plan en un máximo de 55 porciones: práctico, consistente y con criterio.";

export type CalculatorInput = {
  weight: number;
  stage: string;
  neutered: string;
  bodyCondition: string;
  movement: string;
  loboPercent: number;
};

// Avoid a spurious extra portion for floating-point values such as 55.00000000000001.
function ceilPortions(value: number) {
  return Math.ceil(value - Number.EPSILON * Math.max(1, Math.abs(value)) * 8);
}

export function calculateLoboPlan({ weight, stage, neutered, bodyCondition, movement, loboPercent }: CalculatorInput) {
  // 1. RER: energía en reposo
  const rer = 70 * Math.pow(weight, 0.75);

  // 2. Factor base por etapa + esterilización/castración
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

  // 3. Ajuste suave por silueta corporal
  const bodyFactor =
    bodyCondition === "thin" ? 1.05 : bodyCondition === "over" ? 0.95 : 1;

  // 4. Ajuste por movimiento real
  const movementFactor =
    movement === "low" ? 0.95 : movement === "high" ? 1.1 : 1;

  // 5. MER base
  const mer = rer * baseFactor * bodyFactor * movementFactor;

  // 6. Factor de calibración LOBO
  // Aterriza el MER a observación real de consumo, saciedad y respuesta.
  const calibrationFactor =
    movement === "low" ? 0.85 : movement === "high" ? 0.9 : 0.9;

  const adjustedMer = mer * calibrationFactor;

  const mix = calculateMix(adjustedMer, loboPercent);
  const {
    totalDailyFoodGrams, dailyLoboGrams, dailyKibbleGrams,
    dailyLoboKcal, dailyKibbleKcal, totalMixKcal,
    loboGramPercent, loboKcalPercent, kibbleKcalPercent,
    kcalPerLoboPortion, kcalPerGramKibble, portions, dailyPortions, monthlyPortions,
  } = mix;

  // 16. Plan recomendado
  const plan =
    portions <= 10
      ? "Premium Box\n$370 pago único"
      : portions <= 20
      ? "Plan Chico $630/mes"
      : portions <= 30
      ? "Plan Mediano $945/mes"
      : "Plan\npersonalizado";

  const message =
    portions <= 10
      ? "Prueba inteligente, sin apostar el mes completo."
      : portions <= 20
      ? "Mejora el plato sin tener que cambiar todo de golpe."
      : portions <= 30
      ? "Más consistencia sin estar reordenando. Suscríbete."
      : "Conviene personalizar. No todos necesitan 100% LOBO para empezar.";

  const displayedLoboPercent = mix.capApplied ? Number(loboGramPercent.toFixed(2)) : loboPercent;

  return {
    capApplied: mix.capApplied,
    // Keep unrounded values separate from the existing two-decimal summaries.
    exactLoboGramPercent: mix.loboGramPercent,
    maxLoboGramPercent: calculateMix(adjustedMer, 100).loboGramPercent,
    limitMessage: mix.capApplied ? MONTHLY_LIMIT_MESSAGE : null,
    rer: Math.round(rer),
    mer: Math.round(mer),
    adjustedMer: Math.round(adjustedMer),

    totalDailyFoodGrams: Math.round(totalDailyFoodGrams),
    dailyLoboGrams: mix.capApplied ? Number(dailyLoboGrams.toFixed(2)) : Math.round(dailyLoboGrams),
    dailyKibbleGrams: mix.capApplied ? Number(dailyKibbleGrams.toFixed(2)) : Math.round(dailyKibbleGrams),

    dailyLoboKcal: Math.round(dailyLoboKcal),
    dailyKibbleKcal: Math.round(dailyKibbleKcal),
    totalMixKcal: Math.round(totalMixKcal),

    loboGramPercent: displayedLoboPercent,
    kibbleGramPercent: Number((100 - displayedLoboPercent).toFixed(2)),
    loboKcalPercent: Math.round(loboKcalPercent),
    kibbleKcalPercent: mix.capApplied ? 100 - Math.round(loboKcalPercent) : Math.round(kibbleKcalPercent),

    kcalPerLoboPortion,
    kcalPerGramKibble,

    portions,
    dailyPortions: Number(dailyPortions.toFixed(mix.capApplied ? 2 : 1)),
    monthlyPortions,
    plan,
    message,
  };
}

/** The rounded slider endpoint represents the exact 55-portion plan. */
export function getCalculatorControls(
  result: ReturnType<typeof calculateLoboPlan>,
  selectedPercent: number,
  limitPreviouslyActivated = false,
) {
  const max = result.capApplied || limitPreviouslyActivated
    ? Math.floor(result.maxLoboGramPercent)
    : 100;
  return {
    max,
    value: Math.min(selectedPercent, max),
    pieCenterPercent: Math.floor(result.exactLoboGramPercent),
  };
}

export function sliderCalculationPercent(value: number, max: number) {
  const bounded = Math.min(value, max);
  // Request the cap at the endpoint, not a recomputation using the floored %.
  // Values below the endpoint retain the original percentage calculation.
  return bounded === max && max < 100 ? 100 : bounded;
}

/** Unrounded serving values; all display rounding happens in calculateLoboPlan. */
export function calculateMix(adjustedMer: number, loboPercent: number) {
  // 7. Densidades calóricas provisionales
  const gramsPerPortion = 170;

  // LOBO provisional: ajustar cuando llegue análisis bromatológico.
  const kcalPerLoboPortion = 283;
  const kcalPerGramLobo = kcalPerLoboPortion / gramsPerPortion;

  // Croqueta base: Kirkland Cordero.
  // 3,653 kcal/kg = 3.653 kcal/g.
  const kcalPerGramKibble = 3.653;

  // 8. Barra: % del plato por gramaje
  const loboGramRatio = loboPercent / 100;
  const kibbleGramRatio = 1 - loboGramRatio;

  // 9. Densidad calórica del mix completo
  const kcalPerGramOfMix =
    loboGramRatio * kcalPerGramLobo +
    kibbleGramRatio * kcalPerGramKibble;

  // 10. Gramos totales necesarios para aproximarse al MER ajustado
  let totalDailyFoodGrams =
    kcalPerGramOfMix > 0 ? adjustedMer / kcalPerGramOfMix : 0;

  // 11. Traducción a gramos de LOBO y croqueta
  let dailyLoboGrams = totalDailyFoodGrams * loboGramRatio;
  let dailyKibbleGrams = totalDailyFoodGrams * kibbleGramRatio;

  // Apply the commercial cap after the original requirement/mix calculation.
  const requestedMonthlyPortions = ceilPortions((dailyLoboGrams / gramsPerPortion) * 30);
  const capApplied = requestedMonthlyPortions > MAX_MONTHLY_LOBO_PORTIONS;
  if (capApplied) {
    dailyLoboGrams = (MAX_MONTHLY_LOBO_PORTIONS * gramsPerPortion) / 30;
    // Preserve the existing adjusted MER with the remaining kibble calories.
    dailyKibbleGrams = (adjustedMer - dailyLoboGrams * kcalPerGramLobo) / kcalPerGramKibble;
    totalDailyFoodGrams = dailyLoboGrams + dailyKibbleGrams;
  }

  const dailyPortions = dailyLoboGrams / gramsPerPortion;
  const monthlyPortions = capApplied ? MAX_MONTHLY_LOBO_PORTIONS : requestedMonthlyPortions;
  const portions = monthlyPortions;

  // 13. Energía aportada por cada parte
  const dailyLoboKcal = dailyLoboGrams * kcalPerGramLobo;
  const dailyKibbleKcal = dailyKibbleGrams * kcalPerGramKibble;
  const totalMixKcal = dailyLoboKcal + dailyKibbleKcal;

  // 14. Porcentaje energético real
  const loboKcalPercent =
    totalMixKcal > 0 ? (dailyLoboKcal / totalMixKcal) * 100 : 0;

  const kibbleKcalPercent = 100 - loboKcalPercent;

  // 15. Porcentaje visual del plato por gramaje
  const loboGramPercent =
    capApplied ? (dailyLoboGrams / totalDailyFoodGrams) * 100 : loboPercent;

  const kibbleGramPercent = 100 - loboGramPercent;

  return {
    capApplied, requestedMonthlyPortions,
    totalDailyFoodGrams, dailyLoboGrams, dailyKibbleGrams,
    dailyLoboKcal, dailyKibbleKcal, totalMixKcal,
    loboGramPercent, kibbleGramPercent, loboKcalPercent, kibbleKcalPercent,
    kcalPerLoboPortion, kcalPerGramKibble, portions, dailyPortions, monthlyPortions,
  };
}

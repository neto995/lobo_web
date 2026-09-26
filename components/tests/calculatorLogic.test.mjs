import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateLoboPlan, calculateMix, getCalculatorControls, sliderCalculationPercent, MONTHLY_LIMIT_MESSAGE } from "../calculatorLogic.ts";

const base = { weight: 10, stage: "adult", neutered: "yes", bodyCondition: "ideal", movement: "normal", loboPercent: 40 };
const near = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≠ ${expected}`);

// Construct requirements from known servings and the existing gram-based mix.
// This is intentionally not a linear scaling of the selected percentage.
function requirementFor(portions, percent) {
  const loboGrams = portions * 170 / 30;
  const kibbleGrams = loboGrams * (100 - percent) / percent;
  return loboGrams * (283 / 170) + kibbleGrams * 3.653;
}

function inputFor(portions, percent) {
  return { ...base, weight: (requirementFor(portions, percent) / (70 * 1.6 * .9)) ** (1 / .75), loboPercent: percent };
}

for (const [percent, portions, capped] of [[100, 30, false], [100, 55, false], [100, 80, true], [70, 48, false], [70, 65, true]]) {
  test(`${percent}% LOBO con ${portions} porciones: ${capped ? "ajusta a 55 y recalcula el mix" : "conserva porcentaje y porciones"}`, () => {
    const energy = requirementFor(portions, percent);
    const mix = calculateMix(energy, percent);
    const result = calculateLoboPlan(inputFor(portions, percent));
    assert.equal(mix.requestedMonthlyPortions, portions);
    assert.equal(mix.capApplied, capped);
    assert.equal(result.capApplied, capped);
    assert.equal(result.monthlyPortions, capped ? 55 : portions);
    assert.equal(result.portions, result.monthlyPortions);
    assert.equal(result.limitMessage, capped ? MONTHLY_LIMIT_MESSAGE : null);
    near(mix.totalMixKcal, energy);
    near(mix.loboGramPercent + mix.kibbleGramPercent, 100);
    near(result.loboGramPercent + result.kibbleGramPercent, 100);
    near(mix.dailyLoboGrams / 170, mix.dailyPortions);
    near(mix.dailyLoboGrams + mix.dailyKibbleGrams, mix.totalDailyFoodGrams);
    near(mix.dailyLoboGrams / mix.totalDailyFoodGrams * 100, mix.loboGramPercent);
    if (capped) {
      near(mix.dailyLoboGrams, 55 * 170 / 30);
      near(mix.dailyPortions * 30, 55);
      assert.ok(mix.loboGramPercent < percent);
      assert.ok(mix.dailyKibbleGrams > 0);
      assert.equal(result.dailyLoboGrams, 311.67);
      assert.equal(result.dailyPortions, 1.83);
      assert.equal(result.plan, "Plan\npersonalizado");
      near(result.dailyKibbleGrams, mix.dailyKibbleGrams, .005);
      near(result.loboGramPercent, mix.loboGramPercent, .005);
    } else {
      assert.equal(result.loboGramPercent, percent);
      assert.equal(mix.loboGramPercent, percent);
      assert.equal(result.kibbleGramPercent, 100 - percent);
      near(mix.dailyLoboGrams, portions * 170 / 30);
    }
  });
}

test("55 exactas no activa el aviso; superar el umbral sí lo activa", () => {
  for (const percent of [10, 37, 70, 100]) {
    for (const portions of [54.99, 55, 55.000001, 55.1]) {
      const mix = calculateMix(requirementFor(portions, percent), percent);
      assert.equal(mix.capApplied, portions > 55);
      assert.equal(mix.monthlyPortions, 55);
    }
  }
});

test("mantiene el cálculo y redondeo anteriores cuando no se activa el límite", () => {
  for (const percent of [10, 20, 37, 40, 70, 99, 100]) {
    const input = { ...base, weight: 2, loboPercent: percent };
    const energy = 70 * 2 ** .75 * 1.6 * .9;
    const total = energy / ((percent / 100) * (283 / 170) + (1 - percent / 100) * 3.653);
    const lobo = total * percent / 100;
    const kibble = total * (1 - percent / 100);
    const result = calculateLoboPlan(input);
    assert.equal(result.capApplied, false);
    assert.equal(result.dailyLoboGrams, Math.round(lobo));
    assert.equal(result.dailyKibbleGrams, Math.round(kibble));
    assert.equal(result.totalDailyFoodGrams, Math.round(total));
    assert.equal(result.dailyPortions, Number((lobo / 170).toFixed(1)));
    assert.equal(result.monthlyPortions, Math.ceil(lobo / 170 * 30));
    assert.equal(result.adjustedMer, Math.round(energy));
    assert.equal(result.loboGramPercent, percent);
    assert.equal(result.limitMessage, null);
  }
});

test("conserva los planes actuales y sus umbrales bajo el límite comercial", () => {
  for (const [portions, plan] of [[9.5, "Premium Box\n$370 pago único"], [19.5, "Plan Chico $630/mes"], [29.5, "Plan Mediano $945/mes"], [40, "Plan\npersonalizado"]]) {
    assert.equal(calculateLoboPlan(inputFor(portions, 100)).plan, plan);
  }
});

test("no modifica los factores de requerimiento y mantiene la energía en todo el rango de la interfaz", () => {
  for (const weight of [2, 10, 30, 60]) {
    for (const stage of ["puppy", "adult", "senior"]) {
      for (const neutered of ["yes", "no"]) {
        for (const bodyCondition of ["thin", "ideal", "over"]) {
          for (const movement of ["low", "normal", "high"]) {
            const factor = stage === "puppy" ? 2.5 : stage === "senior" ? (neutered === "yes" ? 1.4 : 1.6) : (neutered === "yes" ? 1.6 : 1.8);
            const rer = 70 * weight ** .75;
            const mer = rer * factor * (bodyCondition === "thin" ? 1.05 : bodyCondition === "over" ? .95 : 1) * (movement === "low" ? .95 : movement === "high" ? 1.1 : 1);
            const energy = mer * (movement === "low" ? .85 : .9);
            for (const loboPercent of [10, 37, 70, 100]) {
              const result = calculateLoboPlan({ weight, stage, neutered, bodyCondition, movement, loboPercent });
              const mix = calculateMix(energy, loboPercent);
              assert.equal(result.rer, Math.round(rer));
              assert.equal(result.mer, Math.round(mer));
              assert.equal(result.adjustedMer, Math.round(energy));
              assert.ok(result.monthlyPortions <= 55);
              assert.ok(mix.loboGramPercent <= loboPercent);
              assert.ok(mix.dailyKibbleGrams >= 0);
              near(mix.totalMixKcal, energy);
              assert.equal(result.totalMixKcal, Math.round(energy));
            }
          }
        }
      }
    }
  }
});

test("bajar el porcentaje después de activar el tope elimina el aviso", () => {
  const input = inputFor(80, 100);
  assert.equal(calculateLoboPlan(input).capApplied, true);
  const result = calculateLoboPlan({ ...input, loboPercent: 10 });
  assert.equal(result.capApplied, false);
  assert.equal(result.limitMessage, null);
  assert.equal(result.loboGramPercent, 10);
});

test("el aviso comercial usa exactamente el texto solicitado", () => {
  assert.equal(MONTHLY_LIMIT_MESSAGE, "Tu cálculo supera 55 porciones al mes. Ajustamos el porcentaje de LOBO para mantener tu plan en un máximo de 55 porciones: práctico, consistente y con criterio.");
});

test("48.35% interno conserva 55 porciones con máximo, label y centro en 48%", () => {
  const input = { ...inputFor(55, 48.35), loboPercent: 58 };
  const result = calculateLoboPlan(input);
  const controls = getCalculatorControls(result, input.loboPercent);
  near(result.exactLoboGramPercent, 48.35);
  near(result.maxLoboGramPercent, 48.35);
  assert.equal(result.loboGramPercent, 48.35);
  assert.deepEqual(controls, { max: 48, value: 48, pieCenterPercent: 48 });
  assert.equal(result.monthlyPortions, 55);
  assert.equal(result.dailyLoboGrams, 311.67);
  assert.equal(result.capApplied, true);
});

test("bajar y regresar al máximo no desbloquea el slider ni pierde la precisión del cap", () => {
  const input = { ...inputFor(55, 48.35), loboPercent: 58 };
  const capped = calculateLoboPlan(input);
  const ceiling = getCalculatorControls(capped, input.loboPercent).max;
  const lowered = calculateLoboPlan({ ...input, loboPercent: sliderCalculationPercent(40, ceiling) });
  const lowerControls = getCalculatorControls(lowered, 40, true);
  assert.equal(lowered.loboGramPercent, 40);
  assert.equal(lowered.capApplied, false);
  assert.equal(lowered.limitMessage, null);
  assert.equal(lowerControls.max, 48);
  assert.equal(lowerControls.value, 40);
  const requested = sliderCalculationPercent(48, lowerControls.max);
  const restored = calculateLoboPlan({ ...input, loboPercent: requested });
  near(restored.exactLoboGramPercent, 48.35);
  assert.equal(restored.monthlyPortions, 55);
  assert.deepEqual(getCalculatorControls(restored, requested, true), { max: 48, value: 48, pieCenterPercent: 48 });
  assert.equal(sliderCalculationPercent(70, ceiling), requested);
});

test("Math.floor usa la precisión interna aunque el resumen a dos decimales redondee hacia arriba", () => {
  const input = { ...inputFor(55, 48.999), loboPercent: 100 };
  const result = calculateLoboPlan(input);
  assert.equal(result.loboGramPercent, 49);
  near(result.exactLoboGramPercent, 48.999);
  assert.deepEqual(getCalculatorControls(result, 100), { max: 48, value: 48, pieCenterPercent: 48 });
  assert.equal(result.monthlyPortions, 55);
});

test("sin activar el cap se conserva el rango original hasta 100%", () => {
  for (const portions of [30, 55]) {
    const result = calculateLoboPlan(inputFor(portions, 100));
    assert.deepEqual(getCalculatorControls(result, 100), { max: 100, value: 100, pieCenterPercent: 100 });
    assert.equal(result.monthlyPortions, portions);
    assert.equal(result.limitMessage, null);
    assert.equal(sliderCalculationPercent(100, 100), 100);
  }
});

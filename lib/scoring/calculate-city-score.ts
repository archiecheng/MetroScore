import type { RawMetricsInput, CityScore } from "./types";
import type { ReportPurpose } from "@/lib/reports/report-dto";

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** Clamps a value to [min, max] and rounds to nearest integer. */
export function clampScore(value: number, min = 1, max = 10): number {
  return Math.round(Math.max(min, Math.min(max, value)));
}

const FALLBACK = 5; // used when data is unavailable

// ---------------------------------------------------------------------------
// Individual dimension scorers
// All return a number in [1, 10].
// ---------------------------------------------------------------------------

/**
 * Affordability — based on price-to-income ratio (PTI).
 * PTI 3 → 10 (very affordable)
 * PTI 15 → 1 (very unaffordable)
 * Linear interpolation; clamped below at 1.
 */
export function scoreAffordability(pti: number | null): number {
  if (pti == null) return FALLBACK;
  // score = 10 - (PTI - 3) * 0.75
  return clampScore(10 - (pti - 3) * 0.75);
}

/**
 * Rent yield — based on (annual rent / home value).
 * 2% → 1, 8% → 10 (linear).
 */
export function scoreRentYield(rentYieldDecimal: number | null): number {
  if (rentYieldDecimal == null) return FALLBACK;
  // score = 1 + (yield - 0.02) * 150
  return clampScore(1 + (rentYieldDecimal - 0.02) * 150);
}

/**
 * Population momentum — based on annual % growth rate.
 * -2% → 1, 0% → ~4.6, 3% → 10 (linear).
 */
export function scorePopulationMomentum(popGrowthRate: number | null): number {
  if (popGrowthRate == null) return FALLBACK;
  // score = 1 + (rate + 2) * 1.8
  return clampScore(1 + (popGrowthRate + 2) * 1.8);
}

/**
 * Home price momentum — rewards moderate growth (0–8%), penalises decline
 * and speculative overheating.
 *
 * Zones:
 *   g < -10%:         score 1
 *   -10% to 0%:       1 → 5   (slope 0.4/%)
 *   0% to 8%:         5 → 10  (slope 0.625/%)
 *   8% to 22%:        10 → 6  (slope -0.286/%)
 *   > 22%:            score 3 (speculative overheating)
 */
export function scoreHomePriceMomentum(hpGrowthRate: number | null): number {
  if (hpGrowthRate == null) return FALLBACK;
  const g = hpGrowthRate;
  if (g > 22) return 3;
  if (g > 8) return clampScore(10 + (g - 8) * -0.286);
  if (g >= 0) return clampScore(5 + g * 0.625);
  return clampScore(5 + g * 0.4); // negative territory
}

/**
 * Job & income — weighted blend of income level (60%) and unemployment (40%).
 *
 * Income:       $45k → 1,  $150k → 10 (linear)
 * Unemployment: 12% → 1,   3% → 10  (linear)
 */
export function scoreJobIncome(
  medianIncome: number | null,
  unemploymentRate: number | null,
): number {
  const incomeScore =
    medianIncome != null
      ? clampScore(1 + ((medianIncome - 45_000) / 105_000) * 9)
      : FALLBACK;

  const unempScore =
    unemploymentRate != null
      ? clampScore(1 + (12 - unemploymentRate))
      : FALLBACK;

  return clampScore(incomeScore * 0.6 + unempScore * 0.4);
}

/**
 * Risk — higher score means higher risk (inverted from the others).
 *
 * Penalties (additive, base = 1):
 *   PTI > 5:                  +0.8 per unit above 5 (max +8)
 *   Population growth < 0:    +2 per negative % (max +4)
 *   Rent yield < 3%:          +(3 - yield_pct) * 0.5 (max +1.5)
 *   Home price growth > 22%:  +(growth - 22) * 0.1 (max +2)
 */
export function scoreRisk(inputs: RawMetricsInput): number {
  let risk = 1;

  if (inputs.pti != null && inputs.pti > 5) {
    risk += Math.min((inputs.pti - 5) * 0.8, 8);
  }

  if (inputs.popGrowthRate != null && inputs.popGrowthRate < 0) {
    risk += Math.min(Math.abs(inputs.popGrowthRate) * 2, 4);
  }

  const yieldPct =
    inputs.rentYieldDecimal != null ? inputs.rentYieldDecimal * 100 : null;
  if (yieldPct != null && yieldPct < 3) {
    risk += Math.min((3 - yieldPct) * 0.5, 1.5);
  }

  if (inputs.hpGrowthRate != null && inputs.hpGrowthRate > 22) {
    risk += Math.min((inputs.hpGrowthRate - 22) * 0.1, 2);
  }

  return clampScore(risk);
}

// ---------------------------------------------------------------------------
// Purpose-adjusted weights for the overall score
// ---------------------------------------------------------------------------

type Weights = Record<
  Exclude<keyof CityScore, "overall">,
  number
>;

const BASE_WEIGHTS: Weights = {
  affordability: 0.20,
  homePriceMomentum: 0.15,
  populationMomentum: 0.18,
  rentYield: 0.15,
  jobIncome: 0.20,
  risk: 0.12, // risk is inverted (safety) when computing overall
};

const PURPOSE_WEIGHTS: Record<ReportPurpose, Weights> = {
  move: {
    affordability: 0.25,
    homePriceMomentum: 0.10,
    populationMomentum: 0.20,
    rentYield: 0.05,
    jobIncome: 0.28,
    risk: 0.12,
  },
  primary_home: {
    affordability: 0.28,
    homePriceMomentum: 0.15,
    populationMomentum: 0.15,
    rentYield: 0.05,
    jobIncome: 0.25,
    risk: 0.12,
  },
  rental_investment: {
    affordability: 0.15,
    homePriceMomentum: 0.15,
    populationMomentum: 0.20,
    rentYield: 0.28,
    jobIncome: 0.10,
    risk: 0.12,
  },
  long_term_investment: {
    affordability: 0.18,
    homePriceMomentum: 0.18,
    populationMomentum: 0.22,
    rentYield: 0.15,
    jobIncome: 0.15,
    risk: 0.12,
  },
};

function weightedOverall(scores: Omit<CityScore, "overall">, w: Weights): number {
  const safety = 11 - scores.risk; // invert risk into safety
  return clampScore(
    scores.affordability * w.affordability +
      scores.homePriceMomentum * w.homePriceMomentum +
      scores.populationMomentum * w.populationMomentum +
      scores.rentYield * w.rentYield +
      scores.jobIncome * w.jobIncome +
      safety * w.risk,
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function calculateCityScore(
  inputs: RawMetricsInput,
  purpose: ReportPurpose = "long_term_investment",
): CityScore {
  const affordability = scoreAffordability(inputs.pti);
  const homePriceMomentum = scoreHomePriceMomentum(inputs.hpGrowthRate);
  const populationMomentum = scorePopulationMomentum(inputs.popGrowthRate);
  const rentYield = scoreRentYield(inputs.rentYieldDecimal);
  const jobIncome = scoreJobIncome(inputs.medianIncome, inputs.unemploymentRate);
  const risk = scoreRisk(inputs);

  const dim = { affordability, homePriceMomentum, populationMomentum, rentYield, jobIncome, risk };
  const weights = PURPOSE_WEIGHTS[purpose] ?? BASE_WEIGHTS;
  const overall = weightedOverall(dim, weights);

  return { overall, ...dim };
}

/** All score fields are integers 1–10; higher is better except `risk` (higher = riskier). */
export type CityScore = {
  overall: number;
  affordability: number;
  homePriceMomentum: number;
  populationMomentum: number;
  rentYield: number;
  jobIncome: number;
  /** Higher value = higher risk. Invert when displaying as "safety". */
  risk: number;
};

export type ScoreMetricKey = keyof CityScore;

export const SCORE_METRIC_LABELS: Record<ScoreMetricKey, string> = {
  overall: "Overall Score",
  affordability: "Affordability",
  homePriceMomentum: "Home Price Momentum",
  populationMomentum: "Population Momentum",
  rentYield: "Rent Yield",
  jobIncome: "Job & Income",
  risk: "Risk",
};

export const SCORE_MIN = 1;
export const SCORE_MAX = 10;

/**
 * Normalized inputs derived from raw CityMetric fields.
 * All nulls mean data is unavailable for that metric.
 */
export type RawMetricsInput = {
  /** medianHomeValue / medianHouseholdIncome */
  pti: number | null;
  /** (medianRent * 12) / medianHomeValue  — expressed as a decimal, e.g. 0.04 = 4% */
  rentYieldDecimal: number | null;
  /** populationGrowthRate in % per year, e.g. 2.5 */
  popGrowthRate: number | null;
  /** homePriceGrowthRate in % per year */
  hpGrowthRate: number | null;
  /** Raw medianHouseholdIncome in USD */
  medianIncome: number | null;
  /** Raw unemploymentRate in % */
  unemploymentRate: number | null;
  /** Raw medianHomeValue in USD */
  medianHomeValue: number | null;
  /** Raw medianRent in USD/month */
  medianRent: number | null;
};

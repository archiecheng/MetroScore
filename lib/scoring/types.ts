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

/** Human-readable labels for each score metric, used by charts and report UI. */
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

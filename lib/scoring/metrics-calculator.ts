import type { CityMetric } from "@prisma/client";
import type { RawMetricsInput } from "./types";

/**
 * Derives the normalized scoring inputs from a raw CityMetric row.
 * All fields are null-safe — missing data yields null, not a crash.
 */
export function extractScoringInputs(metric: CityMetric | null): RawMetricsInput {
  if (!metric) {
    return {
      pti: null,
      rentYieldDecimal: null,
      popGrowthRate: null,
      hpGrowthRate: null,
      medianIncome: null,
      unemploymentRate: null,
      medianHomeValue: null,
      medianRent: null,
    };
  }

  const { medianHomeValue, medianHouseholdIncome, medianRent } = metric;

  const pti =
    medianHomeValue != null && medianHouseholdIncome != null && medianHouseholdIncome > 0
      ? medianHomeValue / medianHouseholdIncome
      : null;

  const rentYieldDecimal =
    medianRent != null && medianHomeValue != null && medianHomeValue > 0
      ? (medianRent * 12) / medianHomeValue
      : null;

  return {
    pti,
    rentYieldDecimal,
    popGrowthRate: metric.populationGrowthRate,
    hpGrowthRate: metric.homePriceGrowthRate,
    medianIncome: medianHouseholdIncome,
    unemploymentRate: metric.unemploymentRate,
    medianHomeValue,
    medianRent,
  };
}

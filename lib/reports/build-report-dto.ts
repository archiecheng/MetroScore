import type { CityMetric } from "@prisma/client";
import { getCityById } from "@/lib/data/cities";
import { getMetricsByCityId } from "@/lib/data/metrics";
import { extractScoringInputs } from "@/lib/scoring/metrics-calculator";
import { calculateCityScore } from "@/lib/scoring/calculate-city-score";
import { generateComparison, generateOpportunities } from "@/lib/scoring/compare-generator";
import { analyzeRisks } from "@/lib/scoring/risk-analyzer";
import { buildSources } from "./source-builder";
import type {
  CityComparisonReportDTO,
  CitySummary,
  RadarChartPoint,
  TrendChartPoint,
  ReportPurpose,
} from "./report-dto";

// ---------------------------------------------------------------------------
// Chart helpers
// ---------------------------------------------------------------------------

function buildRadarPoints(
  scoreA: ReturnType<typeof calculateCityScore>,
  scoreB: ReturnType<typeof calculateCityScore>,
): RadarChartPoint[] {
  return [
    { metric: "Affordability", cityA: scoreA.affordability, cityB: scoreB.affordability },
    { metric: "Home Price Growth", cityA: scoreA.homePriceMomentum, cityB: scoreB.homePriceMomentum },
    { metric: "Population Growth", cityA: scoreA.populationMomentum, cityB: scoreB.populationMomentum },
    { metric: "Rent Yield", cityA: scoreA.rentYield, cityB: scoreB.rentYield },
    { metric: "Job & Income", cityA: scoreA.jobIncome, cityB: scoreB.jobIncome },
    // Invert risk → safety so all radar axes point "outward = better"
    { metric: "Safety", cityA: 11 - scoreA.risk, cityB: 11 - scoreB.risk },
  ];
}

/**
 * Aligns two metric arrays by year and extracts a numeric field for trend charts.
 * Values are divided by `divisor` (e.g. 1000 for $k).
 */
function buildTrendPoints(
  metricsA: CityMetric[],
  metricsB: CityMetric[],
  field: "medianHomeValue" | "population",
  divisor = 1,
): TrendChartPoint[] {
  const byYearB = new Map(metricsB.map((m) => [m.year, m]));

  return metricsA
    .filter((mA) => byYearB.has(mA.year))
    .map((mA) => {
      const mB = byYearB.get(mA.year)!;
      const rawA = mA[field] ?? 0;
      const rawB = mB[field] ?? 0;
      return {
        year: mA.year,
        cityA: Math.round(rawA / divisor),
        cityB: Math.round(rawB / divisor),
      };
    });
}

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

export class CityNotFoundError extends Error {
  constructor(cityId: string) {
    super(`City not found: ${cityId}`);
    this.name = "CityNotFoundError";
  }
}

export class MetricsNotFoundError extends Error {
  constructor(cityId: string) {
    super(`No metrics found for city: ${cityId}`);
    this.name = "MetricsNotFoundError";
  }
}

export async function buildReportDto(
  cityAId: string,
  cityBId: string,
  purpose: ReportPurpose,
  reportId?: string,
): Promise<CityComparisonReportDTO> {
  // 1. Load city records
  const [cityA, cityB] = await Promise.all([getCityById(cityAId), getCityById(cityBId)]);
  if (!cityA) throw new CityNotFoundError(cityAId);
  if (!cityB) throw new CityNotFoundError(cityBId);

  // 2. Load all metric rows (for trend charts) and derive latest row
  const [metricsA, metricsB] = await Promise.all([
    getMetricsByCityId(cityAId),
    getMetricsByCityId(cityBId),
  ]);

  const latestA = metricsA.at(-1) ?? null;
  const latestB = metricsB.at(-1) ?? null;

  // 3. Scoring
  const inputsA = extractScoringInputs(latestA);
  const inputsB = extractScoringInputs(latestB);
  const scoreA = calculateCityScore(inputsA, purpose);
  const scoreB = calculateCityScore(inputsB, purpose);

  // 4. CitySummary shapes
  const summaryA: CitySummary = {
    id: cityA.id,
    slug: cityA.slug,
    name: cityA.name,
    state: cityA.state,
    metroName: cityA.metroName ?? undefined,
    county: cityA.county ?? undefined,
  };
  const summaryB: CitySummary = {
    id: cityB.id,
    slug: cityB.slug,
    name: cityB.name,
    state: cityB.state,
    metroName: cityB.metroName ?? undefined,
    county: cityB.county ?? undefined,
  };

  // 5. Recommendation
  const recommendation = generateComparison(
    summaryA, summaryB, scoreA, scoreB, inputsA, inputsB, purpose,
  );

  // 6. Risk alerts
  const risksA = analyzeRisks(inputsA, summaryA, "cityA");
  const risksB = analyzeRisks(inputsB, summaryB, "cityB");
  const severityOrder = { high: 3, medium: 2, low: 1 };
  const risks = [...risksA, ...risksB].sort(
    (a, b) => severityOrder[b.severity] - severityOrder[a.severity],
  );

  // 7. Charts
  const radar = buildRadarPoints(scoreA, scoreB);
  // Home price in $thousands; population in thousands
  const homePriceTrend = buildTrendPoints(metricsA, metricsB, "medianHomeValue", 1000);
  const populationTrend = buildTrendPoints(metricsA, metricsB, "population", 1000);

  // 8. Opportunities
  const opportunities = generateOpportunities(
    summaryA, summaryB, scoreA, scoreB, inputsA, inputsB,
  );

  // 9. Sources
  const sources = buildSources([latestA, latestB]);

  return {
    reportId: reportId ?? `report-${cityAId}-${cityBId}`,
    purpose,
    cityA: summaryA,
    cityB: summaryB,
    scores: { cityA: scoreA, cityB: scoreB },
    recommendation,
    charts: { radar, homePriceTrend, populationTrend },
    risks,
    opportunities,
    sources,
    generatedAt: new Date().toISOString(),
  };
}

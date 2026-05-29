import type { CityMetric } from "@prisma/client";
import type { DataSource } from "./report-dto";

const STANDARD_SOURCES: DataSource[] = [
  {
    metric: "Median Home Value",
    sourceName: "Zillow Research / U.S. Census Bureau ACS",
    year: 2024,
  },
  {
    metric: "Median Household Income",
    sourceName: "U.S. Census Bureau — American Community Survey (ACS 5-Year)",
    year: 2023,
  },
  {
    metric: "Unemployment Rate",
    sourceName: "Bureau of Labor Statistics (BLS) — LAUS",
    year: 2024,
  },
  {
    metric: "Population Estimates",
    sourceName: "U.S. Census Bureau — Population Estimates Program",
    year: 2024,
  },
  {
    metric: "Median Rent",
    sourceName: "Apartment List Rent Report / HUD Fair Market Rents",
    year: 2024,
    note: "Based on median 1BR asking rents",
  },
  {
    metric: "Natural Hazard & Risk",
    sourceName: "FEMA National Risk Index",
    year: 2023,
  },
];

/**
 * Builds the DataSource[] for a report.
 * If the metric rows have a custom sourceName, that takes precedence.
 */
export function buildSources(metrics: Array<CityMetric | null>): DataSource[] {
  const customSources: DataSource[] = [];

  for (const m of metrics) {
    if (!m?.sourceName) continue;
    // Avoid duplicates
    if (customSources.some((s) => s.sourceName === m.sourceName)) continue;
    customSources.push({
      metric: "All Metrics",
      sourceName: m.sourceName,
      sourceUrl: m.sourceUrl ?? undefined,
      year: m.year,
    });
  }

  // If metrics have a custom source (e.g. "Demo Data"), show that first.
  // Otherwise fall back to the standard source list.
  const hasCustom = customSources.length > 0;
  const custom = hasCustom ? customSources : [];
  const standard = hasCustom ? [] : STANDARD_SOURCES;

  return [...custom, ...standard];
}

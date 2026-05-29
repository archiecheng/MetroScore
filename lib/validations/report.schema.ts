import { z } from "zod";
import { SCORE_MIN, SCORE_MAX } from "@/lib/scoring/types";

const score = () => z.number().int().min(SCORE_MIN).max(SCORE_MAX);

export const cityScoreSchema = z.object({
  overall: score(),
  affordability: score(),
  homePriceMomentum: score(),
  populationMomentum: score(),
  rentYield: score(),
  jobIncome: score(),
  risk: score(),
});

export const reportPurposeSchema = z.enum([
  "move",
  "primary_home",
  "rental_investment",
  "long_term_investment",
]);

export const citySummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  state: z.string().length(2),
  metroName: z.string().optional(),
  county: z.string().optional(),
});

export const recommendationSchema = z.object({
  winner: z.enum(["cityA", "cityB", "mixed"]),
  summary: z.string(),
  keyTakeaways: z.array(z.string()),
});

export const radarChartPointSchema = z.object({
  metric: z.string(),
  cityA: z.number(),
  cityB: z.number(),
});

export const trendChartPointSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  cityA: z.number(),
  cityB: z.number(),
});

export const riskAlertSchema = z.object({
  title: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  city: z.enum(["cityA", "cityB", "both"]),
  explanation: z.string(),
});

export const opportunitySchema = z.object({
  title: z.string(),
  city: z.enum(["cityA", "cityB"]),
  explanation: z.string(),
});

export const dataSourceSchema = z.object({
  metric: z.string(),
  sourceName: z.string(),
  sourceUrl: z.string().url().optional(),
  year: z.number().int().optional(),
  note: z.string().optional(),
});

export const reportChartsSchema = z.object({
  radar: z.array(radarChartPointSchema),
  homePriceTrend: z.array(trendChartPointSchema),
  populationTrend: z.array(trendChartPointSchema),
});

export const cityComparisonReportSchema = z.object({
  reportId: z.string(),
  purpose: reportPurposeSchema,
  cityA: citySummarySchema,
  cityB: citySummarySchema,
  scores: z.object({
    cityA: cityScoreSchema,
    cityB: cityScoreSchema,
  }),
  recommendation: recommendationSchema,
  charts: reportChartsSchema,
  risks: z.array(riskAlertSchema),
  opportunities: z.array(opportunitySchema),
  sources: z.array(dataSourceSchema),
  generatedAt: z.string().datetime(),
});

// Inferred types from Zod — use these when parsing untrusted input (API responses, webhooks).
// For internal code that constructs DTOs directly, prefer the TypeScript types in report-dto.ts.
export type CityScoreSchema = z.infer<typeof cityScoreSchema>;
export type CityComparisonReportSchema = z.infer<typeof cityComparisonReportSchema>;

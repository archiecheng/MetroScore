import type { CityScore } from "@/lib/scoring/types";

export type ReportPurpose =
  | "move"
  | "primary_home"
  | "rental_investment"
  | "long_term_investment";

export type CitySummary = {
  id: string;
  slug: string;
  name: string;
  state: string;
  metroName?: string;
  county?: string;
};

export type Recommendation = {
  winner: "cityA" | "cityB" | "mixed";
  summary: string;
  keyTakeaways: string[];
};

export type RadarChartPoint = {
  metric: string;
  cityA: number;
  cityB: number;
};

export type TrendChartPoint = {
  year: number;
  cityA: number;
  cityB: number;
};

export type RiskAlert = {
  title: string;
  severity: "low" | "medium" | "high";
  city: "cityA" | "cityB" | "both";
  explanation: string;
};

export type Opportunity = {
  title: string;
  city: "cityA" | "cityB";
  explanation: string;
};

export type DataSource = {
  metric: string;
  sourceName: string;
  sourceUrl?: string;
  year?: number;
  note?: string;
};

export type ReportCharts = {
  radar: RadarChartPoint[];
  homePriceTrend: TrendChartPoint[];
  populationTrend: TrendChartPoint[];
};

/**
 * The canonical shape of a MetroScore report delivered to clients.
 * No DB-specific fields (no Prisma IDs, no internal status).
 */
export type CityComparisonReportDTO = {
  reportId: string;
  purpose: ReportPurpose;
  cityA: CitySummary;
  cityB: CitySummary;
  scores: {
    cityA: CityScore;
    cityB: CityScore;
  };
  recommendation: Recommendation;
  charts: ReportCharts;
  risks: RiskAlert[];
  opportunities: Opportunity[];
  sources: DataSource[];
  generatedAt: string; // ISO 8601
};

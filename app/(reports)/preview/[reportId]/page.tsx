import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getLatestMetrics } from "@/lib/data/metrics";
import { extractScoringInputs } from "@/lib/scoring/metrics-calculator";
import { calculateCityScore } from "@/lib/scoring/calculate-city-score";
import type { CityScore } from "@/lib/scoring/types";
import type { ReportPurpose } from "@/lib/reports/report-dto";
import CheckoutButton from "@/components/reports/checkout-button";

export const metadata: Metadata = {
  title: "Report Preview",
  description: "Preview your MetroScore city comparison report.",
};

export default async function PreviewReportPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: {
      purpose: true,
      cityA: { select: { id: true, name: true, state: true } },
      cityB: { select: { id: true, name: true, state: true } },
    },
  });

  if (!report) notFound();

  const nameA = `${report.cityA.name}, ${report.cityA.state}`;
  const nameB = `${report.cityB.name}, ${report.cityB.state}`;

  // Compute real scores so the preview reflects the user's actual cities.
  const [latestA, latestB] = await Promise.all([
    getLatestMetrics(report.cityA.id),
    getLatestMetrics(report.cityB.id),
  ]);
  const purpose = report.purpose as ReportPurpose;
  const scoreA = calculateCityScore(extractScoringInputs(latestA), purpose);
  const scoreB = calculateCityScore(extractScoringInputs(latestB), purpose);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary tracking-tight">
            MetroScore
          </Link>
        </div>
      </header>

      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Preview — Purchase to unlock full report
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {nameA} vs {nameB}
            </h1>
            <p className="text-muted-foreground">Report ID: {reportId}</p>
          </div>

          <ReportPreviewContent nameA={nameA} nameB={nameB} scoreA={scoreA} scoreB={scoreB} />

          <div className="mt-12 bg-primary rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-primary-foreground mb-3">
              Unlock the Full Report
            </h2>
            <p className="text-primary-foreground/80 mb-6">
              Get all 6 scoring dimensions, full data tables, charts, and a downloadable PDF.
            </p>
            <CheckoutButton reportId={reportId} />
          </div>
        </div>
      </main>
    </div>
  );
}

const PREVIEW_ROWS: { label: string; key: keyof Omit<CityScore, "overall"> }[] = [
  { label: "Housing Affordability", key: "affordability" },
  { label: "Job & Income",          key: "jobIncome" },
  { label: "Population Growth",     key: "populationMomentum" },
];

function ReportPreviewContent({
  nameA,
  nameB,
  scoreA,
  scoreB,
}: {
  nameA: string;
  nameB: string;
  scoreA: CityScore;
  scoreB: CityScore;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ScoreCard city={nameA} score={scoreA.overall} />
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-muted-foreground">vs</span>
        </div>
        <ScoreCard city={nameB} score={scoreB.overall} />
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold text-foreground mb-4">Score Overview</h2>
        <div className="space-y-3">
          {PREVIEW_ROWS.map((row) => (
            <div key={row.key} className="grid grid-cols-3 items-center gap-4">
              <div className="text-right text-sm font-medium">{scoreA[row.key]}</div>
              <div className="text-center text-xs text-muted-foreground">{row.label}</div>
              <div className="text-left text-sm font-medium">{scoreB[row.key]}</div>
            </div>
          ))}
          <div className="border-t border-border pt-3 text-center text-sm text-muted-foreground italic">
            3 more dimensions locked — purchase to unlock
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ city, score }: { city: string; score: number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center">
      <p className="font-semibold text-foreground mb-1">{city}</p>
      <div className="text-5xl font-bold text-primary my-3">{score}</div>
      <p className="text-xs text-muted-foreground">MetroScore / 100</p>
    </div>
  );
}

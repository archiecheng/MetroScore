import type { Metadata } from "next";
import Link from "next/link";
import { mockReport } from "@/lib/reports/mock-report";
import { SCORE_METRIC_LABELS } from "@/lib/scoring/types";
import ReportHeader from "@/components/reports/report-header";
import ScoreCard from "@/components/reports/score-card";
import ReportRadarChart from "@/components/reports/radar-chart";
import TrendChart from "@/components/reports/trend-chart";
import RiskAlerts from "@/components/reports/risk-alerts";
import OpportunitySection from "@/components/reports/opportunity-section";
import SourceAttribution from "@/components/reports/source-attribution";
import Disclaimer from "@/components/reports/disclaimer";
import PrintButton from "@/components/reports/print-button";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { ANALYTICS_EVENTS } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Sample Report: San Jose, CA vs Colorado Springs, CO",
  description:
    "See a full MetroScore city comparison report — scores, charts, risk alerts, and recommendations.",
};

export default async function ViewReportPage() {
  const report = mockReport;
  const { cityA, cityB, scores, recommendation, charts, risks, opportunities, sources } = report;
  const nameA = cityA.name;
  const nameB = cityB.name;

  const scoreMetrics: Array<{ key: keyof typeof scores.cityA; isRisk?: boolean }> = [
    { key: "affordability" },
    { key: "homePriceMomentum" },
    { key: "populationMomentum" },
    { key: "rentYield" },
    { key: "jobIncome" },
    { key: "risk", isRisk: true },
  ];

  const winnerName =
    recommendation.winner === "cityA"
      ? `${nameA}, ${cityA.state}`
      : recommendation.winner === "cityB"
        ? `${nameB}, ${cityB.state}`
        : "Mixed — context-dependent";

  return (
    <div className="flex flex-col min-h-screen bg-background print:bg-white">
      {/* Sticky nav — hidden in print */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-primary tracking-tight">
            MetroScore
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/compare"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Get Your Report
            </Link>
            <PrintButton />
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6">
        <PageViewTracker
          event={ANALYTICS_EVENTS.REPORT_ACCESSED}
          properties={{ report_id: report.reportId, purpose: report.purpose }}
        />
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header: title, overall scores, purpose, date */}
          <ReportHeader
            cityA={cityA}
            cityB={cityB}
            purpose={report.purpose}
            generatedAt={report.generatedAt}
            overallA={scores.cityA.overall}
            overallB={scores.cityB.overall}
          />

          <Divider />

          {/* Recommendation */}
          <section>
            <h2 className="text-base font-semibold text-foreground mb-4">Recommendation</h2>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Recommended for {report.purpose.replace(/_/g, " ")}
                </span>
                <WinnerBadge winner={recommendation.winner} name={winnerName} />
              </div>
              <p className="text-sm text-foreground leading-relaxed">{recommendation.summary}</p>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Key Takeaways
                </p>
                <ul className="space-y-2">
                  {recommendation.keyTakeaways.map((t, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5 flex-shrink-0">→</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <Divider />

          {/* Score cards grid */}
          <section>
            <h2 className="text-base font-semibold text-foreground mb-4">Score Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {scoreMetrics.map(({ key, isRisk }) => (
                <ScoreCard
                  key={key}
                  metric={SCORE_METRIC_LABELS[key]}
                  cityAName={nameA}
                  cityBName={nameB}
                  scoreA={scores.cityA[key]}
                  scoreB={scores.cityB[key]}
                  isRisk={isRisk}
                />
              ))}
            </div>
          </section>

          <Divider />

          {/* Charts */}
          <section className="space-y-6">
            <h2 className="text-base font-semibold text-foreground">Charts</h2>
            <ReportRadarChart data={charts.radar} cityAName={nameA} cityBName={nameB} />
            <TrendChart
              data={charts.homePriceTrend}
              title="Median Home Price Trend"
              cityAName={nameA}
              cityBName={nameB}
              format="price"
            />
            <TrendChart
              data={charts.populationTrend}
              title="Population Trend (thousands)"
              cityAName={nameA}
              cityBName={nameB}
              format="population"
            />
          </section>

          <Divider />

          <RiskAlerts risks={risks} cityAName={nameA} cityBName={nameB} />

          <Divider />

          <OpportunitySection opportunities={opportunities} cityAName={nameA} cityBName={nameB} />

          <Divider />

          <SourceAttribution sources={sources} />

          <Disclaimer />
        </div>
      </main>

      <footer className="border-t border-border py-6 px-6 text-center text-xs text-muted-foreground print:hidden">
        © {new Date().getFullYear()} MetroScore. All rights reserved. ·{" "}
        <Link href="/compare" className="hover:text-foreground transition-colors">
          Get a Report
        </Link>
      </footer>
    </div>
  );
}

function Divider() {
  return <hr className="border-border" />;
}

function WinnerBadge({ winner, name }: { winner: string; name: string }) {
  if (winner === "mixed") {
    return (
      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border">
        {name}
      </span>
    );
  }
  const isA = winner === "cityA";
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${
        isA
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-amber-50 text-amber-700 border-amber-200"
      }`}
    >
      ✓ {name}
    </span>
  );
}

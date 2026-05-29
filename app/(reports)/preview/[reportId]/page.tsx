import type { Metadata } from "next";
import Link from "next/link";

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
              Austin, TX vs Nashville, TN
            </h1>
            <p className="text-muted-foreground">Report ID: {reportId}</p>
          </div>

          <ReportPreviewContent />

          <div className="mt-12 bg-primary rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-primary-foreground mb-3">
              Unlock the Full Report
            </h2>
            <p className="text-primary-foreground/80 mb-6">
              Get all 6 scoring dimensions, full data tables, charts, and a downloadable PDF.
            </p>
            <Link
              href="/compare"
              className="inline-block bg-white text-primary px-8 py-3.5 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Purchase Full Report — $19
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function ReportPreviewContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ScoreCard city="Austin, TX" score={74} />
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-muted-foreground">vs</span>
        </div>
        <ScoreCard city="Nashville, TN" score={71} />
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold text-foreground mb-4">Score Overview</h2>
        <div className="space-y-3">
          {[
            { label: "Housing Affordability", a: 58, b: 65 },
            { label: "Income & Rent", a: 72, b: 68 },
            { label: "Population Growth", a: 85, b: 80 },
          ].map((row) => (
            <div key={row.label} className="grid grid-cols-3 items-center gap-4">
              <div className="text-right text-sm font-medium">{row.a}</div>
              <div className="text-center text-xs text-muted-foreground">{row.label}</div>
              <div className="text-left text-sm font-medium">{row.b}</div>
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

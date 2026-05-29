import Link from "next/link";

// Hardcoded from mock report — keeps this a pure Server Component with no Recharts dependency
const SAMPLE = {
  cityA: { name: "San Jose", state: "CA", overall: 5 },
  cityB: { name: "Colorado Springs", state: "CO", overall: 7 },
  winner: "Colorado Springs, CO",
  scores: [
    { label: "Affordability", a: 2, b: 7 },
    { label: "Population Momentum", a: 3, b: 8 },
    { label: "Job & Income", a: 9, b: 6 },
    { label: "Rent Yield", a: 6, b: 7 },
  ],
};

export default function SampleShowcase() {
  return (
    <section className="bg-background py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            See What You&apos;ll Get
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Here&apos;s a preview of the San Jose, CA vs Colorado Springs, CO report.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          {/* Demo label */}
          <div className="bg-amber-50 border-b border-amber-100 px-5 py-2.5 flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
              ★ Sample Report — Demo Data
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-7">
            {/* City header */}
            <div className="grid grid-cols-3 gap-4">
              <OverallCard
                name={SAMPLE.cityA.name}
                state={SAMPLE.cityA.state}
                score={SAMPLE.cityA.overall}
                color="text-blue-600"
                bg="bg-blue-50 border-blue-100"
              />
              <div className="flex items-center justify-center">
                <span className="text-lg font-bold text-muted-foreground/40">vs</span>
              </div>
              <OverallCard
                name={SAMPLE.cityB.name}
                state={SAMPLE.cityB.state}
                score={SAMPLE.cityB.overall}
                color="text-amber-600"
                bg="bg-amber-50 border-amber-100"
              />
            </div>

            {/* Score bars */}
            <div className="space-y-4">
              {SAMPLE.scores.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {s.label}
                    </span>
                    <div className="flex gap-4 text-xs font-bold tabular-nums">
                      <span className="text-blue-600">{s.a}/10</span>
                      <span className="text-amber-600">{s.b}/10</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${(s.a / 10) * 100}%` }}
                      />
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${(s.b / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Winner callout */}
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                  Recommended for Long-Term Investment
                </p>
                <p className="font-semibold text-sm text-foreground">
                  ✓ {SAMPLE.winner}
                </p>
              </div>
              <Link
                href="/view"
                className="flex-shrink-0 text-xs font-semibold text-primary hover:underline whitespace-nowrap"
              >
                View full report →
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Sample data for illustration. Real reports use live U.S. city datasets.
        </p>
      </div>
    </section>
  );
}

function OverallCard({
  name,
  state,
  score,
  color,
  bg,
}: {
  name: string;
  state: string;
  score: number;
  color: string;
  bg: string;
}) {
  return (
    <div className={`rounded-xl border p-4 text-center ${bg}`}>
      <p className="text-xs font-semibold text-foreground truncate">
        {name}, {state}
      </p>
      <div className={`text-3xl sm:text-4xl font-bold my-2 tabular-nums ${color}`}>{score}</div>
      <p className="text-xs text-muted-foreground">/ 10</p>
    </div>
  );
}

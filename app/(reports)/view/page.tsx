import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "View Report",
  description: "Your full MetroScore city comparison report.",
};

export default async function ViewReportPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <AccessDenied />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary tracking-tight">
            MetroScore
          </Link>
          <button className="border border-border px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            Download PDF
          </button>
        </div>
      </header>

      <main className="flex-1 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 text-sm font-medium px-3 py-1 rounded-full mb-4">
              ✓ Full Report Unlocked
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Austin, TX vs Nashville, TN
            </h1>
            <p className="text-muted-foreground text-sm">
              Generated on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <FullReportContent />
        </div>
      </main>

      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} MetroScore. All rights reserved.
      </footer>
    </div>
  );
}

function FullReportContent() {
  const dimensions = [
    { label: "Housing Affordability", a: 58, b: 65, description: "Price-to-income ratio, median home prices, market trends" },
    { label: "Income & Rent", a: 72, b: 68, description: "Median household income, rent burden, wage growth" },
    { label: "Population Growth", a: 85, b: 80, description: "Annual growth rate, migration, demographic trends" },
    { label: "Job Market", a: 78, b: 74, description: "Unemployment rate, industry diversity, job growth" },
    { label: "Climate Risk", a: 55, b: 62, description: "Flood, wildfire, extreme heat risk indicators" },
    { label: "Quality of Life", a: 70, b: 73, description: "Cost of living, commute times, amenity access" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="font-semibold text-foreground mb-1">Austin, TX</p>
          <div className="text-5xl font-bold text-primary my-3">74</div>
          <p className="text-xs text-muted-foreground">MetroScore / 100</p>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-muted-foreground">vs</span>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="font-semibold text-foreground mb-1">Nashville, TN</p>
          <div className="text-5xl font-bold text-primary my-3">71</div>
          <p className="text-xs text-muted-foreground">MetroScore / 100</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold text-foreground mb-6">Scoring Breakdown</h2>
        <div className="space-y-5">
          {dimensions.map((d) => (
            <div key={d.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground">{d.label}</span>
                <div className="flex gap-6 text-sm font-semibold">
                  <span className="text-primary">AUS {d.a}</span>
                  <span className="text-muted-foreground">NAS {d.b}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{d.description}</p>
              <div className="flex gap-2 h-2">
                <div className="flex-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${d.a}%` }}
                  />
                </div>
                <div className="flex-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-muted-foreground/40 rounded-full"
                    style={{ width: `${d.b}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-secondary/40 border border-border rounded-xl p-6">
        <h2 className="font-semibold text-foreground mb-3">Summary</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          <strong className="text-foreground">Austin, TX</strong> leads with a MetroScore of 74,
          driven by strong population growth and job market performance. However, housing
          affordability remains a concern. <strong className="text-foreground">Nashville, TN</strong>{" "}
          scores 71, with better climate risk scores and competitive housing relative to income.
          Both cities are strong candidates for relocation or investment.
        </p>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <main className="flex-1 flex items-center justify-center py-24 px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-foreground mb-3">Access Required</h1>
        <p className="text-muted-foreground mb-6">
          This report requires a valid access link. Check your email for the report link, or
          purchase a new report.
        </p>
        <Link
          href="/compare"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
        >
          Get a New Report
        </Link>
      </div>
    </main>
  );
}

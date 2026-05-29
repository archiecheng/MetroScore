import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "One $19 report. No subscription. No hidden fees.",
};

const included = [
  "Side-by-side city overview",
  "Housing market analysis (prices, trends, affordability)",
  "Income & rent comparison",
  "Population & migration data",
  "Climate & economic risk indicators",
  "Composite MetroScore rating (0–100)",
  "Interactive charts & visualizations",
  "Downloadable PDF report",
  "Instant delivery after payment",
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary tracking-tight">
            MetroScore
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/pricing" className="text-foreground font-semibold">Pricing</Link>
            <Link
              href="/compare"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Compare Cities
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-24 px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Simple, Honest Pricing</h1>
          <p className="text-muted-foreground text-lg">
            Pay once for a full city comparison report. No subscription. No surprises.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-primary px-8 py-8 text-center">
              <p className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wider mb-2">
                City Comparison Report
              </p>
              <div className="flex items-end justify-center gap-1">
                <span className="text-5xl font-bold text-primary-foreground">$19</span>
                <span className="text-primary-foreground/70 pb-2">one-time</span>
              </div>
            </div>

            <div className="px-8 py-8">
              <ul className="space-y-3 mb-8">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span className="text-primary mt-0.5 shrink-0">✓</span>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/compare"
                className="block w-full bg-primary text-primary-foreground text-center py-3.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Get Your Report — $19
              </Link>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Secure checkout powered by Stripe. Instant delivery.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-secondary/40 border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-2">Frequently Asked Questions</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-foreground">What cities are covered?</p>
                <p className="text-muted-foreground mt-1">
                  Any two U.S. cities with available Census and market data — covering all 50 states.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">How current is the data?</p>
                <p className="text-muted-foreground mt-1">
                  We use the most recent publicly available data from Census Bureau, BLS, and market sources.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">Can I get a refund?</p>
                <p className="text-muted-foreground mt-1">
                  Reports are delivered instantly and are non-refundable. Contact us if you have an issue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} MetroScore. All rights reserved.
      </footer>
    </div>
  );
}

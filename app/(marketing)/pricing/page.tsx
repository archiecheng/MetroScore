import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "One $19 report. No subscription. No hidden fees.",
};

const INCLUDED = [
  "Side-by-side city overview with key stats",
  "Housing market analysis — prices, trends, affordability score",
  "Income & rent comparison",
  "Population & migration data (5-year trend)",
  "Climate & economic risk indicators",
  "Overall MetroScore rating (1–10 per dimension)",
  "Interactive radar chart & trend charts",
  "Risk alerts & investment opportunity highlights",
  "Data source attribution",
  "Printable / PDF-ready view",
  "Instant delivery after payment",
];

const FAQS = [
  {
    q: "What cities are covered?",
    a: "Any two U.S. cities with available Census and market data. We cover all 50 states — major metros and mid-size cities included.",
  },
  {
    q: "How current is the data?",
    a: "We use the most recent publicly available data from the U.S. Census Bureau, Bureau of Labor Statistics, Zillow Research, and FEMA.",
  },
  {
    q: "Can I get a refund?",
    a: "Reports are delivered instantly and are non-refundable. Contact us at support@metroscore.com if you encounter an issue.",
  },
  {
    q: "Is this financial advice?",
    a: "No. MetroScore provides data-based educational analysis. Always consult a licensed financial or real estate professional before making investment decisions.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-primary tracking-tight">
            MetroScore
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <span className="text-foreground font-semibold hidden sm:block">Pricing</span>
            <Link
              href="/compare"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Compare Cities
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-16 sm:py-24 px-4 sm:px-6">
        {/* Heading */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Simple, Honest Pricing
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Pay once for a full city comparison report. No subscription. No surprises.
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          {/* Pricing card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-primary px-8 py-8 text-center">
              <p className="text-primary-foreground/70 text-xs font-semibold uppercase tracking-widest mb-3">
                City Comparison Report
              </p>
              <div className="flex items-end justify-center gap-1.5">
                <span className="text-5xl font-bold text-primary-foreground">$19</span>
                <span className="text-primary-foreground/60 pb-1.5 text-sm">one-time</span>
              </div>
              <p className="text-primary-foreground/70 text-xs mt-2">
                No subscription · Instant delivery
              </p>
            </div>

            <div className="px-8 py-8">
              <ul className="space-y-2.5 mb-8">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span className="text-green-500 mt-0.5 flex-shrink-0 font-bold">✓</span>
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

              <p className="text-center text-xs text-muted-foreground mt-3">
                Secure checkout powered by Stripe.
              </p>
            </div>
          </div>

          {/* Sample report nudge */}
          <div className="rounded-xl border border-border bg-secondary/40 px-6 py-4 text-center">
            <p className="text-sm text-muted-foreground">
              Want to see the report before buying?{" "}
              <Link href="/view" className="text-primary font-medium hover:underline">
                View the sample report →
              </Link>
            </p>
          </div>

          {/* FAQ */}
          <div className="rounded-xl border border-border bg-card px-6 py-6">
            <h3 className="font-semibold text-foreground mb-5">Frequently Asked Questions</h3>
            <div className="space-y-5">
              {FAQS.map((faq) => (
                <div key={faq.q}>
                  <p className="font-medium text-sm text-foreground">{faq.q}</p>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MetroScore. All rights reserved. · For educational use only.
        Not financial advice.
      </footer>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compare Cities",
  description: "Pick two U.S. cities and get your MetroScore comparison report.",
};

export default function ComparePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary tracking-tight">
            MetroScore
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-24 px-6">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-3">Compare Two Cities</h1>
            <p className="text-muted-foreground">
              Enter any two U.S. cities to generate your comparison report.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <CityCompareForm />
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            One-time payment of $19. Instant delivery. Secure checkout via Stripe.
          </p>
        </div>
      </main>
    </div>
  );
}

function CityCompareForm() {
  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="city1"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            City 1
          </label>
          <input
            id="city1"
            type="text"
            placeholder="e.g. Austin, TX"
            className="w-full border border-input rounded-lg px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">vs</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div>
          <label
            htmlFor="city2"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            City 2
          </label>
          <input
            id="city2"
            type="text"
            placeholder="e.g. Nashville, TN"
            className="w-full border border-input rounded-lg px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="w-full border border-input rounded-lg px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          We&apos;ll send your report here after payment.
        </p>
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
      >
        Continue to Checkout — $19
      </button>
    </form>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compare U.S. Cities Before You Move, Buy, or Invest",
  description:
    "MetroScore turns housing, population, income, rent, and risk data into a clear city comparison report.",
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary tracking-tight">
          MetroScore
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link
            href="/compare"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Compare Cities
          </Link>
        </nav>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="bg-background py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-6">
          Data-driven city analysis
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-foreground leading-tight mb-6">
          Compare U.S. Cities Before You{" "}
          <span className="text-primary">Move, Buy, or Invest</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          MetroScore turns housing, population, income, rent, and risk data into
          a clear city comparison report.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/compare"
            className="bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-base"
          >
            Compare Two Cities — $19
          </Link>
          <Link
            href="/pricing"
            className="border border-border px-8 py-3.5 rounded-lg font-semibold text-foreground hover:bg-secondary transition-colors text-base"
          >
            See What's Included
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          One-time payment. Instant delivery. No subscription.
        </p>
      </div>
    </section>
  );
}

const features = [
  {
    icon: "🏠",
    title: "Housing Market",
    description:
      "Median home prices, price-to-income ratios, and market trend indicators.",
  },
  {
    icon: "📊",
    title: "Income & Rent",
    description:
      "Household income distribution, median rent, and affordability scores.",
  },
  {
    icon: "📈",
    title: "Population Trends",
    description:
      "Growth rates, migration patterns, and demographic composition.",
  },
  {
    icon: "⚠️",
    title: "Risk Indicators",
    description:
      "Climate risk, economic vulnerability, and job market stability.",
  },
  {
    icon: "🏆",
    title: "MetroScore Rating",
    description:
      "A composite 0–100 score comparing each city across all dimensions.",
  },
  {
    icon: "📄",
    title: "PDF Report",
    description:
      "A clean, shareable PDF formatted like a premium real estate analysis.",
  },
];

function FeaturesSection() {
  return (
    <section className="bg-secondary/30 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything in One Report
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            We pull the data so you don&apos;t have to. Every report covers six
            core dimensions of city livability.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { step: "1", title: "Pick Two Cities", body: "Enter any two U.S. cities you want to compare." },
  { step: "2", title: "Get Your Report", body: "Pay $19 and receive your full comparison report instantly." },
  { step: "3", title: "Make Your Decision", body: "Use the data to move, buy, or invest with confidence." },
];

function HowItWorksSection() {
  return (
    <section className="bg-background py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
        <p className="text-muted-foreground text-lg mb-16">
          Three steps to a data-driven city decision.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {steps.map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="bg-primary py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-primary-foreground mb-4">
          Ready to Compare?
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-8">
          Get a professional city comparison report for just $19.
        </p>
        <Link
          href="/compare"
          className="bg-white text-primary px-8 py-3.5 rounded-lg font-semibold hover:bg-white/90 transition-colors text-base inline-block"
        >
          Start Your Comparison
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">MetroScore</span>
        <nav className="flex gap-6">
          <Link href="/pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/compare" className="hover:text-foreground transition-colors">
            Compare
          </Link>
        </nav>
        <span>© {new Date().getFullYear()} MetroScore. All rights reserved.</span>
      </div>
    </footer>
  );
}

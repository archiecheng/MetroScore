import type { Metadata } from "next";
import Link from "next/link";
import HeroSection from "@/components/landing/hero-section";
import ValueProps from "@/components/landing/value-props";
import SampleShowcase from "@/components/landing/sample-showcase";
import HowItWorks from "@/components/landing/how-it-works";
import LandingCta from "@/components/landing/landing-cta";

export const metadata: Metadata = {
  title: "Compare U.S. Cities Before You Move, Buy, or Invest",
  description:
    "MetroScore turns housing, population, income, rent, and risk data into a clear city comparison report.",
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <ValueProps />
        <SampleShowcase />
        <HowItWorks />
        <LandingCta />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-primary tracking-tight">
          MetroScore
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
          <Link
            href="/pricing"
            className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Pricing
          </Link>
          <Link
            href="/view"
            className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Sample Report
          </Link>
          <Link
            href="/compare"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
          >
            Compare Cities
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">MetroScore</span>
        <nav className="flex gap-5">
          <Link href="/pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/compare" className="hover:text-foreground transition-colors">
            Compare
          </Link>
          <Link href="/view" className="hover:text-foreground transition-colors">
            Sample Report
          </Link>
        </nav>
        <div className="text-center sm:text-right text-xs space-y-0.5">
          <p>© {new Date().getFullYear()} MetroScore. All rights reserved.</p>
          <p className="text-muted-foreground/70">
            For educational use only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

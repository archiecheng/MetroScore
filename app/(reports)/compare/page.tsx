import type { Metadata } from "next";
import Link from "next/link";
import CityCompareForm from "@/components/landing/city-compare-form";

export const metadata: Metadata = {
  title: "Compare Cities",
  description: "Pick two U.S. cities and get your MetroScore comparison report.",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ cityA?: string; cityB?: string; purpose?: string }>;
}) {
  const { cityA, cityB, purpose } = await searchParams;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-primary tracking-tight">
            MetroScore
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-start sm:items-center justify-center py-12 sm:py-24 px-4 sm:px-6">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Compare Two Cities
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Choose two U.S. cities and your purpose to generate a comparison report.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <CityCompareForm
              showEmail
              defaultCityA={cityA ?? ""}
              defaultCityB={cityB ?? ""}
              defaultPurpose={purpose ?? ""}
              submitLabel="Continue to Checkout — $19"
            />
          </div>

          {/* Trust signals */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: "🔒", label: "Secure checkout" },
              { icon: "⚡", label: "Instant delivery" },
              { icon: "📄", label: "Printable report" },
            ].map((t) => (
              <div key={t.label} className="text-xs text-muted-foreground space-y-1">
                <div className="text-base">{t.icon}</div>
                <div>{t.label}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Want to preview first?{" "}
            <Link href="/view" className="text-primary hover:underline font-medium">
              View sample report →
            </Link>
          </p>
        </div>
      </main>

      <footer className="border-t border-border py-5 px-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MetroScore · For educational use only · Not financial advice
      </footer>
    </div>
  );
}

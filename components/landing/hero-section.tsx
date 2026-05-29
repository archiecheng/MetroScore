import CityCompareForm from "./city-compare-form";

export default function HeroSection() {
  return (
    <section className="bg-background py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-primary/20">
              Data-driven city analysis
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-5">
              Compare U.S. Cities Before You{" "}
              <span className="text-primary">Move, Buy, or Invest</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              MetroScore turns housing, population, income, rent, and risk data into a clear city
              comparison report.
            </p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                "Side-by-side scores across 6 key dimensions",
                "Home price trends, rent yield & risk alerts",
                "Instant delivery · One-time $19 · No subscription",
              ].map((line) => (
                <li key={line} className="flex items-center gap-2.5">
                  <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-foreground mb-5">
              Choose your two cities to compare
            </p>
            <CityCompareForm submitLabel="Generate My City Comparison →" />
          </div>
        </div>
      </div>
    </section>
  );
}

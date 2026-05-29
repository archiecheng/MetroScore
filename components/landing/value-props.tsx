const VALUE_PROPS = [
  {
    icon: "🏠",
    title: "Housing Affordability Comparison",
    description:
      "See median home prices, price-to-income ratios, and 5-year price trends side by side so you know exactly what each city costs relative to local income.",
    stats: ["Median home price", "Price-to-income ratio", "5-year appreciation trend"],
  },
  {
    icon: "📈",
    title: "Population & Job Market Momentum",
    description:
      "Understand which cities are growing and which are stalling. We track annual population change, migration flow, and employment sector diversity.",
    stats: ["Annual population growth", "Net migration score", "Job market breadth"],
  },
  {
    icon: "⚡",
    title: "Rent Yield & Investment Risk Signals",
    description:
      "For investors, we score rent yield, market liquidity, and risk exposure — from natural disaster risk to economic vulnerability — so you can size your position with confidence.",
    stats: ["Gross rent yield", "Natural disaster score", "Economic resilience index"],
  },
];

export default function ValueProps() {
  return (
    <section className="bg-secondary/30 py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Everything You Need to Decide
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            One $19 report covers the six dimensions that actually move the needle on where to
            live, buy, or invest.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUE_PROPS.map((vp) => (
            <div
              key={vp.title}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="text-3xl mb-4">{vp.icon}</div>
              <h3 className="font-semibold text-foreground mb-2 leading-snug">{vp.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {vp.description}
              </p>
              <ul className="space-y-1.5">
                {vp.stats.map((stat) => (
                  <li key={stat} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    {stat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

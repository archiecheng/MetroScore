const STEPS = [
  {
    step: "1",
    title: "Pick Two Cities",
    body: "Choose any two U.S. cities from our database and select your purpose — moving, buying, or investing.",
  },
  {
    step: "2",
    title: "Pay Once — $19",
    body: "Secure checkout via Stripe. No subscription, no hidden fees. Your report is generated the moment payment clears.",
  },
  {
    step: "3",
    title: "Make Your Decision",
    body: "Get a full comparison with scores, charts, risk alerts, and a clear recommendation delivered to your inbox.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-secondary/30 py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">How It Works</h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            From question to decision in under 5 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden sm:block absolute top-6 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-border"
            aria-hidden
          />

          {STEPS.map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center relative">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mb-5 relative z-10">
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

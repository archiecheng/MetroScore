import Link from "next/link";

export default function LandingCta() {
  return (
    <section className="bg-primary py-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-3">
          Ready to Compare?
        </h2>
        <p className="text-primary-foreground/80 text-base sm:text-lg mb-8 leading-relaxed">
          Get a full city comparison report for $19. One-time payment, instant delivery.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/compare"
            className="bg-white text-primary px-8 py-3.5 rounded-lg font-semibold hover:bg-white/90 transition-colors text-sm inline-block"
          >
            Get My Report — $19
          </Link>
          <Link
            href="/view"
            className="border border-white/30 text-primary-foreground px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-colors text-sm inline-block"
          >
            View Sample Report
          </Link>
        </div>
        <p className="text-primary-foreground/60 text-xs mt-5">
          No subscription · Secure checkout · Instant delivery
        </p>
      </div>
    </section>
  );
}

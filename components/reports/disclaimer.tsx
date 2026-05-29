export default function Disclaimer() {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 px-6 py-5 print:border-gray-300">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
        Disclaimer
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        MetroScore provides data-based educational analysis and does not provide financial, legal,
        tax, or real estate investment advice. Users should consult qualified professionals before
        making purchase or investment decisions. All data is sourced from publicly available third
        parties and may not reflect the most current market conditions.
      </p>
    </div>
  );
}

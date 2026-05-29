"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="text-sm border border-border px-3 py-1.5 rounded-lg font-medium text-foreground hover:bg-secondary transition-colors"
    >
      Print / Save PDF
    </button>
  );
}

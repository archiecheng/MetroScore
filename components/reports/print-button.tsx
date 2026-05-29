"use client";

import { usePostHog } from "posthog-js/react";
import { ANALYTICS_EVENTS } from "@/lib/analytics";

export default function PrintButton() {
  const posthog = usePostHog();

  function handlePrint() {
    posthog?.capture(ANALYTICS_EVENTS.PRINT_CLICKED);
    window.print();
  }

  return (
    <button
      onClick={handlePrint}
      className="text-sm border border-border px-3 py-1.5 rounded-lg font-medium text-foreground hover:bg-secondary transition-colors"
    >
      Print / Save PDF
    </button>
  );
}

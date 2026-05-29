"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { ANALYTICS_EVENTS } from "@/lib/analytics";

export default function CheckoutButton({ reportId }: { reportId: string }) {
  const posthog = usePostHog();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    posthog?.capture(ANALYTICS_EVENTS.CHECKOUT_STARTED, { report_id: reportId });
    try {
      const res = await fetch("/api/v1/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId }),
      });
      if (!res.ok) throw new Error("checkout failed");
      const json = await res.json();
      const { checkoutUrl } = json.data as { checkoutUrl: string | null };
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError("Checkout is not configured yet. Please contact support.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3.5 rounded-lg font-semibold hover:bg-white/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Processing…" : "Purchase Full Report — $19"}
      </button>
      {error && <p className="text-sm text-red-200">{error}</p>}
    </div>
  );
}

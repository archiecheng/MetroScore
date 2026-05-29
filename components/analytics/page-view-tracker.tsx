"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import type { AnalyticsEvent } from "@/lib/analytics";

interface PageViewTrackerProps {
  event: AnalyticsEvent;
  properties?: Record<string, unknown>;
}

/**
 * Drop this into any Server Component page to fire a PostHog event
 * on mount. Renders nothing — pure side effect.
 */
export function PageViewTracker({ event, properties }: PageViewTrackerProps) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.capture(event, properties);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

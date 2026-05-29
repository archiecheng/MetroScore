"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return; // Analytics gracefully disabled when key is absent

    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      capture_pageview: false, // Fired manually via PageViewTracker
      capture_pageleave: true,
      persistence: "localStorage+cookie",
      autocapture: false, // Explicit captures only
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

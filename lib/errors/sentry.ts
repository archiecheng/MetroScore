import * as Sentry from "@sentry/nextjs";

/**
 * Captures an exception in Sentry. Safe to call even when Sentry is not
 * configured — it will no-op if the DSN is absent.
 */
export function captureException(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  if (!process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return;
  }
  Sentry.captureException(error, context ? { extra: context } : undefined);
}

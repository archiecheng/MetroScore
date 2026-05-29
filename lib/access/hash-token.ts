import { createHash, randomBytes } from "node:crypto";

/** Generates a 64-character hex token suitable for use as a report access link. */
export function createSecureReportToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * SHA-256 hash of a token.
 * Only the hash is stored in the database — the raw token is never persisted.
 */
export function hashReportToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

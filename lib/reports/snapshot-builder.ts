import type { CityComparisonReportDTO } from "./report-dto";

/**
 * Creates a JSON-serializable snapshot from a CityComparisonReportDTO.
 * The snapshot is stored in the Report.snapshot (Json) column so we can
 * re-render the report without recomputing scores.
 *
 * Returns a plain object — no class instances, no Dates, no undefined values.
 */
export function buildSnapshot(dto: CityComparisonReportDTO): Record<string, unknown> {
  return JSON.parse(JSON.stringify(dto)) as Record<string, unknown>;
}

/**
 * Restores a CityComparisonReportDTO from a stored snapshot.
 * Returns null if the snapshot is missing or malformed.
 */
export function restoreFromSnapshot(
  snapshot: unknown,
): CityComparisonReportDTO | null {
  if (!snapshot || typeof snapshot !== "object") return null;
  try {
    return snapshot as CityComparisonReportDTO;
  } catch {
    return null;
  }
}

import { prisma } from "@/lib/prisma";
import { hashReportToken } from "@/lib/access/hash-token";
import { buildReportDto } from "./build-report-dto";
import { restoreFromSnapshot } from "./snapshot-builder";
import type { CityComparisonReportDTO, ReportPurpose } from "./report-dto";

export type TokenLookupResult =
  | { ok: true; dto: CityComparisonReportDTO }
  | { ok: false; reason: "not_found" | "not_paid" };

/**
 * Resolves a raw access token into a full CityComparisonReportDTO.
 * Serves from the stored snapshot when available; rebuilds otherwise.
 */
export async function getReportByToken(
  token: string,
): Promise<TokenLookupResult> {
  const hash = hashReportToken(token);

  const report = await prisma.report.findUnique({
    where: { accessTokenHash: hash },
    select: {
      id: true,
      status: true,
      cityAId: true,
      cityBId: true,
      purpose: true,
      snapshot: true,
    },
  });

  if (!report) return { ok: false, reason: "not_found" };
  if (report.status !== "PAID" && report.status !== "DELIVERED") {
    return { ok: false, reason: "not_paid" };
  }

  // Use snapshot when available to avoid re-computing scores on every request.
  if (report.snapshot) {
    const dto = restoreFromSnapshot(report.snapshot);
    if (dto) return { ok: true, dto };
  }

  // Fall back to live computation (e.g. snapshot missing on older records).
  const dto = await buildReportDto(
    report.cityAId,
    report.cityBId,
    report.purpose as ReportPurpose,
    report.id,
  );

  return { ok: true, dto };
}

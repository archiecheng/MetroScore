import { prisma } from "@/lib/prisma";
import type { ReportPurpose } from "@/lib/reports/report-dto";

export class CityNotFoundError extends Error {
  constructor(public readonly cityId: string) {
    super(`City not found: ${cityId}`);
    this.name = "CityNotFoundError";
  }
}

export type CreateReportInput = {
  cityAId: string;
  cityBId: string;
  purpose: ReportPurpose;
  buyerEmail?: string;
};

export type CreateReportResult = {
  reportId: string;
  status: string;
};

export async function createReport(
  input: CreateReportInput,
): Promise<CreateReportResult> {
  // Verify both cities exist before creating the record.
  const [cityA, cityB] = await Promise.all([
    prisma.city.findUnique({ where: { id: input.cityAId }, select: { id: true } }),
    prisma.city.findUnique({ where: { id: input.cityBId }, select: { id: true } }),
  ]);

  if (!cityA) throw new CityNotFoundError(input.cityAId);
  if (!cityB) throw new CityNotFoundError(input.cityBId);

  // Reuse a recent PENDING_PAYMENT report for the same selection to avoid orphan accumulation.
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existing = await prisma.report.findFirst({
    where: {
      cityAId: input.cityAId,
      cityBId: input.cityBId,
      purpose: input.purpose,
      buyerEmail: input.buyerEmail ?? null,
      status: "PENDING_PAYMENT",
      createdAt: { gte: cutoff },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, status: true },
  });

  if (existing) return { reportId: existing.id, status: existing.status };

  const report = await prisma.report.create({
    data: {
      cityAId: input.cityAId,
      cityBId: input.cityBId,
      purpose: input.purpose,
      buyerEmail: input.buyerEmail ?? null,
      status: "PENDING_PAYMENT",
    },
    select: { id: true, status: true },
  });

  return { reportId: report.id, status: report.status };
}

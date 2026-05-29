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

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { createSecureReportToken, hashReportToken } from "@/lib/access/hash-token";
import { buildReportDto } from "./build-report-dto";
import { buildSnapshot } from "./snapshot-builder";
import type { ReportPurpose, CityComparisonReportDTO } from "./report-dto";

export type FulfillReportParams = {
  reportId: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string | null;
  amountTotal: number;
  currency: string;
  customerEmail?: string | null;
};

export type FulfillReportResult = {
  rawToken: string;
  dto: CityComparisonReportDTO;
  buyerEmail: string | null;
};

/**
 * Atomically fulfills a paid report:
 * 1. Loads the report record.
 * 2. Builds the full CityComparisonReportDTO and snapshot.
 * 3. Generates a secure access token (only hash stored in DB).
 * 4. Creates the Payment record.
 * 5. Updates the Report to PAID with paidAt, snapshot, and accessTokenHash.
 *
 * Returns the raw token (for inclusion in the email URL) and the DTO.
 */
export async function fulfillReport(
  params: FulfillReportParams,
): Promise<FulfillReportResult> {
  // Load report to get city IDs and purpose
  const report = await prisma.report.findUniqueOrThrow({
    where: { id: params.reportId },
    select: {
      id: true,
      cityAId: true,
      cityBId: true,
      purpose: true,
      buyerEmail: true,
    },
  });

  // Build full DTO and JSON-serialisable snapshot
  const dto = await buildReportDto(
    report.cityAId,
    report.cityBId,
    report.purpose as ReportPurpose,
    report.id,
  );
  const snapshot = buildSnapshot(dto);

  // Generate token — raw value returned to caller, only hash persisted
  const rawToken = createSecureReportToken();
  const tokenHash = hashReportToken(rawToken);
  const now = new Date();

  // Payment + Report update in a single transaction
  await prisma.$transaction([
    prisma.payment.create({
      data: {
        reportId: params.reportId,
        stripeCheckoutSessionId: params.stripeCheckoutSessionId,
        stripePaymentIntentId: params.stripePaymentIntentId ?? null,
        amount: params.amountTotal,
        currency: params.currency,
        status: "succeeded",
        buyerEmail: params.customerEmail ?? report.buyerEmail ?? null,
      },
    }),
    prisma.report.update({
      where: { id: params.reportId },
      data: {
        status: "PAID",
        paidAt: now,
        accessTokenHash: tokenHash,
        snapshot: snapshot as unknown as Prisma.InputJsonValue,
      },
    }),
  ]);

  return {
    rawToken,
    dto,
    buyerEmail: params.customerEmail ?? report.buyerEmail,
  };
}

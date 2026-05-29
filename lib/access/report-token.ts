import { prisma } from "@/lib/prisma";
import { createSecureReportToken, hashReportToken } from "./hash-token";

/**
 * Generates a secure access token, stores its hash on the Report row,
 * and returns the raw token to the caller for delivery to the buyer.
 * The raw token is never stored in the database.
 */
export async function createAccessToken(reportId: string): Promise<string> {
  const token = createSecureReportToken();
  const hash = hashReportToken(token);

  await prisma.report.update({
    where: { id: reportId },
    data: { accessTokenHash: hash },
  });

  return token;
}

/**
 * Looks up a report by its hashed token.
 * Returns null if the token is invalid, expired, or the report is not yet paid.
 */
export async function validateAccessToken(
  token: string,
): Promise<{ reportId: string; status: string } | null> {
  const hash = hashReportToken(token);

  const report = await prisma.report.findUnique({
    where: { accessTokenHash: hash },
    select: { id: true, status: true },
  });

  if (!report) return null;
  if (report.status !== "PAID" && report.status !== "DELIVERED") return null;

  return { reportId: report.id, status: report.status };
}

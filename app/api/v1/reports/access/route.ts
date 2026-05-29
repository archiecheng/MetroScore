import { getReportByToken } from "@/lib/reports/get-report-by-token";
import { ok, err } from "@/lib/api/response";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token || token.trim().length === 0) {
    return err("token query parameter is required", 400, "MISSING_TOKEN");
  }

  try {
    const result = await getReportByToken(token);

    if (!result.ok) {
      if (result.reason === "not_found") {
        return err("Report not found or access link is invalid", 404, "NOT_FOUND");
      }
      return err("Report has not been paid for yet", 402, "PAYMENT_REQUIRED");
    }

    return ok({ report: result.dto });
  } catch (e) {
    console.error("[GET /api/v1/reports/access]", e);
    return err("Internal server error", 500);
  }
}

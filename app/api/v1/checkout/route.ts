import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations/checkout.schema";
import { ok, err } from "@/lib/api/response";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return err("Invalid JSON body", 400);
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return err("Validation failed", 400, "VALIDATION_ERROR", parsed.error.issues);
  }

  const { reportId } = parsed.data;

  try {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      select: { id: true, status: true },
    });

    if (!report) {
      return err("Report not found", 404, "NOT_FOUND");
    }

    if (report.status === "PAID" || report.status === "DELIVERED") {
      return err("Report has already been paid for", 409, "ALREADY_PAID");
    }

    // Stripe integration will replace this placeholder.
    const stripeConfigured = !!process.env.STRIPE_SECRET_KEY;

    if (!stripeConfigured) {
      return ok({
        reportId,
        checkoutUrl: null,
        message: "Stripe is not configured. Set STRIPE_SECRET_KEY to enable checkout.",
      });
    }

    // TODO: create real Stripe Checkout session here.
    return ok({ reportId, checkoutUrl: null, message: "Stripe integration pending" });
  } catch (e) {
    console.error("[POST /api/v1/checkout]", e);
    return err("Internal server error", 500);
  }
}

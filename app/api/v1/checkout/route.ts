import { prisma } from "@/lib/prisma";
import { createStripeCheckoutSession } from "@/lib/payments/stripe-service";
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
      select: {
        id: true,
        status: true,
        buyerEmail: true,
        cityA: { select: { name: true } },
        cityB: { select: { name: true } },
      },
    });

    if (!report) return err("Report not found", 404, "NOT_FOUND");

    if (report.status === "PAID" || report.status === "DELIVERED") {
      return err("Report has already been paid for", 409, "ALREADY_PAID");
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return ok({
        reportId,
        checkoutUrl: null,
        message: "Stripe is not configured. Set STRIPE_SECRET_KEY to enable checkout.",
      });
    }

    const { checkoutUrl } = await createStripeCheckoutSession({
      reportId,
      cityAName: report.cityA.name,
      cityBName: report.cityB.name,
      buyerEmail: report.buyerEmail,
    });

    // Transition DRAFT → PENDING_PAYMENT so we know checkout was initiated
    if (report.status === "DRAFT") {
      await prisma.report.update({
        where: { id: reportId },
        data: { status: "PENDING_PAYMENT" },
      });
    }

    return ok({ reportId, checkoutUrl });
  } catch (e) {
    console.error("[POST /api/v1/checkout]", e);
    return err("Internal server error", 500);
  }
}

import { prisma } from "@/lib/prisma";
import { verifyStripeWebhook } from "@/lib/payments/stripe-service";
import { fulfillReport } from "@/lib/reports/fulfill-report";
import { sendReportReadyEmail } from "@/lib/email/resend-service";
import { captureException } from "@/lib/errors/sentry";
import type Stripe from "stripe";

// Raw body must be preserved for Stripe signature verification.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing Stripe-Signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = verifyStripeWebhook(rawBody, signature);
  } catch (e) {
    console.error("[webhook] signature verification failed:", e);
    return Response.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // --- Idempotency guard ---
    const existing = await prisma.payment.findUnique({
      where: { stripeCheckoutSessionId: session.id },
      select: { id: true },
    });
    if (existing) {
      return Response.json({ received: true, idempotent: true });
    }

    const reportId = session.metadata?.reportId;
    if (!reportId) {
      console.error("[webhook] missing reportId in session metadata", session.id);
      return Response.json({ error: "Missing reportId in metadata" }, { status: 400 });
    }

    if (session.payment_status !== "paid") {
      // Session completed but payment not captured yet (unusual — skip)
      return Response.json({ received: true });
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? null);

    try {
      // --- Fulfill: build snapshot, create token, update DB ---
      const result = await fulfillReport({
        reportId,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        amountTotal: session.amount_total ?? 1900,
        currency: session.currency ?? "usd",
        customerEmail: session.customer_email,
      });

      // --- Send report link email ---
      const emailTo = result.buyerEmail;
      if (emailTo) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
        const reportUrl = `${appUrl}/view?token=${result.rawToken}`;

        try {
          await sendReportReadyEmail({
            to: emailTo,
            cityAName: result.dto.cityA.name,
            cityBName: result.dto.cityB.name,
            reportUrl,
          });

          await prisma.report.update({
            where: { id: reportId },
            data: { status: "DELIVERED", deliveredAt: new Date() },
          });
        } catch (emailErr) {
          // Payment succeeded — don't retry the whole webhook over an email failure.
          // Report stays PAID; email can be resent manually.
          console.error("[webhook] email delivery failed for report", reportId, emailErr);
          captureException(emailErr, { reportId, context: "email_delivery" });
        }
      }
    } catch (fulfillErr) {
      console.error("[webhook] fulfillment failed for report", reportId, fulfillErr);
      captureException(fulfillErr, { reportId, context: "report_fulfillment" });
      // Return 500 so Stripe retries the webhook
      return Response.json({ received: false }, { status: 500 });
    }
  }

  return Response.json({ received: true });
}

/**
 * POST /api/v1/stripe/webhook
 * Placeholder — real Stripe signature verification and event handling
 * will be implemented when Stripe keys are configured.
 */
export async function POST(request: Request) {
  // TODO: verify Stripe-Signature header with STRIPE_WEBHOOK_SECRET
  // TODO: handle checkout.session.completed → mark Report PAID, generate token
  // TODO: handle payment_intent.payment_failed → mark Report FAILED
  void request; // suppress unused warning until Stripe is wired up
  return Response.json({ received: true });
}

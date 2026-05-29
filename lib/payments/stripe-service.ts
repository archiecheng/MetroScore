import Stripe from "stripe";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key);
}

export async function createStripeCheckoutSession(params: {
  reportId: string;
  cityAName: string;
  cityBName: string;
  buyerEmail?: string | null;
}): Promise<{ sessionId: string; checkoutUrl: string }> {
  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 1900,
          product_data: {
            name: "MetroScore City Comparison Report",
            description: `${params.cityAName} vs ${params.cityBName}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { reportId: params.reportId },
    customer_email: params.buyerEmail ?? undefined,
    success_url: `${appUrl}/compare?success=1&reportId=${params.reportId}`,
    cancel_url: `${appUrl}/compare`,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  return { sessionId: session.id, checkoutUrl: session.url };
}

export function verifyStripeWebhook(rawBody: string, signature: string): Stripe.Event {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}

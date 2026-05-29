import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // TODO: verify Stripe webhook signature, handle payment events
  return Response.json({ received: true });
}

import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // TODO: validate body, create Stripe Checkout session, return session URL
  const body = await request.json();
  return Response.json({ url: null, body }, { status: 501 });
}

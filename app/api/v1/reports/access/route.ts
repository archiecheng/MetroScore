import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // TODO: validate access token, return report data
  return Response.json({ valid: false, token }, { status: 501 });
}

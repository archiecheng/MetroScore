import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // TODO: validate body, create report record, return reportId
  const body = await request.json();
  return Response.json({ reportId: null, body }, { status: 501 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get("id");

  // TODO: fetch report from database
  return Response.json({ report: null, reportId }, { status: 501 });
}

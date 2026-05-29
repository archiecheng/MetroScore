import { createReport, CityNotFoundError } from "@/lib/reports/create-report";
import { createReportApiSchema } from "@/lib/validations/report";
import { ok, err } from "@/lib/api/response";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return err("Invalid JSON body", 400);
  }

  const parsed = createReportApiSchema.safeParse(body);
  if (!parsed.success) {
    return err("Validation failed", 400, "VALIDATION_ERROR", parsed.error.issues);
  }

  try {
    const result = await createReport(parsed.data);
    return ok(result, 201);
  } catch (e) {
    if (e instanceof CityNotFoundError) {
      return err(e.message, 422, "CITY_NOT_FOUND");
    }
    console.error("[POST /api/v1/reports]", e);
    return err("Internal server error", 500);
  }
}

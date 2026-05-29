import { searchCities } from "@/lib/data/cities";
import { cityQuerySchema } from "@/lib/validations/city.schema";
import { ok, err } from "@/lib/api/response";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = cityQuerySchema.safeParse({ query: searchParams.get("query") ?? undefined });

  if (!parsed.success) {
    return err("Invalid query parameter", 400);
  }

  try {
    const cities = await searchCities(parsed.data.query);

    const data = cities.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      state: c.state,
      metroName: c.metroName ?? null,
    }));

    return ok({ cities: data, count: data.length });
  } catch (e) {
    console.error("[GET /api/v1/cities]", e);
    return err("Internal server error", 500);
  }
}

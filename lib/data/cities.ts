import { prisma } from "@/lib/prisma";
import type { City, CityMetric } from "@prisma/client";

export type { City, CityMetric };

export type CityWithLatestMetrics = City & {
  latestMetrics: CityMetric | null;
};

export async function getAllCities(): Promise<City[]> {
  return prisma.city.findMany({
    orderBy: [{ state: "asc" }, { name: "asc" }],
  });
}

export async function getCityBySlug(slug: string): Promise<CityWithLatestMetrics | null> {
  const city = await prisma.city.findUnique({
    where: { slug },
    include: {
      metrics: {
        orderBy: { year: "desc" },
        take: 1,
      },
    },
  });

  if (!city) return null;

  const { metrics, ...cityFields } = city;
  return { ...cityFields, latestMetrics: metrics[0] ?? null };
}

export async function getCityById(id: string): Promise<City | null> {
  return prisma.city.findUnique({ where: { id } });
}

export async function getCitiesBySlugs(slugs: string[]): Promise<City[]> {
  return prisma.city.findMany({
    where: { slug: { in: slugs } },
  });
}

/** Full-text search across city name and state. Returns at most 50 results. */
export async function searchCities(query?: string): Promise<City[]> {
  return prisma.city.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { state: { equals: query.toUpperCase() } },
            { slug: { contains: query.toLowerCase() } },
          ],
        }
      : undefined,
    orderBy: [{ state: "asc" }, { name: "asc" }],
    take: 50,
  });
}

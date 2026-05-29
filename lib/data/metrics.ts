import { prisma } from "@/lib/prisma";
import type { CityMetric } from "@prisma/client";

export type { CityMetric };

export async function getMetricsByCityId(
  cityId: string,
  opts?: { fromYear?: number; toYear?: number },
): Promise<CityMetric[]> {
  return prisma.cityMetric.findMany({
    where: {
      cityId,
      ...(opts?.fromYear !== undefined || opts?.toYear !== undefined
        ? {
            year: {
              ...(opts.fromYear !== undefined ? { gte: opts.fromYear } : {}),
              ...(opts.toYear !== undefined ? { lte: opts.toYear } : {}),
            },
          }
        : {}),
    },
    orderBy: { year: "asc" },
  });
}

export async function getLatestMetrics(cityId: string): Promise<CityMetric | null> {
  return prisma.cityMetric.findFirst({
    where: { cityId },
    orderBy: { year: "desc" },
  });
}

export async function getMetricsByYear(
  cityId: string,
  year: number,
): Promise<CityMetric | null> {
  return prisma.cityMetric.findUnique({
    where: { cityId_year: { cityId, year } },
  });
}

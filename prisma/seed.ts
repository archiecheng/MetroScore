import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MetricRow = {
  year: number;
  population: number;
  medianHomeValue: number;
  medianRent: number;
  medianHouseholdIncome: number;
  unemploymentRate: number;
  populationGrowthRate: number | null;
  homePriceGrowthRate: number | null;
};

type CityInput = {
  slug: string;
  name: string;
  state: string;
  metroName?: string;
  county?: string;
  latitude: number;
  longitude: number;
  metrics: MetricRow[];
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Annual rent as % of home value — a simple proxy for rent yield floor. */
function rtp(rent: number, homeValue: number): number {
  return Math.round(((rent * 12) / homeValue) * 1000) / 10; // one decimal %
}

/** House price index relative to 2023 value = 100. */
function hpi(homeValue: number, baseValue: number): number {
  return Math.round((homeValue / baseValue) * 10) / 0.1 / 1000;
}

// ---------------------------------------------------------------------------
// City seed data
// ---------------------------------------------------------------------------

const CITIES: CityInput[] = [
  {
    slug: "san-jose-ca",
    name: "San Jose",
    state: "CA",
    metroName: "San Jose-Sunnyvale-Santa Clara",
    county: "Santa Clara County",
    latitude: 37.3382,
    longitude: -121.8863,
    metrics: [
      { year: 2020, population: 1008654, medianHomeValue: 999000,  medianRent: 2750, medianHouseholdIncome: 117000, unemploymentRate: 7.2, populationGrowthRate: null, homePriceGrowthRate: null },
      { year: 2021, population: 1010000, medianHomeValue: 1080000, medianRent: 2900, medianHouseholdIncome: 121000, unemploymentRate: 4.8, populationGrowthRate: 0.1,  homePriceGrowthRate: 8.1 },
      { year: 2022, population: 1000000, medianHomeValue: 1250000, medianRent: 3100, medianHouseholdIncome: 128000, unemploymentRate: 3.5, populationGrowthRate: -1.0, homePriceGrowthRate: 15.7 },
      { year: 2023, population: 1022000, medianHomeValue: 1180000, medianRent: 3000, medianHouseholdIncome: 130000, unemploymentRate: 4.2, populationGrowthRate: 2.2,  homePriceGrowthRate: -5.6 },
      { year: 2024, population: 1030000, medianHomeValue: 1155000, medianRent: 3050, medianHouseholdIncome: 133000, unemploymentRate: 3.8, populationGrowthRate: 0.8,  homePriceGrowthRate: -2.1 },
    ],
  },
  {
    slug: "san-francisco-ca",
    name: "San Francisco",
    state: "CA",
    metroName: "San Francisco-Oakland-Berkeley",
    county: "San Francisco County",
    latitude: 37.7749,
    longitude: -122.4194,
    metrics: [
      { year: 2020, population: 875000, medianHomeValue: 1200000, medianRent: 3200, medianHouseholdIncome: 126000, unemploymentRate: 8.5, populationGrowthRate: null, homePriceGrowthRate: null },
      { year: 2021, population: 863000, medianHomeValue: 1300000, medianRent: 3000, medianHouseholdIncome: 130000, unemploymentRate: 6.2, populationGrowthRate: -1.4, homePriceGrowthRate: 8.3 },
      { year: 2022, population: 847000, medianHomeValue: 1480000, medianRent: 3200, medianHouseholdIncome: 136000, unemploymentRate: 4.2, populationGrowthRate: -1.9, homePriceGrowthRate: 13.8 },
      { year: 2023, population: 840000, medianHomeValue: 1310000, medianRent: 3100, medianHouseholdIncome: 138000, unemploymentRate: 5.1, populationGrowthRate: -0.8, homePriceGrowthRate: -11.5 },
      { year: 2024, population: 845000, medianHomeValue: 1290000, medianRent: 3200, medianHouseholdIncome: 140000, unemploymentRate: 4.8, populationGrowthRate: 0.6,  homePriceGrowthRate: -1.5 },
    ],
  },
  {
    slug: "los-angeles-ca",
    name: "Los Angeles",
    state: "CA",
    metroName: "Los Angeles-Long Beach-Anaheim",
    county: "Los Angeles County",
    latitude: 34.0522,
    longitude: -118.2437,
    metrics: [
      { year: 2020, population: 3898000, medianHomeValue: 720000,  medianRent: 2100, medianHouseholdIncome: 68000, unemploymentRate: 13.5, populationGrowthRate: null, homePriceGrowthRate: null },
      { year: 2021, population: 3870000, medianHomeValue: 780000,  medianRent: 2200, medianHouseholdIncome: 71000, unemploymentRate: 8.1,  populationGrowthRate: -0.7, homePriceGrowthRate: 8.3 },
      { year: 2022, population: 3822000, medianHomeValue: 900000,  medianRent: 2350, medianHouseholdIncome: 74000, unemploymentRate: 5.5,  populationGrowthRate: -1.2, homePriceGrowthRate: 15.4 },
      { year: 2023, population: 3795000, medianHomeValue: 850000,  medianRent: 2300, medianHouseholdIncome: 76000, unemploymentRate: 5.8,  populationGrowthRate: -0.7, homePriceGrowthRate: -5.6 },
      { year: 2024, population: 3820000, medianHomeValue: 870000,  medianRent: 2350, medianHouseholdIncome: 78000, unemploymentRate: 5.2,  populationGrowthRate: 0.7,  homePriceGrowthRate: 2.4 },
    ],
  },
  {
    slug: "irvine-ca",
    name: "Irvine",
    state: "CA",
    metroName: "Los Angeles-Long Beach-Anaheim",
    county: "Orange County",
    latitude: 33.6846,
    longitude: -117.8265,
    metrics: [
      { year: 2020, population: 295000, medianHomeValue: 900000,  medianRent: 2500, medianHouseholdIncome: 108000, unemploymentRate: 5.8, populationGrowthRate: null, homePriceGrowthRate: null },
      { year: 2021, population: 305000, medianHomeValue: 980000,  medianRent: 2700, medianHouseholdIncome: 112000, unemploymentRate: 4.1, populationGrowthRate: 3.4,  homePriceGrowthRate: 8.9 },
      { year: 2022, population: 312000, medianHomeValue: 1150000, medianRent: 2900, medianHouseholdIncome: 116000, unemploymentRate: 2.9, populationGrowthRate: 2.3,  homePriceGrowthRate: 17.3 },
      { year: 2023, population: 318000, medianHomeValue: 1080000, medianRent: 2850, medianHouseholdIncome: 118000, unemploymentRate: 3.2, populationGrowthRate: 1.9,  homePriceGrowthRate: -6.1 },
      { year: 2024, population: 322000, medianHomeValue: 1100000, medianRent: 2900, medianHouseholdIncome: 121000, unemploymentRate: 3.0, populationGrowthRate: 1.3,  homePriceGrowthRate: 1.9 },
    ],
  },
  {
    slug: "san-diego-ca",
    name: "San Diego",
    state: "CA",
    metroName: "San Diego-Chula Vista-Carlsbad",
    county: "San Diego County",
    latitude: 32.7157,
    longitude: -117.1611,
    metrics: [
      { year: 2020, population: 1384000, medianHomeValue: 750000,  medianRent: 2200, medianHouseholdIncome: 84000, unemploymentRate: 8.2, populationGrowthRate: null, homePriceGrowthRate: null },
      { year: 2021, population: 1387000, medianHomeValue: 820000,  medianRent: 2350, medianHouseholdIncome: 88000, unemploymentRate: 5.9, populationGrowthRate: 0.2,  homePriceGrowthRate: 9.3 },
      { year: 2022, population: 1380000, medianHomeValue: 960000,  medianRent: 2600, medianHouseholdIncome: 92000, unemploymentRate: 3.8, populationGrowthRate: -0.5, homePriceGrowthRate: 17.1 },
      { year: 2023, population: 1386000, medianHomeValue: 900000,  medianRent: 2550, medianHouseholdIncome: 94000, unemploymentRate: 4.0, populationGrowthRate: 0.4,  homePriceGrowthRate: -6.3 },
      { year: 2024, population: 1395000, medianHomeValue: 920000,  medianRent: 2600, medianHouseholdIncome: 96000, unemploymentRate: 3.7, populationGrowthRate: 0.6,  homePriceGrowthRate: 2.2 },
    ],
  },
  {
    slug: "austin-tx",
    name: "Austin",
    state: "TX",
    metroName: "Austin-Round Rock-Georgetown",
    county: "Travis County",
    latitude: 30.2672,
    longitude: -97.7431,
    metrics: [
      { year: 2020, population: 950000, medianHomeValue: 390000, medianRent: 1400, medianHouseholdIncome: 75000, unemploymentRate: 6.2, populationGrowthRate: null, homePriceGrowthRate: null },
      { year: 2021, population: 975000, medianHomeValue: 460000, medianRent: 1550, medianHouseholdIncome: 79000, unemploymentRate: 3.9, populationGrowthRate: 2.6,  homePriceGrowthRate: 17.9 },
      { year: 2022, population: 990000, medianHomeValue: 580000, medianRent: 1850, medianHouseholdIncome: 84000, unemploymentRate: 2.8, populationGrowthRate: 1.5,  homePriceGrowthRate: 26.1 },
      { year: 2023, population: 980000, medianHomeValue: 530000, medianRent: 1750, medianHouseholdIncome: 86000, unemploymentRate: 3.5, populationGrowthRate: -1.0, homePriceGrowthRate: -8.6 },
      { year: 2024, population: 985000, medianHomeValue: 520000, medianRent: 1720, medianHouseholdIncome: 88000, unemploymentRate: 3.3, populationGrowthRate: 0.5,  homePriceGrowthRate: -1.9 },
    ],
  },
  {
    slug: "dallas-tx",
    name: "Dallas",
    state: "TX",
    metroName: "Dallas-Fort Worth-Arlington",
    county: "Dallas County",
    latitude: 32.7767,
    longitude: -96.7970,
    metrics: [
      { year: 2020, population: 1304000, medianHomeValue: 290000, medianRent: 1400, medianHouseholdIncome: 58000, unemploymentRate: 7.5, populationGrowthRate: null, homePriceGrowthRate: null },
      { year: 2021, population: 1288000, medianHomeValue: 320000, medianRent: 1480, medianHouseholdIncome: 61000, unemploymentRate: 4.8, populationGrowthRate: -1.2, homePriceGrowthRate: 10.3 },
      { year: 2022, population: 1302000, medianHomeValue: 380000, medianRent: 1650, medianHouseholdIncome: 64000, unemploymentRate: 3.4, populationGrowthRate: 1.1,  homePriceGrowthRate: 18.8 },
      { year: 2023, population: 1316000, medianHomeValue: 360000, medianRent: 1600, medianHouseholdIncome: 65000, unemploymentRate: 3.7, populationGrowthRate: 1.1,  homePriceGrowthRate: -5.3 },
      { year: 2024, population: 1330000, medianHomeValue: 365000, medianRent: 1600, medianHouseholdIncome: 67000, unemploymentRate: 3.5, populationGrowthRate: 1.1,  homePriceGrowthRate: 1.4 },
    ],
  },
  {
    slug: "phoenix-az",
    name: "Phoenix",
    state: "AZ",
    metroName: "Phoenix-Mesa-Chandler",
    county: "Maricopa County",
    latitude: 33.4484,
    longitude: -112.0740,
    metrics: [
      { year: 2020, population: 1608000, medianHomeValue: 310000, medianRent: 1400, medianHouseholdIncome: 62000, unemploymentRate: 7.8, populationGrowthRate: null, homePriceGrowthRate: null },
      { year: 2021, population: 1625000, medianHomeValue: 370000, medianRent: 1550, medianHouseholdIncome: 65000, unemploymentRate: 5.0, populationGrowthRate: 1.1,  homePriceGrowthRate: 19.4 },
      { year: 2022, population: 1643000, medianHomeValue: 440000, medianRent: 1750, medianHouseholdIncome: 68000, unemploymentRate: 3.5, populationGrowthRate: 1.1,  homePriceGrowthRate: 18.9 },
      { year: 2023, population: 1660000, medianHomeValue: 410000, medianRent: 1680, medianHouseholdIncome: 70000, unemploymentRate: 3.8, populationGrowthRate: 1.0,  homePriceGrowthRate: -6.8 },
      { year: 2024, population: 1680000, medianHomeValue: 420000, medianRent: 1700, medianHouseholdIncome: 72000, unemploymentRate: 3.5, populationGrowthRate: 1.2,  homePriceGrowthRate: 2.4 },
    ],
  },
  {
    slug: "las-vegas-nv",
    name: "Las Vegas",
    state: "NV",
    metroName: "Las Vegas-Henderson-Paradise",
    county: "Clark County",
    latitude: 36.1699,
    longitude: -115.1398,
    metrics: [
      { year: 2020, population: 641000, medianHomeValue: 320000, medianRent: 1450, medianHouseholdIncome: 56000, unemploymentRate: 15.5, populationGrowthRate: null, homePriceGrowthRate: null },
      { year: 2021, population: 647000, medianHomeValue: 380000, medianRent: 1550, medianHouseholdIncome: 59000, unemploymentRate: 7.5,  populationGrowthRate: 0.9,  homePriceGrowthRate: 18.8 },
      { year: 2022, population: 654000, medianHomeValue: 450000, medianRent: 1750, medianHouseholdIncome: 62000, unemploymentRate: 5.0,  populationGrowthRate: 1.1,  homePriceGrowthRate: 18.4 },
      { year: 2023, population: 650000, medianHomeValue: 420000, medianRent: 1700, medianHouseholdIncome: 63000, unemploymentRate: 5.5,  populationGrowthRate: -0.6, homePriceGrowthRate: -6.7 },
      { year: 2024, population: 655000, medianHomeValue: 425000, medianRent: 1700, medianHouseholdIncome: 65000, unemploymentRate: 5.0,  populationGrowthRate: 0.8,  homePriceGrowthRate: 1.2 },
    ],
  },
  {
    slug: "colorado-springs-co",
    name: "Colorado Springs",
    state: "CO",
    metroName: "Colorado Springs",
    county: "El Paso County",
    latitude: 38.8339,
    longitude: -104.8214,
    metrics: [
      { year: 2020, population: 478000, medianHomeValue: 310000, medianRent: 1300, medianHouseholdIncome: 63000, unemploymentRate: 6.8, populationGrowthRate: null, homePriceGrowthRate: null },
      { year: 2021, population: 487000, medianHomeValue: 360000, medianRent: 1400, medianHouseholdIncome: 67000, unemploymentRate: 4.5, populationGrowthRate: 1.9,  homePriceGrowthRate: 16.1 },
      { year: 2022, population: 500000, medianHomeValue: 420000, medianRent: 1550, medianHouseholdIncome: 70000, unemploymentRate: 3.2, populationGrowthRate: 2.7,  homePriceGrowthRate: 16.7 },
      { year: 2023, population: 516000, medianHomeValue: 445000, medianRent: 1520, medianHouseholdIncome: 72000, unemploymentRate: 3.0, populationGrowthRate: 3.2,  homePriceGrowthRate: 6.0 },
      { year: 2024, population: 525000, medianHomeValue: 455000, medianRent: 1540, medianHouseholdIncome: 74000, unemploymentRate: 2.8, populationGrowthRate: 1.7,  homePriceGrowthRate: 2.2 },
    ],
  },
  {
    slug: "raleigh-nc",
    name: "Raleigh",
    state: "NC",
    metroName: "Raleigh-Cary",
    county: "Wake County",
    latitude: 35.7796,
    longitude: -78.6382,
    metrics: [
      { year: 2020, population: 474000, medianHomeValue: 320000, medianRent: 1350, medianHouseholdIncome: 72000, unemploymentRate: 6.5, populationGrowthRate: null, homePriceGrowthRate: null },
      { year: 2021, population: 485000, medianHomeValue: 370000, medianRent: 1450, medianHouseholdIncome: 76000, unemploymentRate: 4.2, populationGrowthRate: 2.3,  homePriceGrowthRate: 15.6 },
      { year: 2022, population: 498000, medianHomeValue: 430000, medianRent: 1600, medianHouseholdIncome: 80000, unemploymentRate: 3.0, populationGrowthRate: 2.7,  homePriceGrowthRate: 16.2 },
      { year: 2023, population: 510000, medianHomeValue: 420000, medianRent: 1580, medianHouseholdIncome: 82000, unemploymentRate: 3.2, populationGrowthRate: 2.4,  homePriceGrowthRate: -2.3 },
      { year: 2024, population: 520000, medianHomeValue: 430000, medianRent: 1600, medianHouseholdIncome: 84000, unemploymentRate: 3.0, populationGrowthRate: 2.0,  homePriceGrowthRate: 2.4 },
    ],
  },
  {
    slug: "tampa-fl",
    name: "Tampa",
    state: "FL",
    metroName: "Tampa-St. Petersburg-Clearwater",
    county: "Hillsborough County",
    latitude: 27.9506,
    longitude: -82.4572,
    metrics: [
      { year: 2020, population: 399000, medianHomeValue: 290000, medianRent: 1450, medianHouseholdIncome: 57000, unemploymentRate: 8.8, populationGrowthRate: null, homePriceGrowthRate: null },
      { year: 2021, population: 411000, medianHomeValue: 340000, medianRent: 1600, medianHouseholdIncome: 60000, unemploymentRate: 5.2, populationGrowthRate: 3.0,  homePriceGrowthRate: 17.2 },
      { year: 2022, population: 425000, medianHomeValue: 410000, medianRent: 1850, medianHouseholdIncome: 63000, unemploymentRate: 3.5, populationGrowthRate: 3.4,  homePriceGrowthRate: 20.6 },
      { year: 2023, population: 436000, medianHomeValue: 390000, medianRent: 1800, medianHouseholdIncome: 64000, unemploymentRate: 3.8, populationGrowthRate: 2.6,  homePriceGrowthRate: -4.9 },
      { year: 2024, population: 444000, medianHomeValue: 400000, medianRent: 1800, medianHouseholdIncome: 66000, unemploymentRate: 3.5, populationGrowthRate: 1.8,  homePriceGrowthRate: 2.6 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Seed runner
// ---------------------------------------------------------------------------

async function main() {
  console.log("Seeding cities and metrics…");

  for (const cityData of CITIES) {
    const { metrics, ...cityFields } = cityData;

    const city = await prisma.city.upsert({
      where: { slug: cityFields.slug },
      update: cityFields,
      create: cityFields,
    });

    // Find the 2023 home value to use as HPI baseline (2023 = 100)
    const base2023 = metrics.find((m) => m.year === 2023)?.medianHomeValue ?? 1;

    for (const m of metrics) {
      await prisma.cityMetric.upsert({
        where: { cityId_year: { cityId: city.id, year: m.year } },
        update: {
          population: m.population,
          medianHomeValue: m.medianHomeValue,
          medianRent: m.medianRent,
          medianHouseholdIncome: m.medianHouseholdIncome,
          unemploymentRate: m.unemploymentRate,
          housePriceIndex: hpi(m.medianHomeValue, base2023),
          rentToPriceRatio: rtp(m.medianRent, m.medianHomeValue),
          populationGrowthRate: m.populationGrowthRate,
          homePriceGrowthRate: m.homePriceGrowthRate,
          sourceName: "Demo Data",
          sourceUrl: null,
        },
        create: {
          cityId: city.id,
          year: m.year,
          population: m.population,
          medianHomeValue: m.medianHomeValue,
          medianRent: m.medianRent,
          medianHouseholdIncome: m.medianHouseholdIncome,
          unemploymentRate: m.unemploymentRate,
          housePriceIndex: hpi(m.medianHomeValue, base2023),
          rentToPriceRatio: rtp(m.medianRent, m.medianHomeValue),
          populationGrowthRate: m.populationGrowthRate,
          homePriceGrowthRate: m.homePriceGrowthRate,
          sourceName: "Demo Data",
          sourceUrl: null,
        },
      });
    }

    console.log(`  ✓ ${city.name}, ${city.state} (${metrics.length} year metrics)`);
  }

  console.log(`\nDone. Seeded ${CITIES.length} cities.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

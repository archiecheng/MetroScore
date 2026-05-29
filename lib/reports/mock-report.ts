import type { CityComparisonReportDTO } from "./report-dto";

/** Demo report used on the public sample/view page. Not connected to any database. */
export const mockReport: CityComparisonReportDTO = {
  reportId: "demo-sj-cs-2024",
  purpose: "long_term_investment",
  cityA: {
    id: "san-jose-ca",
    slug: "san-jose-ca",
    name: "San Jose",
    state: "CA",
    metroName: "San Jose-Sunnyvale-Santa Clara",
    county: "Santa Clara County",
  },
  cityB: {
    id: "colorado-springs-co",
    slug: "colorado-springs-co",
    name: "Colorado Springs",
    state: "CO",
    metroName: "Colorado Springs",
    county: "El Paso County",
  },
  scores: {
    cityA: {
      overall: 5,
      affordability: 2,
      homePriceMomentum: 4,
      populationMomentum: 3,
      rentYield: 6,
      jobIncome: 9,
      risk: 7,
    },
    cityB: {
      overall: 7,
      affordability: 7,
      homePriceMomentum: 7,
      populationMomentum: 8,
      rentYield: 7,
      jobIncome: 6,
      risk: 3,
    },
  },
  recommendation: {
    winner: "cityB",
    summary:
      "Colorado Springs offers a compelling combination of affordability, population growth, and lower risk that makes it the stronger choice for long-term investment. San Jose's world-class income and job market are real — but already fully priced into housing.",
    keyTakeaways: [
      "Colorado Springs home prices are ~60% lower than San Jose, with stronger YoY appreciation momentum over 5 years",
      "San Jose leads significantly on income and tech-sector job quality, but that premium is already priced into housing",
      "Colorado Springs population is growing 2× faster, underpinning long-term rental and resale demand",
      "San Jose carries significantly higher natural disaster risk — major seismic exposure on the Hayward Fault",
      "Rent yield is comparable in both cities; Colorado Springs has a far lower capital requirement to enter",
    ],
  },
  charts: {
    // Safety score = 11 - risk, so radar points outward meaning "better" for all metrics
    radar: [
      { metric: "Affordability", cityA: 2, cityB: 7 },
      { metric: "Home Price Growth", cityA: 4, cityB: 7 },
      { metric: "Population Growth", cityA: 3, cityB: 8 },
      { metric: "Rent Yield", cityA: 6, cityB: 7 },
      { metric: "Job & Income", cityA: 9, cityB: 6 },
      { metric: "Safety", cityA: 4, cityB: 8 },
    ],
    // Median home price in $thousands
    homePriceTrend: [
      { year: 2019, cityA: 900, cityB: 320 },
      { year: 2020, cityA: 955, cityB: 350 },
      { year: 2021, cityA: 1105, cityB: 415 },
      { year: 2022, cityA: 1250, cityB: 465 },
      { year: 2023, cityA: 1180, cityB: 440 },
      { year: 2024, cityA: 1155, cityB: 452 },
    ],
    // Population in thousands
    populationTrend: [
      { year: 2019, cityA: 1022, cityB: 478 },
      { year: 2020, cityA: 1009, cityB: 487 },
      { year: 2021, cityA: 1010, cityB: 500 },
      { year: 2022, cityA: 1000, cityB: 516 },
      { year: 2023, cityA: 1022, cityB: 525 },
      { year: 2024, cityA: 1030, cityB: 533 },
    ],
  },
  risks: [
    {
      title: "High Seismic Activity — Hayward Fault Proximity",
      severity: "high",
      city: "cityA",
      explanation:
        "San Jose sits within 15 miles of the Hayward Fault, one of the most dangerous fault lines in the U.S. Properties require earthquake insurance and may face significant structural risk in a major event.",
    },
    {
      title: "Population Outflow & Affordability Pressure",
      severity: "medium",
      city: "cityA",
      explanation:
        "San Jose's median home price exceeds $1.1M, driving net domestic out-migration. The high cost of living may constrain long-term rental demand as remote work reduces location lock-in.",
    },
    {
      title: "Water Scarcity & Drought Exposure",
      severity: "medium",
      city: "cityB",
      explanation:
        "Colorado Springs relies partly on snowpack-fed reservoirs. Prolonged drought years could drive infrastructure costs, raise utility expenses, and constrain new residential development.",
    },
    {
      title: "Military Base Concentration Risk",
      severity: "low",
      city: "cityB",
      explanation:
        "Fort Carson and the Air Force Academy represent a notable share of Colorado Springs employment. Federal budget cuts could affect local job growth and housing demand from military personnel.",
    },
  ],
  opportunities: [
    {
      title: "Luxury Rental Market — High-Income Renter Pool",
      city: "cityA",
      explanation:
        "San Jose's tech workforce supports strong rental demand at the premium end ($3,500–$5,500/mo). Well-located multi-family properties near employment corridors can achieve stable, high-yield cash flow.",
    },
    {
      title: "Below-Average Entry Price with Sustained Appreciation",
      city: "cityB",
      explanation:
        "Colorado Springs median home prices remain below the national average while appreciation has outpaced it for five consecutive years — a rare combination giving investors both value and momentum.",
    },
    {
      title: "Defense & Cybersecurity Sector Diversification",
      city: "cityB",
      explanation:
        "The city has attracted cybersecurity firms and space-tech startups alongside established defense contractors, diversifying its employment base and broadening the qualified renter pool.",
    },
  ],
  sources: [
    {
      metric: "Median Home Price",
      sourceName: "Zillow Research",
      sourceUrl: "https://www.zillow.com/research/data/",
      year: 2024,
    },
    {
      metric: "Population Estimates",
      sourceName: "U.S. Census Bureau",
      sourceUrl: "https://www.census.gov/programs-surveys/popest.html",
      year: 2024,
    },
    {
      metric: "Median Household Income",
      sourceName: "American Community Survey (ACS 5-Year)",
      sourceUrl: "https://www.census.gov/programs-surveys/acs",
      year: 2023,
    },
    {
      metric: "Unemployment & Job Growth",
      sourceName: "Bureau of Labor Statistics (BLS)",
      sourceUrl: "https://www.bls.gov/lau/",
      year: 2024,
    },
    {
      metric: "Natural Hazard & Seismic Risk",
      sourceName: "FEMA National Risk Index",
      sourceUrl: "https://hazards.fema.gov/nri/",
      year: 2023,
    },
    {
      metric: "Median Rent",
      sourceName: "Apartment List Rent Report",
      year: 2024,
      note: "Based on median 1-bedroom asking rents",
    },
  ],
  generatedAt: "2024-11-15T10:30:00.000Z",
};

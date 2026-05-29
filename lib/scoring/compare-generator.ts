import type { CityScore } from "./types";
import type { RawMetricsInput } from "./types";
import type { Recommendation, ReportPurpose, Opportunity } from "@/lib/reports/report-dto";

interface CityLabel {
  name: string;
  state: string;
}

type CitySlot = "cityA" | "cityB";

const PURPOSE_LABELS: Record<ReportPurpose, string> = {
  move: "relocation",
  primary_home: "a primary home purchase",
  rental_investment: "rental investment",
  long_term_investment: "long-term investment",
};

// ---------------------------------------------------------------------------
// Winner logic
// ---------------------------------------------------------------------------

function pickWinner(
  scoreA: CityScore,
  scoreB: CityScore,
): "cityA" | "cityB" | "mixed" {
  const diff = scoreA.overall - scoreB.overall;
  if (diff >= 1.5) return "cityA";
  if (diff <= -1.5) return "cityB";
  return "mixed";
}

// ---------------------------------------------------------------------------
// Summary paragraph
// ---------------------------------------------------------------------------

function buildSummary(
  cityA: CityLabel,
  cityB: CityLabel,
  scoreA: CityScore,
  scoreB: CityScore,
  purpose: ReportPurpose,
): string {
  const winner = pickWinner(scoreA, scoreB);
  const purposeLabel = PURPOSE_LABELS[purpose];

  if (winner === "cityA") {
    const lead = scoreA.overall - scoreB.overall;
    return `${cityA.name}, ${cityA.state} scores ${scoreA.overall}/10 overall versus ${scoreB.overall}/10 for ${cityB.name}, ${cityB.state} — a ${lead.toFixed(1)}-point lead — making it the stronger choice for ${purposeLabel}. ${citySummaryLine(cityA, cityB, scoreA, scoreB)}`;
  }

  if (winner === "cityB") {
    const lead = scoreB.overall - scoreA.overall;
    return `${cityB.name}, ${cityB.state} scores ${scoreB.overall}/10 overall versus ${scoreA.overall}/10 for ${cityA.name}, ${cityA.state} — a ${lead.toFixed(1)}-point lead — making it the stronger choice for ${purposeLabel}. ${citySummaryLine(cityB, cityA, scoreB, scoreA)}`;
  }

  return `${cityA.name}, ${cityA.state} and ${cityB.name}, ${cityB.state} score ${scoreA.overall}/10 and ${scoreB.overall}/10 respectively — close enough that the right choice depends on your specific priorities for ${purposeLabel}. ${mixedSummaryLine(cityA, cityB, scoreA, scoreB)}`;
}

function citySummaryLine(
  winner: CityLabel,
  loser: CityLabel,
  ws: CityScore,
  ls: CityScore,
): string {
  const winnerStrengths: string[] = [];
  const loserStrengths: string[] = [];

  if (ws.affordability - ls.affordability >= 2) winnerStrengths.push("housing affordability");
  if (ws.populationMomentum - ls.populationMomentum >= 2) winnerStrengths.push("population momentum");
  if (ws.jobIncome - ls.jobIncome >= 2) winnerStrengths.push("job market strength");
  if (ws.rentYield - ls.rentYield >= 2) winnerStrengths.push("rent yield");
  if (ls.risk - ws.risk >= 2) winnerStrengths.push("lower risk profile");

  if (ls.affordability - ws.affordability >= 2) loserStrengths.push("income levels");
  if (ls.jobIncome - ws.jobIncome >= 2) loserStrengths.push("income levels");

  const strengthText =
    winnerStrengths.length > 0
      ? `${winner.name} leads on ${winnerStrengths.slice(0, 2).join(" and ")}`
      : `${winner.name} holds an edge across multiple dimensions`;

  const loserText =
    loserStrengths.length > 0
      ? `, while ${loser.name} retains an advantage in ${loserStrengths[0]}`
      : "";

  return `${strengthText}${loserText}.`;
}

function mixedSummaryLine(
  cityA: CityLabel,
  cityB: CityLabel,
  scoreA: CityScore,
  scoreB: CityScore,
): string {
  const aStrengths: string[] = [];
  const bStrengths: string[] = [];

  if (scoreA.jobIncome - scoreB.jobIncome >= 2) aStrengths.push("income");
  if (scoreA.affordability - scoreB.affordability >= 2) aStrengths.push("affordability");
  if (scoreA.populationMomentum - scoreB.populationMomentum >= 2) aStrengths.push("growth momentum");

  if (scoreB.jobIncome - scoreA.jobIncome >= 2) bStrengths.push("income");
  if (scoreB.affordability - scoreA.affordability >= 2) bStrengths.push("affordability");
  if (scoreB.populationMomentum - scoreA.populationMomentum >= 2) bStrengths.push("growth momentum");

  if (aStrengths.length > 0 && bStrengths.length > 0) {
    return `${cityA.name} leads on ${aStrengths[0]}, while ${cityB.name} has an edge in ${bStrengths[0]}.`;
  }
  return "Review the dimension breakdown below to find the best fit for your goals.";
}

// ---------------------------------------------------------------------------
// Key takeaways
// ---------------------------------------------------------------------------

function buildTakeaways(
  cityA: CityLabel,
  cityB: CityLabel,
  scoreA: CityScore,
  scoreB: CityScore,
  inputsA: RawMetricsInput,
  inputsB: RawMetricsInput,
): string[] {
  const takeaways: string[] = [];

  // Affordability
  const affDiff = Math.abs(scoreA.affordability - scoreB.affordability);
  if (affDiff >= 2) {
    const [better, worse, bInputs, wInputs] =
      scoreA.affordability > scoreB.affordability
        ? [cityA, cityB, inputsA, inputsB]
        : [cityB, cityA, inputsB, inputsA];

    if (bInputs.pti != null && wInputs.pti != null) {
      takeaways.push(
        `${better.name} is meaningfully more affordable — PTI ${bInputs.pti.toFixed(1)}× vs ${wInputs.pti.toFixed(1)}× in ${worse.name}`,
      );
    } else {
      takeaways.push(`${better.name} scores significantly higher on housing affordability`);
    }
  }

  // Population momentum
  const popDiff = Math.abs(scoreA.populationMomentum - scoreB.populationMomentum);
  if (popDiff >= 2) {
    const [better, worse, bInputs] =
      scoreA.populationMomentum > scoreB.populationMomentum
        ? [cityA, cityB, inputsA]
        : [cityB, cityA, inputsB];

    const rateStr =
      bInputs.popGrowthRate != null
        ? ` (${bInputs.popGrowthRate.toFixed(1)}%/yr)`
        : "";
    takeaways.push(
      `${better.name} has stronger population momentum${rateStr}, supporting long-term housing demand versus ${worse.name}`,
    );
  }

  // Job & income
  const jobDiff = Math.abs(scoreA.jobIncome - scoreB.jobIncome);
  if (jobDiff >= 2) {
    const [better, worse, bInputs] =
      scoreA.jobIncome > scoreB.jobIncome
        ? [cityA, cityB, inputsA]
        : [cityB, cityA, inputsB];

    const incomeStr =
      bInputs.medianIncome != null
        ? ` (median income $${(bInputs.medianIncome / 1000).toFixed(0)}k)`
        : "";
    takeaways.push(
      `${better.name} leads on job market and income quality${incomeStr} versus ${worse.name}`,
    );
  }

  // Rent yield
  const yieldDiff = Math.abs(scoreA.rentYield - scoreB.rentYield);
  if (yieldDiff >= 2) {
    const [better, worse, bInputs] =
      scoreA.rentYield > scoreB.rentYield
        ? [cityA, cityB, inputsA]
        : [cityB, cityA, inputsB];

    const yieldStr =
      bInputs.rentYieldDecimal != null
        ? ` (~${(bInputs.rentYieldDecimal * 100).toFixed(1)}% gross yield)`
        : "";
    takeaways.push(
      `${better.name} offers a better rent yield${yieldStr} for buy-and-hold investors compared to ${worse.name}`,
    );
  }

  // Risk comparison
  const riskDiff = Math.abs(scoreA.risk - scoreB.risk);
  if (riskDiff >= 2) {
    const [safer, riskier] =
      scoreA.risk < scoreB.risk ? [cityA, cityB] : [cityB, cityA];
    takeaways.push(
      `${safer.name} carries a lower overall risk profile than ${riskier.name}`,
    );
  }

  // Home price momentum
  const hpDiff = Math.abs(scoreA.homePriceMomentum - scoreB.homePriceMomentum);
  if (hpDiff >= 2 && takeaways.length < 5) {
    const [better, worse] =
      scoreA.homePriceMomentum > scoreB.homePriceMomentum
        ? [cityA, cityB]
        : [cityB, cityA];
    takeaways.push(
      `${better.name} shows healthier home price appreciation momentum versus ${worse.name}`,
    );
  }

  if (takeaways.length === 0) {
    takeaways.push(
      `${cityA.name} and ${cityB.name} are closely matched — the best choice depends on your specific priorities`,
    );
  }

  return takeaways.slice(0, 5);
}

// ---------------------------------------------------------------------------
// Opportunities
// ---------------------------------------------------------------------------

export function generateOpportunities(
  cityA: CityLabel,
  cityB: CityLabel,
  scoreA: CityScore,
  scoreB: CityScore,
  inputsA: RawMetricsInput,
  inputsB: RawMetricsInput,
): Opportunity[] {
  const ops: Opportunity[] = [];

  function addOp(city: CityLabel, slot: CitySlot, title: string, explanation: string) {
    ops.push({ title, city: slot, explanation });
  }

  const pairs: Array<[CityLabel, CitySlot, CityScore, RawMetricsInput]> = [
    [cityA, "cityA", scoreA, inputsA],
    [cityB, "cityB", scoreB, inputsB],
  ];

  for (const [city, slot, score, inputs] of pairs) {
    if (score.rentYield >= 6) {
      const yieldStr =
        inputs.rentYieldDecimal != null
          ? ` (~${(inputs.rentYieldDecimal * 100).toFixed(1)}% gross yield)`
          : "";
      addOp(
        city,
        slot,
        `Buy-and-Hold Rental Opportunity in ${city.name}`,
        `${city.name} offers above-average rent yield${yieldStr}, making it attractive for investors seeking cash-flow properties relative to acquisition cost.`,
      );
    }

    if (score.populationMomentum >= 7 && score.affordability >= 5) {
      addOp(
        city,
        slot,
        `Growth Market Entry in ${city.name}`,
        `Strong population momentum combined with reasonable affordability creates a favorable window for entry before sustained appreciation compounds prices further.`,
      );
    }

    if (score.jobIncome >= 7 && score.affordability <= 4) {
      addOp(
        city,
        slot,
        `High-Income Renter Pool in ${city.name}`,
        `${city.name}'s strong job market and high household incomes support a qualified renter base willing to pay premium rents, even as ownership affordability is limited.`,
      );
    }

    if (score.affordability >= 7 && score.homePriceMomentum >= 6) {
      addOp(
        city,
        slot,
        `Value + Momentum Combination in ${city.name}`,
        `${city.name} is both relatively affordable and showing positive price appreciation — a rare combination that suggests upside potential without paying a bubble premium.`,
      );
    }
  }

  return ops.slice(0, 4);
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function generateComparison(
  cityA: CityLabel,
  cityB: CityLabel,
  scoreA: CityScore,
  scoreB: CityScore,
  inputsA: RawMetricsInput,
  inputsB: RawMetricsInput,
  purpose: ReportPurpose,
): Recommendation {
  return {
    winner: pickWinner(scoreA, scoreB),
    summary: buildSummary(cityA, cityB, scoreA, scoreB, purpose),
    keyTakeaways: buildTakeaways(cityA, cityB, scoreA, scoreB, inputsA, inputsB),
  };
}

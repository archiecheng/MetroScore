import type { RawMetricsInput } from "./types";
import type { RiskAlert } from "@/lib/reports/report-dto";

type CitySlot = "cityA" | "cityB";

interface CityLabel {
  name: string;
  state: string;
}

export function analyzeRisks(
  inputs: RawMetricsInput,
  city: CityLabel,
  slot: CitySlot,
): RiskAlert[] {
  const alerts: RiskAlert[] = [];
  const label = `${city.name}, ${city.state}`;

  // --- Affordability risk (PTI-based) ---
  if (inputs.pti != null) {
    if (inputs.pti > 12) {
      alerts.push({
        title: "Extreme Housing Unaffordability",
        severity: "high",
        city: slot,
        explanation: `${label}'s median home price is ${inputs.pti.toFixed(1)}× the median household income — well above the 5× threshold considered affordable. This significantly limits the buyer pool and increases price-drop vulnerability.`,
      });
    } else if (inputs.pti > 8) {
      alerts.push({
        title: "High Price-to-Income Ratio",
        severity: "medium",
        city: slot,
        explanation: `At ${inputs.pti.toFixed(1)}× income, ${label} home prices strain local affordability. Demand may weaken if interest rates stay elevated.`,
      });
    }
  }

  // --- Population decline ---
  if (inputs.popGrowthRate != null && inputs.popGrowthRate < -0.5) {
    const severity: RiskAlert["severity"] = inputs.popGrowthRate < -1.5 ? "high" : "medium";
    alerts.push({
      title: "Population Decline",
      severity,
      city: slot,
      explanation: `${label} is experiencing population contraction (${inputs.popGrowthRate.toFixed(1)}%/yr), which can soften housing demand, shrink the rental pool, and pressure long-term values.`,
    });
  }

  // --- Very low rent yield ---
  if (inputs.rentYieldDecimal != null) {
    const yieldPct = inputs.rentYieldDecimal * 100;
    if (yieldPct < 2.5) {
      alerts.push({
        title: "Very Low Rent Yield",
        severity: "medium",
        city: slot,
        explanation: `Gross rent yield in ${label} is approximately ${yieldPct.toFixed(1)}%, well below the 4–5% range typically needed for positive cash flow after expenses. Investment returns depend heavily on price appreciation.`,
      });
    }
  }

  // --- Speculative home price growth ---
  if (inputs.hpGrowthRate != null && inputs.hpGrowthRate > 20) {
    alerts.push({
      title: "Speculative Home Price Surge",
      severity: "high",
      city: slot,
      explanation: `Home prices in ${label} grew ${inputs.hpGrowthRate.toFixed(1)}% — a pace historically associated with speculative bubbles. Sharp corrections are more likely after unsustainable run-ups.`,
    });
  }

  // --- Sharp home price decline ---
  if (inputs.hpGrowthRate != null && inputs.hpGrowthRate < -8) {
    alerts.push({
      title: "Significant Home Price Decline",
      severity: "medium",
      city: slot,
      explanation: `${label} home prices fell ${Math.abs(inputs.hpGrowthRate).toFixed(1)}% over the measured period. While corrections can create buying opportunities, continued declines may signal structural demand weakness.`,
    });
  }

  // --- High unemployment ---
  if (inputs.unemploymentRate != null && inputs.unemploymentRate > 8) {
    alerts.push({
      title: "Elevated Unemployment Rate",
      severity: inputs.unemploymentRate > 12 ? "high" : "medium",
      city: slot,
      explanation: `${label}'s unemployment rate of ${inputs.unemploymentRate.toFixed(1)}% is above the healthy 4–5% range, indicating labor market stress that can reduce rental demand and consumer spending.`,
    });
  }

  return alerts;
}

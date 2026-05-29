/**
 * Scoring engine unit tests — uses Node's built-in test runner (no extra deps).
 * Run with:  npx tsx --test lib/scoring/__tests__/scoring.test.ts
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  clampScore,
  scoreAffordability,
  scoreRentYield,
  scorePopulationMomentum,
  scoreHomePriceMomentum,
  scoreJobIncome,
  scoreRisk,
  calculateCityScore,
} from "../calculate-city-score";

// ---------------------------------------------------------------------------
// clampScore
// ---------------------------------------------------------------------------
describe("clampScore", () => {
  test("rounds to nearest integer", () => assert.equal(clampScore(7.4), 7));
  test("rounds up at .5", () => assert.equal(clampScore(7.5), 8));
  test("clamps below 1", () => assert.equal(clampScore(-5), 1));
  test("clamps above 10", () => assert.equal(clampScore(15), 10));
  test("1 is unchanged", () => assert.equal(clampScore(1), 1));
  test("10 is unchanged", () => assert.equal(clampScore(10), 10));
});

// ---------------------------------------------------------------------------
// scoreAffordability
// ---------------------------------------------------------------------------
describe("scoreAffordability", () => {
  test("null PTI returns fallback 5", () => assert.equal(scoreAffordability(null), 5));
  test("PTI 3 (very affordable) → 10", () => assert.equal(scoreAffordability(3), 10));
  test("PTI 15 (extreme) → 1", () => assert.equal(scoreAffordability(15), 1));
  test("PTI 9 → ~5", () => {
    const s = scoreAffordability(9);
    assert.ok(s >= 4 && s <= 6, `expected 4–6 but got ${s}`);
  });
  test("PTI below 3 does not exceed 10", () => assert.equal(scoreAffordability(1), 10));
  test("PTI 20 does not go below 1", () => assert.equal(scoreAffordability(20), 1));
});

// ---------------------------------------------------------------------------
// scoreRentYield
// ---------------------------------------------------------------------------
describe("scoreRentYield", () => {
  test("null returns fallback 5", () => assert.equal(scoreRentYield(null), 5));
  test("2% yield → 1", () => assert.equal(scoreRentYield(0.02), 1));
  test("8% yield → 10", () => assert.equal(scoreRentYield(0.08), 10));
  test("5% yield → ~5–6", () => {
    const s = scoreRentYield(0.05);
    assert.ok(s >= 5 && s <= 6, `expected 5–6 but got ${s}`);
  });
  test("yield above 8% clamped to 10", () => assert.equal(scoreRentYield(0.15), 10));
  test("yield below 2% clamped to 1", () => assert.equal(scoreRentYield(0.005), 1));
});

// ---------------------------------------------------------------------------
// scorePopulationMomentum
// ---------------------------------------------------------------------------
describe("scorePopulationMomentum", () => {
  test("null returns fallback 5", () => assert.equal(scorePopulationMomentum(null), 5));
  test("-2% → 1", () => assert.equal(scorePopulationMomentum(-2), 1));
  test("3% → 10", () => assert.equal(scorePopulationMomentum(3), 10));
  test("0% → ~4–5 (neutral)", () => {
    const s = scorePopulationMomentum(0);
    assert.ok(s >= 4 && s <= 5, `expected 4–5 but got ${s}`);
  });
  test("decline below -2% clamped to 1", () => assert.equal(scorePopulationMomentum(-5), 1));
  test("growth above 3% clamped to 10", () => assert.equal(scorePopulationMomentum(10), 10));
});

// ---------------------------------------------------------------------------
// scoreHomePriceMomentum
// ---------------------------------------------------------------------------
describe("scoreHomePriceMomentum", () => {
  test("null returns fallback 5", () => assert.equal(scoreHomePriceMomentum(null), 5));
  test("4% (healthy) → high score", () => {
    const s = scoreHomePriceMomentum(4);
    assert.ok(s >= 7 && s <= 10, `expected 7–10 but got ${s}`);
  });
  test("0% (flat) → ~5", () => {
    const s = scoreHomePriceMomentum(0);
    assert.ok(s === 5, `expected 5 but got ${s}`);
  });
  test(">22% (speculative) → 3", () => assert.equal(scoreHomePriceMomentum(25), 3));
  test("very negative → clamped to 1", () => assert.equal(scoreHomePriceMomentum(-30), 1));
  test("8% (top of healthy) → 10", () => assert.equal(scoreHomePriceMomentum(8), 10));
});

// ---------------------------------------------------------------------------
// scoreJobIncome
// ---------------------------------------------------------------------------
describe("scoreJobIncome", () => {
  test("both null → fallback 5", () => assert.equal(scoreJobIncome(null, null), 5));
  test("high income + low unemp → high score", () => {
    const s = scoreJobIncome(150_000, 2);
    assert.ok(s >= 9, `expected ≥9 but got ${s}`);
  });
  test("low income + high unemp → low score", () => {
    const s = scoreJobIncome(35_000, 14);
    assert.ok(s <= 3, `expected ≤3 but got ${s}`);
  });
});

// ---------------------------------------------------------------------------
// scoreRisk
// ---------------------------------------------------------------------------
describe("scoreRisk", () => {
  test("no data → low base risk (1)", () => {
    const r = scoreRisk({ pti: null, rentYieldDecimal: null, popGrowthRate: null, hpGrowthRate: null, medianIncome: null, unemploymentRate: null, medianHomeValue: null, medianRent: null });
    assert.equal(r, 1);
  });

  test("high PTI raises risk", () => {
    const low = scoreRisk({ pti: 4, rentYieldDecimal: 0.05, popGrowthRate: 2, hpGrowthRate: 3, medianIncome: null, unemploymentRate: null, medianHomeValue: null, medianRent: null });
    const high = scoreRisk({ pti: 14, rentYieldDecimal: 0.05, popGrowthRate: 2, hpGrowthRate: 3, medianIncome: null, unemploymentRate: null, medianHomeValue: null, medianRent: null });
    assert.ok(high > low, `high PTI should raise risk: low=${low} high=${high}`);
  });

  test("negative pop growth raises risk", () => {
    const base = scoreRisk({ pti: 6, rentYieldDecimal: 0.04, popGrowthRate: 1, hpGrowthRate: 3, medianIncome: null, unemploymentRate: null, medianHomeValue: null, medianRent: null });
    const declining = scoreRisk({ pti: 6, rentYieldDecimal: 0.04, popGrowthRate: -2, hpGrowthRate: 3, medianIncome: null, unemploymentRate: null, medianHomeValue: null, medianRent: null });
    assert.ok(declining > base, `negative pop growth should raise risk: base=${base} declining=${declining}`);
  });

  test("score never exceeds 10", () => {
    const r = scoreRisk({ pti: 20, rentYieldDecimal: 0.01, popGrowthRate: -3, hpGrowthRate: 30, medianIncome: null, unemploymentRate: null, medianHomeValue: null, medianRent: null });
    assert.ok(r <= 10, `expected ≤10 but got ${r}`);
  });
});

// ---------------------------------------------------------------------------
// calculateCityScore — integration
// ---------------------------------------------------------------------------
describe("calculateCityScore", () => {
  const sanjoseInputs = {
    pti: 8.68,
    rentYieldDecimal: 0.0317,
    popGrowthRate: 0.8,
    hpGrowthRate: -2.1,
    medianIncome: 133_000,
    unemploymentRate: 3.8,
    medianHomeValue: 1_155_000,
    medianRent: 3050,
  };

  const cospringsInputs = {
    pti: 6.15,
    rentYieldDecimal: 0.0406,
    popGrowthRate: 1.7,
    hpGrowthRate: 2.2,
    medianIncome: 74_000,
    unemploymentRate: 2.8,
    medianHomeValue: 455_000,
    medianRent: 1540,
  };

  test("all scores in [1, 10]", () => {
    const score = calculateCityScore(sanjoseInputs);
    for (const [k, v] of Object.entries(score)) {
      assert.ok(v >= 1 && v <= 10, `${k}=${v} out of range`);
    }
  });

  test("Colorado Springs overall > San Jose overall (for long_term_investment)", () => {
    const sjScore = calculateCityScore(sanjoseInputs, "long_term_investment");
    const csScore = calculateCityScore(cospringsInputs, "long_term_investment");
    assert.ok(
      csScore.overall >= sjScore.overall,
      `CS overall ${csScore.overall} should be ≥ SJ ${sjScore.overall}`,
    );
  });

  test("San Jose jobIncome > Colorado Springs jobIncome", () => {
    const sjScore = calculateCityScore(sanjoseInputs);
    const csScore = calculateCityScore(cospringsInputs);
    assert.ok(
      sjScore.jobIncome > csScore.jobIncome,
      `SJ jobIncome ${sjScore.jobIncome} should be > CS ${csScore.jobIncome}`,
    );
  });

  test("San Jose affordability < Colorado Springs affordability", () => {
    const sjScore = calculateCityScore(sanjoseInputs);
    const csScore = calculateCityScore(cospringsInputs);
    assert.ok(
      sjScore.affordability < csScore.affordability,
      `SJ affordability ${sjScore.affordability} should be < CS ${csScore.affordability}`,
    );
  });
});

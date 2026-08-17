import { describe, expect, it } from "vitest";
import { INITIAL_ENABLERS, simulateEnablerImpact, type EnablersState } from "./enablers";

describe("simulateEnablerImpact", () => {
  it("reduz onboarding e aumenta eficiência conforme enablers ativos", () => {
    const none: EnablersState = {
      sandbox: false,
      onboardingTrack: false,
      promptLibrary: false,
      qualityGates: false,
      champions: false,
      usageTelemetry: false,
    };
    const baseline = simulateEnablerImpact(none, 2.0, "Dedicado");
    const withDefaults = simulateEnablerImpact(INITIAL_ENABLERS, 2.0, "Dedicado");

    expect(withDefaults.onboardingWeeks).toBeLessThan(baseline.onboardingWeeks);
    expect(withDefaults.efficiencyGainPct).toBeGreaterThan(baseline.efficiencyGainPct);
    expect(withDefaults.activeCount).toBe(2);
  });

  it("respeita piso de onboarding e teto de eficiência", () => {
    const allOn: EnablersState = {
      sandbox: true,
      onboardingTrack: true,
      promptLibrary: true,
      qualityGates: true,
      champions: true,
      usageTelemetry: true,
    };
    const impact = simulateEnablerImpact(allOn, 3, "Lean");
    expect(impact.onboardingWeeks).toBeGreaterThanOrEqual(2);
    expect(impact.efficiencyGainPct).toBeLessThanOrEqual(45);
  });
});

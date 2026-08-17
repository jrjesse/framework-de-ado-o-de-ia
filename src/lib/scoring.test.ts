import { describe, expect, it } from "vitest";
import {
  archetypeFromTeamSize,
  averageDiagnosticScore,
  getScoreClassification,
  pilotReadinessScore,
  rolloutWavesLabel,
  scoreGargalo,
} from "./scoring";

describe("scoreGargalo", () => {
  it("aplica a fórmula Impacto×3 + (3−Esforço)×2 + Risco×2", () => {
    // impacto 3, esforço 1 (baixo → inverso 3), risco 3 → 9 + 6 + 6 = 21
    expect(scoreGargalo(3, 1, 3)).toBe(21);
    // impacto 2, esforço 2 (inverso 2), risco 2 → 6 + 4 + 4 = 14
    expect(scoreGargalo(2, 2, 2)).toBe(14);
    // impacto 1, esforço 3 (inverso 1), risco 1 → 3 + 2 + 2 = 7
    expect(scoreGargalo(1, 3, 1)).toBe(7);
  });
});

describe("averageDiagnosticScore", () => {
  it("média das 9 dimensões", () => {
    expect(
      averageDiagnosticScore({
        q1: 1, q2: 1, q3: 1, q4: 1, q5: 1, q6: 1, q7: 1, q8: 1, q9: 1,
      })
    ).toBe(1);
    expect(
      averageDiagnosticScore({
        q1: 3, q2: 3, q3: 3, q4: 3, q5: 3, q6: 3, q7: 3, q8: 3, q9: 3,
      })
    ).toBe(3);
  });
});

describe("getScoreClassification", () => {
  it("classifica faixas BAIXO / MÉDIO / ALTO", () => {
    expect(getScoreClassification(1.5).label).toBe("BAIXO");
    expect(getScoreClassification(1.67).label).toBe("MÉDIO");
    expect(getScoreClassification(2.34).label).toBe("ALTO");
  });
});

describe("archetypeFromTeamSize", () => {
  it("mapeia Lean / Dedicado / Distribuído", () => {
    expect(archetypeFromTeamSize(10)).toBe("Lean");
    expect(archetypeFromTeamSize(15)).toBe("Lean");
    expect(archetypeFromTeamSize(16)).toBe("Dedicado");
    expect(archetypeFromTeamSize(100)).toBe("Dedicado");
    expect(archetypeFromTeamSize(101)).toBe("Distribuído");
  });
});

describe("pilotReadinessScore", () => {
  it("usa pesos 2/2/2/1/1 sobre 8", () => {
    expect(
      pilotReadinessScore({
        autonomia: 3,
        senioridade: 3,
        feedback: 3,
        seguranca: 3,
        roadmap: 3,
      })
    ).toBe(3);
    expect(
      pilotReadinessScore({
        autonomia: 2,
        senioridade: 2,
        feedback: 2,
        seguranca: 1,
        roadmap: 1,
      })
    ).toBe(1.75);
  });
});

describe("rolloutWavesLabel", () => {
  it("sugere ondas pelo tamanho do time", () => {
    expect(rolloutWavesLabel(5)).toContain("1 Onda");
    expect(rolloutWavesLabel(20)).toContain("2 Ondas");
    expect(rolloutWavesLabel(50)).toContain("3 Ondas");
    expect(rolloutWavesLabel(150)).toContain("4 Ondas");
    expect(rolloutWavesLabel(400)).toContain("5 Ondas");
  });
});

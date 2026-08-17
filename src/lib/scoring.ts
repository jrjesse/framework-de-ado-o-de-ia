import type { DiagnosticAnswers, PilotAnswers } from "../types";

export type Archetype = "Lean" | "Dedicado" | "Distribuído";
export type ScoreBand = "BAIXO" | "MÉDIO" | "ALTO";

export function scoreGargalo(impacto: number, esforco: number, risco: number): number {
  const esforcoInverso = esforco === 1 ? 3 : esforco === 2 ? 2 : 1;
  return impacto * 3 + esforcoInverso * 2 + risco * 2;
}

export function averageDiagnosticScore(answers: DiagnosticAnswers): number {
  const values = Object.values(answers);
  return parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
}

export function getScoreClassification(score: number): { label: ScoreBand; color: string } {
  if (score < 1.67) return { label: "BAIXO", color: "text-rose-600 bg-rose-50 border-rose-200" };
  if (score < 2.34) return { label: "MÉDIO", color: "text-amber-600 bg-amber-50 border-amber-200" };
  return { label: "ALTO", color: "text-indigo-600 bg-indigo-50 border-indigo-200" };
}

export function archetypeFromTeamSize(teamSize: number): Archetype {
  if (teamSize <= 15) return "Lean";
  if (teamSize > 100) return "Distribuído";
  return "Dedicado";
}

/** Score ponderado do piloto: autonomia/senioridade/feedback ×2, segurança/roadmap ×1. */
export function pilotReadinessScore(pilot: Pick<PilotAnswers, "autonomia" | "senioridade" | "feedback" | "seguranca" | "roadmap">): number {
  return parseFloat(
    (
      (pilot.autonomia * 2 +
        pilot.senioridade * 2 +
        pilot.feedback * 2 +
        pilot.seguranca * 1 +
        pilot.roadmap * 1) /
      8
    ).toFixed(2)
  );
}

export function rolloutWavesLabel(teamSize: number): string {
  if (teamSize <= 9) return "1 Onda (Duração sugerida: 4-6 semanas)";
  if (teamSize <= 29) return "2 Ondas sequenciais (6-8 semanas cada)";
  if (teamSize <= 99) return "3 Ondas sequenciais (8 semanas cada)";
  if (teamSize <= 299) return "4 Ondas sequenciais (6-10 semanas cada)";
  return "5 Ondas sequenciais (8-12 semanas cada)";
}

export function rolloutWavesCount(teamSize: number): string {
  if (teamSize <= 9) return "1 Onda";
  if (teamSize <= 29) return "2 Ondas";
  if (teamSize <= 99) return "3 Ondas";
  if (teamSize <= 299) return "4 Ondas";
  return "5 Ondas";
}

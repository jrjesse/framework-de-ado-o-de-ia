import type { Archetype } from "./scoring";

export type EnablerId =
  | "sandbox"
  | "onboardingTrack"
  | "promptLibrary"
  | "qualityGates"
  | "champions"
  | "usageTelemetry";

export type EnablersState = Record<EnablerId, boolean>;

export type EnablerDefinition = {
  id: EnablerId;
  title: string;
  desc: string;
  /** Semanas de onboarding removidas quando ativo (valor negativo). */
  onboardingDelta: number;
  /** Pontos percentuais de eficiência adicionados quando ativo. */
  efficiencyDelta: number;
};

export const AI_ENABLERS: EnablerDefinition[] = [
  {
    id: "sandbox",
    title: "Sandbox seguro de prompts",
    desc: "Ambiente isolado para experimentar assistentes sem expor PII ou IP corporativo.",
    onboardingDelta: -0.5,
    efficiencyDelta: 3,
  },
  {
    id: "onboardingTrack",
    title: "Trilha de onboarding de IA",
    desc: "Roteiro obrigatório L0→L1 com exercícios, políticas e checklist de pronto para produção.",
    onboardingDelta: -2,
    efficiencyDelta: 5,
  },
  {
    id: "promptLibrary",
    title: "Biblioteca interna de prompts",
    desc: "Templates versionados por stack e estágio do SDLC, reutilizáveis pelos squads.",
    onboardingDelta: -1,
    efficiencyDelta: 6,
  },
  {
    id: "qualityGates",
    title: "Quality gates no CI/CD",
    desc: "Checagens automatizadas de segredos, licenças e revisão humana em PRs gerados por IA.",
    onboardingDelta: -0.5,
    efficiencyDelta: 4,
  },
  {
    id: "champions",
    title: "Campeões por squad",
    desc: "Pelo menos um multiplicador L3 responsável por rituais, suporte e disseminação local.",
    onboardingDelta: -1.5,
    efficiencyDelta: 7,
  },
  {
    id: "usageTelemetry",
    title: "Telemetria de adoção",
    desc: "Métricas de uso ativo, custo de tokens e correlação com cycle time / bugs.",
    onboardingDelta: -0.5,
    efficiencyDelta: 5,
  },
];

export const INITIAL_ENABLERS: EnablersState = {
  sandbox: true,
  onboardingTrack: true,
  promptLibrary: false,
  qualityGates: false,
  champions: false,
  usageTelemetry: false,
};

export type EnablerImpact = {
  onboardingWeeks: number;
  efficiencyGainPct: number;
  baselineOnboardingWeeks: number;
  baselineEfficiencyPct: number;
  activeCount: number;
};

export function simulateEnablerImpact(
  enabled: EnablersState,
  diagnosticScore: number,
  archetype: Archetype
): EnablerImpact {
  const baselineOnboardingWeeks =
    archetype === "Lean" ? 6 : archetype === "Dedicado" ? 8 : 10;
  const baselineEfficiencyPct =
    diagnosticScore < 1.67 ? 5 : diagnosticScore < 2.34 ? 10 : 15;
  const maturityFactor =
    diagnosticScore < 1.67 ? 1.25 : diagnosticScore < 2.34 ? 1 : 0.85;

  let onboardingWeeks = baselineOnboardingWeeks * maturityFactor;
  let efficiencyGainPct = baselineEfficiencyPct;
  let activeCount = 0;

  for (const enabler of AI_ENABLERS) {
    if (!enabled[enabler.id]) continue;
    activeCount += 1;
    onboardingWeeks += enabler.onboardingDelta;
    efficiencyGainPct += enabler.efficiencyDelta;
  }

  return {
    onboardingWeeks: Math.max(2, Math.round(onboardingWeeks * 10) / 10),
    efficiencyGainPct: Math.min(45, Math.max(0, Math.round(efficiencyGainPct))),
    baselineOnboardingWeeks: Math.round(baselineOnboardingWeeks * maturityFactor * 10) / 10,
    baselineEfficiencyPct,
    activeCount,
  };
}

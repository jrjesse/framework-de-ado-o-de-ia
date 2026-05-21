export interface DiagnosticAnswers {
  q1: number; // Autonomia de Engenharia
  q2: number; // Flexibilidade Organizacional
  q3: number; // Ownership e Accountability
  q4: number; // Maturidade de Continuous Delivery
  q5: number; // Maturidade de Qualidade
  q6: number; // Velocidade de Feedback
  q7: number; // Developer Experience e Qualidade do Código
  q8: number; // Maturidade no Uso de IA
  q9: number; // Senioridade da Engenharia
}

export interface CompanyMetadata {
  companyName: string;
  teamSize: number;
  techStack: string;
  aiUsage: string;
  archetype: "Lean" | "Dedicado" | "Distribuído";
  calcScore: number;
}

export interface PilotAnswers {
  readinessScore: number;
  autonomia: number;
  senioridade: number;
  feedback: number;
  seguranca: number;
  roadmap: number;
}

export interface Gargalo {
  id: string;
  nome: string;
  trilha: "Técnica" | "Organizacional" | "Cultura";
  dimensao: string;
  impacto: number; // 1-3
  esforco: number; // 1-3 (baixo = 3, med = 2, alto = 1 no inverso)
  risco: number; // 1-3
  score: number; // (impacto*3) + (esforco_inverso*2) + (risco*2)
}

export interface SdlcCustomizations {
  template: "Conservador" | "Balanceado" | "Agressivo";
  planejamento: "none" | "experimental" | "team" | "org";
  codificacao: "none" | "experimental" | "team" | "org";
  codeReview: "none" | "experimental" | "team" | "org";
  testes: "none" | "experimental" | "team" | "org";
  deploy: "none" | "experimental" | "team" | "org";
  observabilidade: "none" | "experimental" | "team" | "org";
}

export interface GovernanceState {
  inputGuardrail: boolean;
  outputGuardrail: boolean;
  runtimeGuardrail: boolean;
  policiesChecked: Record<string, boolean>;
  standardsChecked: Record<string, boolean>;
}

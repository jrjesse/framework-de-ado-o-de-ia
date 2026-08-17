import type {
  DiagnosticAnswers,
  CompanyMetadata,
  PilotAnswers,
  Gargalo,
  SdlcCustomizations,
  GovernanceState,
} from "../types";
import { SUGGESTED_GARGALOS } from "../data";

export const STORAGE_KEYS = {
  metadata: "fa_metadata",
  answers: "fa_answers",
  pilot: "fa_pilot",
  gargalos: "fa_gargalos",
  sdlc: "fa_sdlc",
  governance: "fa_governance",
  aiPlan: "fa_ai_plan",
  proficiency: "fa_proficiency",
} as const;

export const EXPORT_VERSION = 1;

export const INITIAL_ANSWERS: DiagnosticAnswers = {
  q1: 2,
  q2: 2,
  q3: 2,
  q4: 2,
  q5: 2,
  q6: 2,
  q7: 2,
  q8: 2,
  q9: 2,
};

export const INITIAL_METADATA: CompanyMetadata = {
  companyName: "Minha Empresa",
  teamSize: 25,
  techStack: "React, Node.js, Python",
  aiUsage: "individual",
  archetype: "Dedicado",
  calcScore: 2.0,
};

export const INITIAL_PILOT: PilotAnswers = {
  readinessScore: 2.0,
  autonomia: 2,
  senioridade: 2,
  feedback: 2,
  seguranca: 2,
  roadmap: 2,
};

export const INITIAL_SDLC: SdlcCustomizations = {
  template: "Balanceado",
  planejamento: "experimental",
  codificacao: "team",
  codeReview: "experimental",
  testes: "none",
  deploy: "none",
  observabilidade: "none",
};

export const INITIAL_GOVERNANCE: GovernanceState = {
  inputGuardrail: true,
  outputGuardrail: false,
  runtimeGuardrail: false,
  policiesChecked: {},
  standardsChecked: {},
};

export const INITIAL_PROFICIENCY = { l0: 5, l1: 12, l2: 6, l3: 2 };

export function scoreGargalo(impacto: number, esforco: number, risco: number): number {
  const esforcoInverso = esforco === 1 ? 3 : esforco === 2 ? 2 : 1;
  return impacto * 3 + esforcoInverso * 2 + risco * 2;
}

export function initialGargalos(): Gargalo[] {
  return SUGGESTED_GARGALOS.map((g) => ({
    ...g,
    score: scoreGargalo(g.impacto, g.esforco, g.risco),
  }));
}

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export type FrameworkExport = {
  version: number;
  exportedAt: string;
  metadata: CompanyMetadata;
  answers: DiagnosticAnswers;
  pilot: PilotAnswers;
  gargalos: Gargalo[];
  sdlc: SdlcCustomizations;
  governance: GovernanceState;
  membersProficiency: typeof INITIAL_PROFICIENCY;
  aiPlan: string;
};

export function downloadTextFile(filename: string, content: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJson(filename: string, data: unknown) {
  downloadTextFile(filename, JSON.stringify(data, null, 2), "application/json;charset=utf-8");
}

/** Abre janela de impressão para o usuário salvar como PDF (sem dependência extra). */
export function printMarkdownAsPdf(title: string, markdown: string) {
  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const htmlBody = markdown
    .split("\n")
    .map((line) => {
      if (line.startsWith("### ")) return `<h3>${escapeHtml(line.slice(4))}</h3>`;
      if (line.startsWith("## ")) return `<h2>${escapeHtml(line.slice(3))}</h2>`;
      if (line.startsWith("# ")) return `<h1>${escapeHtml(line.slice(2))}</h1>`;
      if (line.startsWith("- ")) return `<li>${escapeHtml(line.slice(2))}</li>`;
      if (line.trim() === "") return "<br/>";
      return `<p>${escapeHtml(line)}</p>`;
    })
    .join("\n");

  const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
  if (!win) {
    throw new Error("O navegador bloqueou a janela de impressão. Permita pop-ups para baixar o PDF.");
  }

  win.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Georgia, "Times New Roman", serif; color: #111; max-width: 720px; margin: 2rem auto; line-height: 1.55; padding: 0 1rem; }
    h1 { font-size: 1.6rem; margin-top: 0; }
    h2 { font-size: 1.25rem; margin-top: 1.5rem; border-bottom: 1px solid #ddd; padding-bottom: 0.25rem; }
    h3 { font-size: 1.05rem; margin-top: 1.25rem; }
    p, li { font-size: 0.95rem; }
    li { margin-left: 1.25rem; }
    .meta { color: #555; font-size: 0.8rem; margin-bottom: 1.5rem; }
    @media print { body { margin: 0; max-width: none; } }
  </style>
</head>
<body>
  <p class="meta">Framework de Adoção de IA · Tech Leads Club</p>
  <h1>${escapeHtml(title)}</h1>
  ${htmlBody}
  <script>
    window.onload = function () {
      setTimeout(function () { window.print(); }, 250);
    };
  </script>
</body>
</html>`);
  win.document.close();
}

export function parseFrameworkExport(raw: string): FrameworkExport {
  const data = JSON.parse(raw) as FrameworkExport;
  if (!data || typeof data !== "object") {
    throw new Error("Arquivo inválido.");
  }
  if (!data.metadata || !data.answers || !data.pilot || !data.gargalos || !data.sdlc || !data.governance) {
    throw new Error("JSON incompleto: faltam campos obrigatórios do progresso.");
  }
  return data;
}

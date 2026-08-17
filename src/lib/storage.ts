import type {
  DiagnosticAnswers,
  CompanyMetadata,
  PilotAnswers,
  Gargalo,
  SdlcCustomizations,
  GovernanceState,
} from "../types";
import { SUGGESTED_GARGALOS } from "../data";
import { scoreGargalo } from "./scoring";
import type { EnablersState } from "./enablers";
import { INITIAL_ENABLERS } from "./enablers";

export { scoreGargalo } from "./scoring";
export { INITIAL_ENABLERS } from "./enablers";

export const STORAGE_KEYS = {
  metadata: "fa_metadata",
  answers: "fa_answers",
  pilot: "fa_pilot",
  gargalos: "fa_gargalos",
  sdlc: "fa_sdlc",
  governance: "fa_governance",
  aiPlan: "fa_ai_plan",
  proficiency: "fa_proficiency",
  enablers: "fa_enablers",
} as const;

export const EXPORT_VERSION = 2;

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
  enablers?: EnablersState;
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function tableCells(line: string): string[] {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.includes("-") && /^\|?[\s:-]+\|[\s:|-]*$/.test(trimmed);
}

export function markdownToPrintableHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let openListTag: "ul" | "ol" | null = null;

  const closeList = () => {
    if (openListTag) {
      out.push(`</${openListTag}>`);
      openListTag = null;
    }
  };

  const openList = (tag: "ul" | "ol") => {
    if (openListTag !== tag) {
      closeList();
      out.push(`<${tag}>`);
      openListTag = tag;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === "") {
      closeList();
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      closeList();
      out.push("<hr/>");
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      closeList();
      const level = heading[1].length;
      out.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    if (line.startsWith("|") && isTableSeparator(lines[i + 1] ?? "")) {
      closeList();
      out.push("<table><thead><tr>");
      for (const cell of tableCells(line)) {
        out.push(`<th>${inlineMarkdown(cell)}</th>`);
      }
      out.push("</tr></thead><tbody>");

      i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        out.push("<tr>");
        for (const cell of tableCells(lines[i].trim())) {
          out.push(`<td>${inlineMarkdown(cell)}</td>`);
        }
        out.push("</tr>");
        i++;
      }
      i--;

      out.push("</tbody></table>");
      continue;
    }

    const bullet = /^[-*+]\s+(.*)$/.exec(line);
    if (bullet) {
      openList("ul");
      out.push(`<li>${inlineMarkdown(bullet[1])}</li>`);
      continue;
    }

    const ordered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (ordered) {
      openList("ol");
      out.push(`<li>${inlineMarkdown(ordered[1])}</li>`);
      continue;
    }

    const quote = /^>\s?(.*)$/.exec(line);
    if (quote) {
      closeList();
      out.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`);
      continue;
    }

    closeList();
    out.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  closeList();
  return out.join("\n");
}

const PRINT_STYLES = `
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #111; line-height: 1.55; margin: 0; padding: 2rem; }
  h1 { font-size: 1.6rem; margin: 0 0 0.75rem; }
  h2 { font-size: 1.2rem; margin: 1.6rem 0 0.5rem; border-bottom: 1px solid #ddd; padding-bottom: 0.25rem; }
  h3 { font-size: 1.05rem; margin: 1.2rem 0 0.4rem; }
  h4 { font-size: 0.98rem; margin: 1rem 0 0.3rem; }
  p, li, td, th { font-size: 0.94rem; }
  p { margin: 0.5rem 0; }
  ul, ol { margin: 0.5rem 0 0.5rem 1.25rem; padding-left: 1rem; }
  li { margin: 0.25rem 0; }
  blockquote { margin: 0.75rem 0; padding-left: 0.9rem; border-left: 3px solid #ccc; color: #444; }
  code { font-family: "JetBrains Mono", Menlo, monospace; font-size: 0.85rem; background: #f3f3f5; padding: 0.1rem 0.3rem; border-radius: 3px; }
  table { border-collapse: collapse; width: 100%; margin: 0.9rem 0; }
  th, td { border: 1px solid #ddd; padding: 0.45rem 0.6rem; text-align: left; vertical-align: top; }
  th { background: #f5f5f7; }
  hr { border: 0; border-top: 1px solid #ddd; margin: 1.4rem 0; }
  .meta { color: #555; font-size: 0.78rem; margin: 0 0 1.2rem; text-transform: uppercase; letter-spacing: 0.05em; }
  h2, h3, h4 { break-after: avoid; }
  table, blockquote, li { break-inside: avoid; }
  @page { margin: 18mm 14mm; }
`;

function buildPrintableDocument(title: string, markdown: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(title)}</title>
<style>${PRINT_STYLES}</style>
</head>
<body>
<p class="meta">Framework de Adoção de IA · Tech Leads Club</p>
<h1>${escapeHtml(title)}</h1>
${markdownToPrintableHtml(markdown)}
</body>
</html>`;
}

/**
 * Renderiza o parecer em um iframe same-origin e abre o diálogo de impressão.
 * Evita bloqueio de pop-up e garante que o layout esteja pronto antes do print.
 */
export function printMarkdownAsPdf(title: string, markdown: string) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.title = title;
  iframe.style.position = "fixed";
  iframe.style.inset = "auto 0 0 auto";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";

  const previousTitle = document.title;
  let finished = false;

  const cleanup = () => {
    if (finished) return;
    finished = true;
    document.title = previousTitle;
    iframe.remove();
  };

  iframe.onload = () => {
    const frameWindow = iframe.contentWindow;
    if (!frameWindow) {
      cleanup();
      throw new Error("Não foi possível preparar o documento para impressão.");
    }

    // O nome sugerido do arquivo vem do título da página que dispara a impressão.
    document.title = title;
    frameWindow.addEventListener("afterprint", cleanup);

    requestAnimationFrame(() => {
      frameWindow.focus();
      frameWindow.print();
      // Fallback: alguns navegadores não emitem afterprint.
      setTimeout(cleanup, 60_000);
    });
  };

  document.body.appendChild(iframe);
  iframe.srcdoc = buildPrintableDocument(title, markdown);
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

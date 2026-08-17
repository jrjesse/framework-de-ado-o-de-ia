import "dotenv/config";
import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import {
  getTelemetryStats,
  parseAndRecordTelemetry,
  recordServerEvent,
} from "./telemetryStore";

// Cliente Gemini — a chave permanece apenas no servidor
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error(
        "GEMINI_API_KEY não configurada. Copie .env.example para .env e adicione sua chave."
      );
    }
    aiInstance = new GoogleGenAI({ apiKey: key });
  }
  return aiInstance;
}

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 8;
const TELEMETRY_WINDOW_MS = 60 * 1000;
const TELEMETRY_MAX = 120;
const rateHits = new Map<string, number[]>();
const telemetryHits = new Map<string, number[]>();

function allowWithinWindow(
  bucket: Map<string, number[]>,
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const recent = (bucket.get(key) || []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    bucket.set(key, recent);
    return false;
  }
  recent.push(now);
  bucket.set(key, recent);
  return true;
}

function allowRequest(ip: string): boolean {
  return allowWithinWindow(rateHits, ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
}

function allowTelemetry(ip: string): boolean {
  return allowWithinWindow(telemetryHits, ip, TELEMETRY_MAX, TELEMETRY_WINDOW_MS);
}

function clientIp(req: express.Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === "production";

  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      service: "framework-adocao-ia-sdlc",
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  app.post("/api/telemetry", (req, res) => {
    const ip = clientIp(req);
    if (!allowTelemetry(ip)) {
      return res.status(429).json({ error: "Rate limit de telemetria excedido." });
    }

    const result = parseAndRecordTelemetry(req.body);
    if (result.ok === false) {
      return res.status(400).json({ error: result.error });
    }
    return res.status(204).end();
  });

  app.get("/api/stats", (_req, res) => {
    res.json(getTelemetryStats());
  });

  app.post("/api/generate-plan", async (req, res) => {
    try {
      const ip = clientIp(req);
      if (!allowRequest(ip)) {
        recordServerEvent("generate_plan_error");
        return res.status(429).json({
          error: "Muitas gerações em pouco tempo. Aguarde alguns minutos e tente novamente.",
        });
      }

      const { answers, metadata, pilot, gargalos, sdlcCustomizations, governance, enablers, enablerImpact } =
        req.body || {};

      if (!answers || typeof answers !== "object" || !metadata || typeof metadata !== "object") {
        recordServerEvent("generate_plan_error");
        return res.status(400).json({
          error: "Payload incompleto: fields `answers` e `metadata` são obrigatórios.",
        });
      }

      recordServerEvent("generate_plan_start");
      const ai = getGeminiClient();

      const activeEnablers =
        enablers && typeof enablers === "object"
          ? Object.entries(enablers)
              .filter(([, on]) => Boolean(on))
              .map(([id]) => id)
              .join(", ") || "Nenhum"
          : "Não informado";

      const prompt = `
Você é o consultor especialista em IA da comunidade Tech Leads Club, focado em ajudar times de engenharia a adotarem IA de forma sustentável, estruturada e pragmática à escala corporativa.
Seu cliente preencheu as informações do "Framework de Adoção de IA" (que possui 7 fases sequenciais) e você precisa gerar um Relatório de Plano de Adoção Executivo altamente customizado.

DADOS DA ORGANIZAÇÃO:
- Nome da Empresa: ${metadata?.companyName || "Não informado"}
- Tamanho total da Engenharia: ${metadata?.teamSize || "Não informado"} desenvolvedores
- Arquétipo selecionado de Time Enablers: ${metadata?.archetype || "Não informado"}
- Stack Principal: ${metadata?.techStack || "Não informado"}
- Nível atual de adoção geral: ${metadata?.aiUsage || "Não informado"}

ENABLERS ATIVOS (Fase 2):
- Habilitadores ligados: ${activeEnablers}
- Onboarding estimado (simulação): ${enablerImpact?.onboardingWeeks ?? "N/A"} semanas
- Ganho de eficiência estimado: ${enablerImpact?.efficiencyGainPct ?? "N/A"}%

RESPOSTAS DO DIAGNÓSTICO DE ENGENHARIA (Fase 1):
Abaixo estão os resultados das 9 dimensões avaliadas (valores de 1.0 a 3.0), onde 1.0 é Baixo, 2.0 é Médio e 3.0 é Alto:
1. Autonomia de Engenharia: ${answers?.q1 || "Não respondido"}
2. Flexibilidade Organizacional: ${answers?.q2 || "Não respondido"}
3. Ownership e Accountability: ${answers?.q3 || "Não respondido"}
4. Maturidade de CD (Continuous Delivery): ${answers?.q4 || "Não respondido"}
5. Maturidade de Qualidade: ${answers?.q5 || "Não respondido"}
6. Velocidade de Feedback: ${answers?.q6 || "Não respondido"}
7. DX e Qualidade do Código: ${answers?.q7 || "Não respondido"}
8. Maturidade no Uso de IA: ${answers?.q8 || "Não respondido"}
9. Senioridade da Engenharia: ${answers?.q9 || "Não respondido"}

Score Geral Calculado: ${metadata?.calcScore || "Não calculado"}

AVALIAÇÃO DO TIME PILOTO (Fase 3):
- Score de Prontidão do Piloto: ${pilot?.readinessScore || "Não avaliado"} / 3.0
- Dimensões avaliadas no Piloto: Autonomia (${pilot?.autonomia || "N/A"}), Senioridade (${pilot?.senioridade || "N/A"}), Velocidade de Feedback (${pilot?.feedback || "N/A"}), Segurança Psicológica (${pilot?.seguranca || "N/A"}), Estabilidade do Roadmap (${pilot?.roadmap || "N/A"})

AVALIAÇÃO DE GARGALOS E PRIORIDADES (Fase 4):
Aqui estão os gargalos críticos identificados para resolução ordenada (Fórmula de Prioridade: Impacto*3 + Esforco*2 + Risco*2):
${gargalos?.map((g: { trilha: string; nome: string; score: number }) => `- [Trilha ${g.trilha}] ${g.nome} (Prioridade: ${g.score >= 11 ? "Crítico" : "Médio"}, Score: ${g.score})`).join("\n") || "Nenhum gargalo customizado listado."}

ESTÁGIOS DO SDLC E ADOÇÃO PROGRESSIVA (Fase 5):
Template selecionado: ${sdlcCustomizations?.template || "Não informado"}
Níveis de adoção por estágio do ciclo de desenvolvimento:
- Planejamento: ${sdlcCustomizations?.planejamento || "none"}
- Codificação: ${sdlcCustomizations?.codificacao || "none"}
- Code Review: ${sdlcCustomizations?.codeReview || "none"}
- Testes & Shift Left: ${sdlcCustomizations?.testes || "none"}
- Deploy: ${sdlcCustomizations?.deploy || "none"}
- Observabilidade: ${sdlcCustomizations?.observabilidade || "none"}

GOVERNANÇA E SEGURANÇA (Fas 6):
Políticas de Segurança e Guardrails ativos configurados pelo usuário:
- Guardrail de Input: ${governance?.inputGuardrail ? "Ativo" : "Inativo"}
- Guardrail de Output: ${governance?.outputGuardrail ? "Ativo" : "Inativo"}
- Guardrail de Runtime: ${governance?.runtimeGuardrail ? "Ativo" : "Inativo"}
- Medidas de conformidade em conformidade com OWASP LLM Top 10 aplicadas.

--------------------------------------------------
TAREFA:
Escreva um relatório de plano de adoção executivo estruturado, de cerca de 700 a 1000 palavras, em formato Markdown elegante em PORTUGUÊS.
Use títulos claros correspondentes às fases mais críticas e inclua as seções abaixo:

1. **Sumário Executivo e Diagnóstico de Maturidade**:
   - Faça uma breve análise do score geral (${metadata?.calcScore}) da empresa e classifique seu nível atual.
   - Identifique o maior gargalo operacional/cultural (baseado na dimensão de menor nota) e proponha um posicionamento macro estratégico de forma direta.

2. **Cronograma Tático de 30/60/90 Dias para o Time AI Enablers**:
   - Crie ações extremamente práticas e acionáveis para cada marco (30, 60 e 90 dias) específicas para a realidade do tamanho da engenharia do cliente (${metadata?.teamSize} engenheiros, usando as premissas do arquétipo estrutural '${metadata?.archetype}').
   - Considere os enablers ativos e a simulação de onboarding/eficiência acima.

3. **Plano de Implementação no SDLC (Fase 5)**:
   - Dê recomendações sobre quais ferramentas e dinâmicas aplicar nos estágios de maior impacto do SDLC baseado no template selecionado (${sdlcCustomizations?.template}), detalhando como avançar de forma segura do estágio de menor prontidão técnica para o próximo nível.

4. **Tratamento dos 3 Gargalos Críticos Prioritários**:
   - Ofereça estratégias de remediação para os 3 gargalos de maior prioridade listados acima.

5. **Métricas de Progresso e Conclusão (Dashboard do Rollout)**:
   - Defina 3 métricas principais de impacto técnico e produtivo (DORA + Negócio) essenciais para reportar à alta liderança e justificar de forma quantitativa o ROI da adoção.

Forneça um tom altamente profissional, técnico, pragmático e focado em resultados. Não use lero-lero motivacional, foque em conselhos acionáveis de quem já liderou isso na prática, como é tradicional no Tech Leads Club.
`;

      const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      recordServerEvent("generate_plan_success");
      res.json({ planMarkdown: response.text });
    } catch (error: unknown) {
      console.error("Erro ao gerar plano:", error);
      recordServerEvent("generate_plan_error");
      const message =
        error instanceof Error ? error.message : "Erro desconhecido ao gerar o plano de adoção.";
      res.status(500).json({ error: message });
    }
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startServer();

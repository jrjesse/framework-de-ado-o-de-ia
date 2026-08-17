import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

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

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "50mb" }));

  // API do Gemini para gerar plano customizado
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const { answers, metadata, pilot, gargalos, sdlcCustomizations, governance } = req.body;
      
      const ai = getGeminiClient();

      const prompt = `
Você é o consultor especialista em IA da comunidade Tech Leads Club, focado em ajudar times de engenharia a adotarem IA de forma sustentável, estruturada e pragmática à escala corporativa.
Seu cliente preencheu as informações do "Framework de Adoção de IA" (que possui 7 fases sequenciais) e você precisa gerar um Relatório de Plano de Adoção Executivo altamente customizado.

DADOS DA ORGANIZAÇÃO:
- Nome da Empresa: ${metadata?.companyName || "Não informado"}
- Tamanho total da Engenharia: ${metadata?.teamSize || "Não informado"} desenvolvedores
- Arquétipo selecionado de Time Enablers: ${metadata?.archetype || "Não informado"}
- Stack Principal: ${metadata?.techStack || "Não informado"}
- Nível atual de adoção geral: ${metadata?.aiUsage || "Não informado"}

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
${gargalos?.map((g: any) => `- [Trilha ${g.trilha}] ${g.nome} (Prioridade: ${g.score >= 11 ? "Crítico" : "Médio"}, Score: ${g.score})`).join("\n") || "Nenhum gargalo customizado listado."}

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

      res.json({ planMarkdown: response.text });
    } catch (error: any) {
      console.error("Erro ao gerar plano:", error);
      res.status(500).json({ error: error.message || "Erro desconhecido ao gerar o plano de adoção." });
    }
  });

  // Vite middleware setups
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startServer();

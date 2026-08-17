import { useState, useEffect, useCallback, useMemo } from "react";
import { FA_QUESTIONS } from "../data";
import type {
  DiagnosticAnswers,
  CompanyMetadata,
  PilotAnswers,
  Gargalo,
  SdlcCustomizations,
  GovernanceState,
} from "../types";
import {
  STORAGE_KEYS,
  EXPORT_VERSION,
  INITIAL_ANSWERS,
  INITIAL_METADATA,
  INITIAL_PILOT,
  INITIAL_SDLC,
  INITIAL_GOVERNANCE,
  INITIAL_PROFICIENCY,
  scoreGargalo,
  initialGargalos,
  readJson,
  downloadJson,
  downloadTextFile,
  parseFrameworkExport,
  type FrameworkExport,
} from "../lib/storage";

const LOADER_MESSAGES = [
  "Analisando métricas de autonomia e maturidade de engenharia...",
  "Correlacionando gargalos da trilha técnica e operacional...",
  "Estruturando plano tático de 30/60/90 dias...",
  "Mapeando melhores práticas para os estágios do SDLC...",
  "Integrando políticas de segurança ao pipeline de CI/CD...",
  "Finalizando o parecer técnico personalizado da comunidade Tech Leads Club...",
];

function getScoreClassification(score: number) {
  if (score < 1.67) return { label: "BAIXO", color: "text-rose-600 bg-rose-50 border-rose-200" };
  if (score < 2.34) return { label: "MÉDIO", color: "text-amber-600 bg-amber-50 border-amber-200" };
  return { label: "ALTO", color: "text-indigo-600 bg-indigo-50 border-indigo-200" };
}

export function useFrameworkState() {
  const [activeTab, setActiveTab] = useState(1);
  const [companyMetadata, setCompanyMetadata] = useState<CompanyMetadata>(() =>
    readJson(STORAGE_KEYS.metadata, INITIAL_METADATA)
  );
  const [answers, setAnswers] = useState<DiagnosticAnswers>(() =>
    readJson(STORAGE_KEYS.answers, INITIAL_ANSWERS)
  );
  const [pilot, setPilot] = useState<PilotAnswers>(() =>
    readJson(STORAGE_KEYS.pilot, INITIAL_PILOT)
  );
  const [gargalos, setGargalos] = useState<Gargalo[]>(() =>
    readJson(STORAGE_KEYS.gargalos, initialGargalos())
  );
  const [sdlc, setSdlc] = useState<SdlcCustomizations>(() =>
    readJson(STORAGE_KEYS.sdlc, INITIAL_SDLC)
  );
  const [governance, setGovernance] = useState<GovernanceState>(() =>
    readJson(STORAGE_KEYS.governance, INITIAL_GOVERNANCE)
  );
  const [membersProficiency, setMembersProficiency] = useState(() =>
    readJson(STORAGE_KEYS.proficiency, INITIAL_PROFICIENCY)
  );
  const [aiPlan, setAiPlan] = useState(() => localStorage.getItem(STORAGE_KEYS.aiPlan) || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("Avaliando o seu diagnóstico de IA...");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.metadata, JSON.stringify(companyMetadata));
  }, [companyMetadata]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(answers));
  }, [answers]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.pilot, JSON.stringify(pilot));
  }, [pilot]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.gargalos, JSON.stringify(gargalos));
  }, [gargalos]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sdlc, JSON.stringify(sdlc));
  }, [sdlc]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.governance, JSON.stringify(governance));
  }, [governance]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.proficiency, JSON.stringify(membersProficiency));
  }, [membersProficiency]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isGenerating) {
      let idx = 0;
      interval = setInterval(() => {
        setLoadingMessage(LOADER_MESSAGES[idx % LOADER_MESSAGES.length]);
        idx++;
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const scoreGeral = useMemo(
    () => parseFloat((Object.values(answers).reduce((a, b) => a + b, 0) / 9).toFixed(2)),
    [answers]
  );

  useEffect(() => {
    let calculatedArchetype: "Lean" | "Dedicado" | "Distribuído" = "Dedicado";
    if (companyMetadata.teamSize <= 15) calculatedArchetype = "Lean";
    else if (companyMetadata.teamSize > 100) calculatedArchetype = "Distribuído";

    setCompanyMetadata((prev) => ({
      ...prev,
      archetype: calculatedArchetype,
      calcScore: scoreGeral,
    }));
  }, [scoreGeral, companyMetadata.teamSize]);

  const currentClassification = getScoreClassification(scoreGeral);

  const menorDimensao = useMemo(() => {
    const keys = Object.keys(answers) as (keyof DiagnosticAnswers)[];
    let minKey = keys[0];
    let minVal = answers[minKey];
    for (const key of keys) {
      if (answers[key] < minVal) {
        minVal = answers[key];
        minKey = key;
      }
    }
    const qDetails = FA_QUESTIONS.find((q) => q.id === parseInt(minKey.replace("q", ""), 10));
    return qDetails ? qDetails.dimensaoName : "Nenhuma";
  }, [answers]);

  const totalDevsMatriz =
    membersProficiency.l0 + membersProficiency.l1 + membersProficiency.l2 + membersProficiency.l3;
  const pctL0 = totalDevsMatriz > 0 ? (membersProficiency.l0 / totalDevsMatriz) * 100 : 0;
  const pctL1Plus =
    totalDevsMatriz > 0
      ? ((membersProficiency.l1 + membersProficiency.l2 + membersProficiency.l3) / totalDevsMatriz) * 100
      : 0;
  const pctL2Plus =
    totalDevsMatriz > 0
      ? ((membersProficiency.l2 + membersProficiency.l3) / totalDevsMatriz) * 100
      : 0;
  const pctL3 = totalDevsMatriz > 0 ? (membersProficiency.l3 / totalDevsMatriz) * 100 : 0;

  const metaAproveL0 = pctL0 < 10;
  const metaAproveL1 = pctL1Plus >= 60;
  const metaAproveL2 = pctL2Plus >= 20;
  const metaAproveL3 = pctL3 >= 5;

  const handleAddGargalo = () => {
    const novoGargalo: Gargalo = {
      id: "g_usr_" + Date.now(),
      nome: "Novo gargalo operacional ou técnico identificado",
      trilha: "Técnica",
      dimensao: "Outro",
      impacto: 2,
      esforco: 2,
      risco: 2,
      score: 10,
    };
    setGargalos([...gargalos, novoGargalo]);
  };

  const handleUpdateGargalo = (
    id: string,
    field: "nome" | "trilha" | "impacto" | "esforco" | "risco",
    value: string | number
  ) => {
    setGargalos(
      gargalos.map((g) => {
        if (g.id !== id) return g;
        const temp = { ...g, [field]: value } as Gargalo;
        temp.score = scoreGargalo(temp.impacto, temp.esforco, temp.risco);
        return temp;
      })
    );
  };

  const handleRemoveGargalo = (id: string) => {
    setGargalos(gargalos.filter((g) => g.id !== id));
  };

  const handleGenerateAiPlan = async () => {
    setIsGenerating(true);
    setGenError("");
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          metadata: companyMetadata,
          pilot: {
            ...pilot,
            readinessScore: parseFloat(
              (
                (pilot.autonomia * 2 +
                  pilot.senioridade * 2 +
                  pilot.feedback * 2 +
                  pilot.seguranca * 1 +
                  pilot.roadmap * 1) /
                8
              ).toFixed(2)
            ),
          },
          gargalos: [...gargalos].sort((a, b) => b.score - a.score).slice(0, 5),
          sdlcCustomizations: sdlc,
          governance,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao comunicar com o servidor para gerar o plano.");
      }

      const data = await response.json();
      if (data.planMarkdown) {
        setAiPlan(data.planMarkdown);
        localStorage.setItem(STORAGE_KEYS.aiPlan, data.planMarkdown);
        setActiveTab(7);
      } else {
        throw new Error(data.error || "Formato de resposta inválido do servidor.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Falha inesperada ao tentar gerar o parecer técnico com inteligência artificial.";
      setGenError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearData = () => {
    if (!confirm("Deseja realmente redefinir todos os dados para o padrão do framework?")) return;
    localStorage.clear();
    setAnswers(INITIAL_ANSWERS);
    setCompanyMetadata(INITIAL_METADATA);
    setPilot(INITIAL_PILOT);
    setGargalos(initialGargalos());
    setSdlc(INITIAL_SDLC);
    setGovernance(INITIAL_GOVERNANCE);
    setMembersProficiency(INITIAL_PROFICIENCY);
    setAiPlan("");
    window.location.reload();
  };

  const applySdlcTemplate = (templateName: "Conservador" | "Balanceado" | "Agressivo") => {
    if (templateName === "Conservador") {
      setSdlc({
        template: "Conservador",
        planejamento: "none",
        codificacao: "experimental",
        codeReview: "none",
        testes: "none",
        deploy: "none",
        observabilidade: "experimental",
      });
    } else if (templateName === "Balanceado") {
      setSdlc({
        template: "Balanceado",
        planejamento: "experimental",
        codificacao: "team",
        codeReview: "experimental",
        testes: "none",
        deploy: "none",
        observabilidade: "none",
      });
    } else {
      setSdlc({
        template: "Agressivo",
        planejamento: "team",
        codificacao: "org",
        codeReview: "team",
        testes: "experimental",
        deploy: "none",
        observabilidade: "experimental",
      });
    }
  };

  const buildExportPayload = useCallback((): FrameworkExport => {
    return {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      metadata: companyMetadata,
      answers,
      pilot,
      gargalos,
      sdlc,
      governance,
      membersProficiency,
      aiPlan,
    };
  }, [companyMetadata, answers, pilot, gargalos, sdlc, governance, membersProficiency, aiPlan]);

  const handleExportProgress = () => {
    const slug = companyMetadata.companyName.replace(/\s+/g, "-").toLowerCase() || "empresa";
    downloadJson(`framework-adocao-ia-${slug}.json`, buildExportPayload());
  };

  const handleImportProgress = async (file: File) => {
    const raw = await file.text();
    const data = parseFrameworkExport(raw);
    setCompanyMetadata(data.metadata);
    setAnswers(data.answers);
    setPilot(data.pilot);
    setGargalos(data.gargalos);
    setSdlc(data.sdlc);
    setGovernance(data.governance);
    setMembersProficiency(data.membersProficiency || INITIAL_PROFICIENCY);
    setAiPlan(data.aiPlan || "");
    if (data.aiPlan) localStorage.setItem(STORAGE_KEYS.aiPlan, data.aiPlan);
    else localStorage.removeItem(STORAGE_KEYS.aiPlan);
  };

  const handleDownloadAiPlan = () => {
    if (!aiPlan) return;
    const slug = companyMetadata.companyName.replace(/\s+/g, "-").toLowerCase() || "empresa";
    downloadTextFile(`parecer-adocao-ia-${slug}.md`, aiPlan, "text/markdown;charset=utf-8");
  };

  return {
    activeTab,
    setActiveTab,
    companyMetadata,
    setCompanyMetadata,
    answers,
    setAnswers,
    pilot,
    setPilot,
    gargalos,
    setGargalos,
    sdlc,
    setSdlc,
    governance,
    setGovernance,
    membersProficiency,
    setMembersProficiency,
    aiPlan,
    isGenerating,
    genError,
    loadingMessage,
    scoreGeral,
    currentClassification,
    menorDimensao,
    totalDevsMatriz,
    pctL0,
    pctL1Plus,
    pctL2Plus,
    pctL3,
    metaAproveL0,
    metaAproveL1,
    metaAproveL2,
    metaAproveL3,
    handleAddGargalo,
    handleUpdateGargalo,
    handleRemoveGargalo,
    handleGenerateAiPlan,
    handleClearData,
    applySdlcTemplate,
    handleExportProgress,
    handleImportProgress,
    handleDownloadAiPlan,
  };
}

export type FrameworkState = ReturnType<typeof useFrameworkState>;

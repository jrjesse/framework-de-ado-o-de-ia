import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Settings,
  ShieldCheck,
  Users,
  Code2,
  ArrowRight,
  FileText,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  RefreshCw,
  Sliders,
  Play,
  Check,
  FileDown,
  Info
} from "lucide-react";
import { FA_QUESTIONS, RECOMMENDATIONS, SUGGESTED_GARGALOS, SDLC_STAGES_DETAILS, FA_POLICIES, FA_STANDARDS } from "./data";
import { DiagnosticAnswers, CompanyMetadata, PilotAnswers, Gargalo, SdlcCustomizations, GovernanceState } from "./types";

const INITIAL_ANSWERS: DiagnosticAnswers = {
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

const INITIAL_METADATA: CompanyMetadata = {
  companyName: "Minha Empresa",
  teamSize: 25,
  techStack: "React, Node.js, Python",
  aiUsage: "individual",
  archetype: "Dedicado",
  calcScore: 2.0,
};

const INITIAL_PILOT: PilotAnswers = {
  readinessScore: 2.0,
  autonomia: 2,
  senioridade: 2,
  feedback: 2,
  seguranca: 2,
  roadmap: 2,
};

const INITIAL_SDLC: SdlcCustomizations = {
  template: "Balanceado",
  planejamento: "experimental",
  codificacao: "team",
  codeReview: "experimental",
  testes: "none",
  deploy: "none",
  observabilidade: "none",
};

const INITIAL_GOVERNANCE: GovernanceState = {
  inputGuardrail: true,
  outputGuardrail: false,
  runtimeGuardrail: false,
  policiesChecked: {},
  standardsChecked: {},
};

export default function App() {
  // --- Estados do Fluxo da Jornada ---
  const [activeTab, setActiveTab] = useState<number>(1);
  const [companyMetadata, setCompanyMetadata] = useState<CompanyMetadata>(() => {
    const saved = localStorage.getItem("fa_metadata");
    return saved ? JSON.parse(saved) : INITIAL_METADATA;
  });
  const [answers, setAnswers] = useState<DiagnosticAnswers>(() => {
    const saved = localStorage.getItem("fa_answers");
    return saved ? JSON.parse(saved) : INITIAL_ANSWERS;
  });
  const [pilot, setPilot] = useState<PilotAnswers>(() => {
    const saved = localStorage.getItem("fa_pilot");
    return saved ? JSON.parse(saved) : INITIAL_PILOT;
  });
  const [gargalos, setGargalos] = useState<Gargalo[]>(() => {
    const saved = localStorage.getItem("fa_gargalos");
    if (saved) return JSON.parse(saved);
    // Inicializa com base no SUGGESTED_GARGALOS da constante
    return SUGGESTED_GARGALOS.map(g => ({
      ...g,
      score: g.impacto * 3 + (g.esforco === 1 ? 3 : g.esforco === 2 ? 2 : 1) * 2 + g.risco * 2
    }));
  });
  const [sdlc, setSdlc] = useState<SdlcCustomizations>(() => {
    const saved = localStorage.getItem("fa_sdlc");
    return saved ? JSON.parse(saved) : INITIAL_SDLC;
  });
  const [governance, setGovernance] = useState<GovernanceState>(() => {
    const saved = localStorage.getItem("fa_governance");
    return saved ? JSON.parse(saved) : INITIAL_GOVERNANCE;
  });

  // --- Estados de Estádios e Membros para Fase 2 ---
  const [membersProficiency, setMembersProficiency] = useState({
    l0: 5,
    l1: 12,
    l2: 6,
    l3: 2
  });

  // --- Estados do Gemini ---
  const [aiPlan, setAiPlan] = useState<string>(() => {
    return localStorage.getItem("fa_ai_plan") || "";
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("Avaliando o seu diagnóstico de IA...");

  const LOADER_MESSAGES = [
    "Analisando métricas de autonomia e maturidade de engenharia...",
    "Correlacionando gargalos da trilha técnica e operacional...",
    "Estruturando plano tático de 30/60/90 dias...",
    "Mapeando melhores práticas para os estágios do SDLC...",
    "Integrando políticas de segurança ao pipeline de CI/CD...",
    "Finalizando o parecer técnico personalizado da comunidade Tech Leads Club..."
  ];

  // --- Efeitos para Persistência em LocalStorage ---
  useEffect(() => {
    localStorage.setItem("fa_metadata", JSON.stringify(companyMetadata));
  }, [companyMetadata]);

  useEffect(() => {
    localStorage.setItem("fa_answers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem("fa_pilot", JSON.stringify(pilot));
  }, [pilot]);

  useEffect(() => {
    localStorage.setItem("fa_gargalos", JSON.stringify(gargalos));
  }, [gargalos]);

  useEffect(() => {
    localStorage.setItem("fa_sdlc", JSON.stringify(sdlc));
  }, [sdlc]);

  useEffect(() => {
    localStorage.setItem("fa_governance", JSON.stringify(governance));
  }, [governance]);

  // --- Efeitos do Loader ---
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      let idx = 0;
      interval = setInterval(() => {
        setLoadingMessage(LOADER_MESSAGES[idx % LOADER_MESSAGES.length]);
        idx++;
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // --- Cálculos Reativos de Métricas ---
  const scoreGeral = parseFloat((Object.values(answers).reduce((a, b) => a + b, 0) / 9).toFixed(2));
  
  // Atualiza score geral e arquétipo automaticamente
  useEffect(() => {
    let calculatedArchetype: "Lean" | "Dedicado" | "Distribuído" = "Dedicado";
    if (companyMetadata.teamSize <= 15) calculatedArchetype = "Lean";
    else if (companyMetadata.teamSize > 100) calculatedArchetype = "Distribuído";

    setCompanyMetadata(prev => ({
      ...prev,
      archetype: calculatedArchetype,
      calcScore: scoreGeral
    }));
  }, [scoreGeral, companyMetadata.teamSize]);

  // Atualizar as calibrações recomendadas de forma dinâmica
  const getScoreClassification = (score: number) => {
    if (score < 1.67) return { label: "BAIXO", color: "text-rose-600 bg-rose-50 border-rose-200" };
    if (score < 2.34) return { label: "MÉDIO", color: "text-amber-600 bg-amber-50 border-amber-200" };
    return { label: "ALTO", color: "text-indigo-600 bg-indigo-50 border-indigo-200" };
  };

  const currentClassification = getScoreClassification(scoreGeral);

  // Gargalo mais crítico (menor pontuação)
  const getMenorDimensao = () => {
    const keys: (keyof DiagnosticAnswers)[] = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9"];
    let minKey = keys[0];
    let minVal = answers[minKey];
    for (const key of keys) {
      if (answers[key] < minVal) {
        minVal = answers[key];
        minKey = key;
      }
    }
    const qDetails = FA_QUESTIONS.find(q => q.id === parseInt(minKey.replace("q", "")));
    return qDetails ? qDetails.dimensaoName : "Nenhuma";
  };

  const menorDimensao = getMenorDimensao();

  // Matriz de proficiência total de devs
  const totalDevsMatriz = membersProficiency.l0 + membersProficiency.l1 + membersProficiency.l2 + membersProficiency.l3;
  const pctL0 = totalDevsMatriz > 0 ? (membersProficiency.l0 / totalDevsMatriz) * 100 : 0;
  const pctL1Plus = totalDevsMatriz > 0 ? ((membersProficiency.l1 + membersProficiency.l2 + membersProficiency.l3) / totalDevsMatriz) * 100 : 0;
  const pctL2Plus = totalDevsMatriz > 0 ? ((membersProficiency.l2 + membersProficiency.l3) / totalDevsMatriz) * 100 : 0;
  const pctL3 = totalDevsMatriz > 0 ? (membersProficiency.l3 / totalDevsMatriz) * 100 : 0;

  const metaAproveL0 = pctL0 < 10;
  const metaAproveL1 = pctL1Plus >= 60;
  const metaAproveL2 = pctL2Plus >= 20;
  const metaAproveL3 = pctL3 >= 5;

  // --- Handlers de Ações em Gargalos ---
  const handleAddGargalo = () => {
    const novoGargalo: Gargalo = {
      id: "g_usr_" + Date.now(),
      nome: "Novo gargalo operacional ou técnico identificado",
      trilha: "Técnica",
      dimensao: "Outro",
      impacto: 2,
      esforco: 2,
      risco: 2,
      score: 10
    };
    setGargalos([...gargalos, novoGargalo]);
  };

  const handleUpdateGargalo = (id: string, field: "nome" | "trilha" | "impacto" | "esforco" | "risco", value: any) => {
    const updated = gargalos.map(g => {
      if (g.id === id) {
        const temp = { ...g, [field]: value };
        // Calcula o esforço inverso para score: esforço 1 (baixo) = 3, 2 = 2, 3 (alto) = 1
        const esforcoInverso = temp.esforco === 1 ? 3 : temp.esforco === 2 ? 2 : 1;
        temp.score = temp.impacto * 3 + esforcoInverso * 2 + temp.risco * 2;
        return temp;
      }
      return g;
    });
    setGargalos(updated);
  };

  const handleRemoveGargalo = (id: string) => {
    setGargalos(gargalos.filter(g => g.id !== id));
  };


  // --- Evento de Chamar API do Gemini para Relatório Completo ---
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
            readinessScore: parseFloat(( (pilot.autonomia*2 + pilot.senioridade*2 + pilot.feedback*2 + pilot.seguranca*1 + pilot.roadmap*1) / 8 ).toFixed(2))
          },
          gargalos: gargalos.sort((a,b) => b.score - a.score).slice(0, 5),
          sdlcCustomizations: sdlc,
          governance
        })
      });

      if (!response.ok) {
        throw new Error("Falha ao comunicar com o servidor para gerar o plano.");
      }

      const data = await response.json();
      if (data.planMarkdown) {
        setAiPlan(data.planMarkdown);
        localStorage.setItem("fa_ai_plan", data.planMarkdown);
        setActiveTab(7); // Vai automático para o relatório completo
      } else {
        throw new Error(data.error || "Formato de reposta inválido do servidor.");
      }
    } catch (err: any) {
      setGenError(err.message || "Falha inesperada ao tentar gerar o parecer técnico com inteligência artificial.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearData = () => {
    if (confirm("Deseja realmente redefinir todos os dados para o padrão do framework?")) {
      localStorage.clear();
      setAnswers(INITIAL_ANSWERS);
      setCompanyMetadata(INITIAL_METADATA);
      setPilot(INITIAL_PILOT);
      setGargalos(SUGGESTED_GARGALOS.map(g => ({
        ...g,
        score: g.impacto * 3 + (g.esforco === 1 ? 3 : g.esforco === 2 ? 2 : 1) * 2 + g.risco * 2
      })));
      setSdlc(INITIAL_SDLC);
      setGovernance(INITIAL_GOVERNANCE);
      setMembersProficiency({ l0: 5, l1: 12, l2: 6, l3: 2 });
      setAiPlan("");
      window.location.reload();
    }
  };


  // --- Handlers de Mudança do Template SDLC ---
  const applySdlcTemplate = (templateName: "Conservador" | "Balanceado" | "Agressivo") => {
    if (templateName === "Conservador") {
      setSdlc({
        template: "Conservador",
        planejamento: "none",
        codificacao: "experimental",
        codeReview: "none",
        testes: "none",
        deploy: "none",
        observabilidade: "experimental"
      });
    } else if (templateName === "Balanceado") {
      setSdlc({
        template: "Balanceado",
        planejamento: "experimental",
        codificacao: "team",
        codeReview: "experimental",
        testes: "none",
        deploy: "none",
        observabilidade: "none"
      });
    } else {
      setSdlc({
        template: "Agressivo",
        planejamento: "team",
        codificacao: "org",
        codeReview: "team",
        testes: "experimental",
        deploy: "none",
        observabilidade: "experimental"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-950">
      
      {/* HEADER DO FRAMEWORK */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-550 rounded-sm flex items-center justify-center text-white font-bold text-xs italic">TL</div>
              <span className="text-slate-900 font-bold tracking-tight text-sm">
                TECH LEADS <span className="font-normal opacity-70">CLUB</span>
              </span>
              <span className="text-xs text-slate-500">• Guia de Referência Completo v0.5</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-950 tracking-tight mt-1 flex items-center gap-2">
              Framework de Adoção de IA
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClearData}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1.5 border border-slate-200 bg-white"
            >
              <RefreshCw className="h-3 w-3" />
              Resetar Dados
            </button>
            <button
              onClick={handleGenerateAiPlan}
              disabled={isGenerating}
              className="px-4 py-1.5 text-xs font-semibold bg-indigo-650 hover:bg-indigo-700 text-white rounded-md shadow-md shadow-indigo-100 transition-all duration-150 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isGenerating ? "Gerando..." : "Gerar Plano por IA com Gemini"}
            </button>
          </div>
        </div>

        {/* MAPA DA JORNADA INTERATIVO - STEPPER */}
        <div className="border-t border-slate-200 bg-slate-900 text-slate-300 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 py-1.5 px-1 overflow-x-auto" aria-label="Tabs">
              {[
                { id: 1, name: "1. Diagnóstico" },
                { id: 2, name: "2. AI Enablers" },
                { id: 3, name: "3. Time Piloto" },
                { id: 4, name: "4. Gargalos" },
                { id: 5, name: "5. SDLC Playbook" },
                { id: 6, name: "6. Governança & Seg" },
                { id: 7, name: "7. Escala & Relatório" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-none px-3 sm:px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white border-r-4 sm:border-r-0 sm:border-b-2 border-indigo-400 font-bold shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* CONTAINER DO FLUXO GUIADO */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* CARDS COM METADATA DA EMPRESA */}
        <section className="mb-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap md:flex-nowrap items-center justify-between gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Nome da Organização</label>
              <input
                type="text"
                value={companyMetadata.companyName}
                onChange={(e) => setCompanyMetadata({ ...companyMetadata, companyName: e.target.value })}
                className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Engenharia (N° devs)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={companyMetadata.teamSize}
                  onChange={(e) => setCompanyMetadata({ ...companyMetadata, teamSize: parseInt(e.target.value) || 1 })}
                  className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Stack de Tecnologias</label>
              <input
                type="text"
                value={companyMetadata.techStack}
                onChange={(e) => setCompanyMetadata({ ...companyMetadata, techStack: e.target.value })}
                className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                placeholder="Ex. React, Java, AWS"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Nível de Uso de IA</label>
              <select
                value={companyMetadata.aiUsage}
                onChange={(e) => setCompanyMetadata({ ...companyMetadata, aiUsage: e.target.value })}
                className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="none">Inexistente/Nenhum</option>
                <option value="individual">Individual (Devs usam por conta)</option>
                <option value="squad">Squads (Times começaram pilotos)</option>
                <option value="organization">Corporativo (Homologado global)</option>
              </select>
            </div>
          </div>
        </section>

        {/* FEEDBACK DE CARREGAMENTO DO GEMINI */}
        {isGenerating && (
          <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center animate-pulse flex flex-col items-center justify-center gap-3 shadow-xs">
            <Sparkles className="h-8 w-8 text-indigo-600 animate-spin" />
            <h3 className="font-bold text-indigo-950 text-base">Gerando Plano Técnico via Gemini AI</h3>
            <p className="text-indigo-700 text-sm">{loadingMessage}</p>
            <span className="text-indigo-400 text-xs text-slate-400 mt-1">Por favor, acalme-se. O processo pode levar entre 10 a 20 segundos devido à profundidade das justificativas e métricas executadas.</span>
          </div>
        )}

        {genError && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-sm flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Erro na Geração:</span>
              <span>{genError}</span>
            </div>
          </div>
        )}

        {/* -------------------- TAB 1: DIAGNÓSTICO ORGANIZACIONAL & DE ENGENHARIA -------------------- */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Fase 1 · Diagnóstico do Nível de Prontidão da Engenharia</h2>
              <p className="text-sm text-slate-600 mb-4">
                Avalie de maneira sincera cada uma das 9 dimensões operacionais e culturais. O score geral calculated servirá como base para definir arquétipos, ferramentas ideais e identificar gargalos invisíveis no seu processo de entrega de software.
              </p>

              {/* DASHBOARD RÁPIDO DO DIAGNÓSTICO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 border border-slate-250 rounded-xl mb-6">
                <div className="bg-white p-4 border border-slate-200 rounded-lg text-center shadow-xs">
                  <span className="text-xs text-slate-500 font-medium uppercase block">Score Geral de Prontidão</span>
                  <span className="text-4xl font-extrabold text-slate-900 mt-1 inline-block">{scoreGeral}</span>
                  <span className="text-slate-400 text-xs">/ 3.0</span>
                </div>
                <div className={`p-4 border rounded-lg text-center shadow-xs flex flex-col justify-center items-center ${currentClassification.color}`}>
                  <span className="text-xs text-slate-500 font-medium uppercase block">Nível de Maturidade</span>
                  <span className="text-2xl font-bold mt-1 inline-block">{currentClassification.label}</span>
                  <span className="text-xs mt-1 block">
                    {scoreGeral < 1.67 ? "Com bloqueios significativos" : scoreGeral < 2.34 ? "Com base, mas com gaps que exigem atenção" : "Pronto para adoção acelerada!"}
                  </span>
                </div>
                <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs">
                  <span className="text-xs text-slate-500 font-medium uppercase block">Gargalo Principal Crítico</span>
                  <span className="text-lg font-bold text-slate-900 mt-2 block flex items-center gap-1.5 text-rose-700">
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                    {menorDimensao}
                  </span>
                  <span className="text-slate-500 text-xs mt-1 block">Esta dimensão recebeu a menor pontuação. Suas ações recomendadas estão priorizadas.</span>
                </div>
              </div>

              {/* PERGUNTAS INTERATIVAS */}
              <div className="space-y-6">
                {FA_QUESTIONS.map((q) => {
                  const key = `q${q.id}` as keyof DiagnosticAnswers;
                  const currentAnswer = answers[key];

                  return (
                    <div key={q.id} className="border-b border-slate-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="max-w-3xl">
                          <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                            ID-{q.id} · {q.dimensaoName}
                          </h3>
                          <p className="text-base font-semibold text-slate-900 mt-1">{q.questionText}</p>
                          <div className="mt-2 text-xs text-slate-500 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                            <strong>Mede:</strong> {q.mede} <br/>
                            <strong>Impacto na Adoção de IA:</strong> <span className="text-slate-600">{q.impacto}</span>
                          </div>
                        </div>
                      </div>
 
                      {/* Alternativas de Nível de Resposta */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { val: 1, label: "BAIXO (1.0)", text: q.opBaixo, border: "hover:border-rose-400 select-border-rose" },
                          { val: 2, label: "MÉDIO (2.0)", text: q.opMedio, border: "hover:border-amber-400 select-border-amber" },
                          { val: 3, label: "ALTO (3.0)", text: q.opAlto, border: "hover:border-indigo-400 select-border-indigo" }
                        ].map((opt) => (
                          <button
                            key={opt.val}
                            onClick={() => setAnswers({ ...answers, [key]: opt.val })}
                            className={`p-4 rounded-xl text-left border transition-all text-xs flex flex-col h-full bg-white relative ${
                              currentAnswer === opt.val
                                ? opt.val === 1
                                  ? "border-rose-500 bg-rose-50/50 ring-1 ring-rose-400"
                                  : opt.val === 2
                                  ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-400"
                                  : "border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-400"
                                : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <span className={`font-bold block tracking-wider uppercase mb-1 ${
                              currentAnswer === opt.val
                                ? opt.val === 1 ? "text-rose-700" : opt.val === 2 ? "text-amber-700" : "text-indigo-700"
                                : "text-slate-500"
                            }`}>
                              {opt.label}
                            </span>
                            <p className="text-slate-600 leading-relaxed font-normal mt-1">{opt.text}</p>
                            {currentAnswer === opt.val && (
                              <span className={`absolute top-3 right-3 rounded-full p-0.5 ${
                                opt.val === 1 ? "bg-rose-600 text-white" : opt.val === 2 ? "bg-amber-600 text-white" : "bg-indigo-600 text-white"
                              }`}>
                                <Check className="h-3.5 w-3.5" />
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
 
                      {/* Exibir Recomendações Dinâmicas para a pergunta selecionada */}
                      <div className="mt-3 bg-indigo-50/20 p-3 rounded-lg border border-indigo-600/10 flex items-start gap-2.5">
                        <Info className="h-4.5 w-4.5 text-indigo-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs font-bold text-indigo-950 block">Recomendação do Framework:</strong>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            {currentAnswer === 1 && RECOMMENDATIONS[q.dimensaoName].baixo}
                            {currentAnswer === 2 && RECOMMENDATIONS[q.dimensaoName].medio}
                            {currentAnswer === 3 && RECOMMENDATIONS[q.dimensaoName].alto}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveTab(2)}
                  className="px-5 py-2 font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-2 text-sm"
                >
                  Fase 2: Time AI Enablers
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB 2: TIME AI ENABLERS & PROFICIÊNCIA -------------------- */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="mb-6">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block">Fase 2 · Configuração do Time AI Enablers</span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">Sizing e Dimensionamento Técnico de Adoção</h2>
                <p className="text-sm text-slate-600 mt-1">
                  O Time AI Enablers é o guardião técnico da jornada. Baseado no tamanho total de sua equipe ({companyMetadata.teamSize} desenvolvedores), o sistema classificou de forma determinística seu arquétipo como <strong className="text-indigo-800">{companyMetadata.archetype}</strong>.
                </p>
              </div>

              {/* ARQUÉTIPO PRINCIPAL SIZING */}
              <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 mb-8 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">Arquétipo Estrutural</span>
                    <h3 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
                      <Users className="h-6 w-6 text-indigo-600" />
                      Time AI Enablers: {companyMetadata.archetype}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {companyMetadata.archetype === "Lean" && "Ideal para Empresas Pequenas · Sizing recomendado de 0,5 a 1 pessoa em part-time."}
                      {companyMetadata.archetype === "Dedicado" && "Ideal para Empresas Médias · Sizing recomendado de 2 a 3 pessoas dedicadas integralmente."}
                      {companyMetadata.archetype === "Distribuído" && "Industrial para Empresas Grandes · 4 a 6 pessoas centrais dedicadas mais 1 campeão oficial por squad."}
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-xs text-right">
                    <span className="text-slate-500 text-xs block">Mapeamento Técnico</span>
                    <span className="text-sm font-bold text-slate-900">
                      {companyMetadata.teamSize} devs totais na organização
                    </span>
                  </div>
                </div>

                {/* DETALHES COMPLETOS DO ARQUÉTIPO EXTRAÍDO */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs">
                    <h4 className="font-bold text-slate-900 text-sm mb-2 text-indigo-800">Responsabilidades Técnicas</h4>
                    <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed font-medium">
                      {companyMetadata.archetype === "Lean" ? (
                        <>
                          <li>Avaliar e recomendar ferramentas de IA para o contexto atual do time.</li>
                          <li>Criar roteiros simples, guias de configuração técnica e melhores práticas de prompts.</li>
                          <li>Definir limites mínimos (guardrails) de segurança (não expor PII em prompts, revisão manual obrigatória).</li>
                        </>
                      ) : companyMetadata.archetype === "Dedicado" ? (
                        <>
                          <li>Avaliar, pilotar e padronizar soluções comerciais em múltiplos times simultâneos.</li>
                          <li>Criar e manter bibliotecas internas de prompts eficientes, templates de código e integrações.</li>
                          <li>Implementar quality gates rígidos no pipeline corporativo de entrega contínua.</li>
                          <li>Definir guardrails formais priorizados por nível de gravidade técnica.</li>
                        </>
                      ) : (
                        <>
                          <li>Definir a estratégia central, orçamento global e o roadmap de adoção para toda a diretoria.</li>
                          <li>Estabelecer e auditar governança de segurança estrita e alinhamentos regulatórios em escala.</li>
                          <li>Operar infraestrutura interna avançada: servidores corporativos próprios (Model Context Protocol).</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs">
                    <h4 className="font-bold text-slate-900 text-sm mb-2 text-rose-850">Anti-Responsabilidades</h4>
                    <p className="text-xs text-slate-500 mb-2 leading-relaxed">O comitê executor central NÃO é encarregado de:</p>
                    <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed font-semibold">
                      <li>Desenvolver as features de negócios ou código no lugar do desenvolvedor final do squad.</li>
                      <li>Centralizar de forma restritiva todas as decisões de contratação de ferramentas locais.</li>
                      <li>Desmerecer ou substituir a atuação e autoridade técnica local dos Tech Leads ou EM.</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs">
                    <h4 className="font-bold text-slate-900 text-sm mb-2 text-slate-900">Rituais & Métricas de Saúde</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase block">Ritual Principal</span>
                        <p className="text-xs text-slate-700 mt-0.5 leading-relaxed font-medium">
                          {companyMetadata.archetype === "Lean" && "Check-in quinzenal rápido de 30 minutos com feedback geral."}
                          {companyMetadata.archetype === "Dedicado" && "Sincronização interna semanal de 30 minutos e cerimônia quinzenal com representantes de squads."}
                          {companyMetadata.archetype === "Distribuído" && "Sincronizações periódicas do time central, auditorias mensais de compliance e rituais quinzenal de campeões."}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase block">Métricas de Acompanhamento</span>
                        <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                          Leading: % do time usando IA ativamente, n° de experimentos. <br/>
                          Lagging: Variação de cycle time e taxa de bugs relatados em produção.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PLANO 30/60/90 DIAS DO ARQUÉTIPO */}
                <div className="mt-6 border-t border-slate-200 pt-5">
                  <h4 className="font-bold text-slate-900 text-sm mb-3">Plano de Entrada Recomendado (30/60/90 Dias)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-50/25 p-3.5 rounded-lg border border-indigo-650/10">
                      <span className="inline-flex items-center rounded-xs bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-800 mb-1">Dia 30</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        {companyMetadata.archetype === "Lean" && "Escolher 1 ou 2 ferramentas comerciais, onboarding em todos os engenheiros locais."}
                        {companyMetadata.archetype === "Dedicado" && "Estruturar o mapa de maturidade de todos os squads técnicos e priorizar 3 iniciativas chaves."}
                        {companyMetadata.archetype === "Distribuído" && "Mapear e certificar os Campeões de IA em cada squad, e levantar o heatmap técnico dos times."}
                      </p>
                    </div>
                    <div className="bg-indigo-50/25 p-3.5 rounded-lg border border-indigo-650/10">
                      <span className="inline-flex items-center rounded-xs bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-800 mb-1">Dia 60</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        {companyMetadata.archetype === "Lean" && "Levantar e documentar em repositório síncrono 2 casos de sucesso claros com métricas de ganho produtivo."}
                        {companyMetadata.archetype === "Dedicado" && "Homologar pelo menos 1 solução e garantir que 50% dos squads estejam sob uso ativamente."}
                        {companyMetadata.archetype === "Distribuído" && "Publicar a versão inicial (v1) do Framework de Governança corporativa de dados e homologar 3 ferramentas."}
                      </p>
                    </div>
                    <div className="bg-indigo-50/25 p-3.5 rounded-lg border border-indigo-650/10">
                      <span className="inline-flex items-center rounded-xs bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-800 mb-1">Dia 90</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        {companyMetadata.archetype === "Lean" && "Auditar a governança básica e rever critérios para expansão futura do time."}
                        {companyMetadata.archetype === "Dedicado" && "Gerar relatório quantitativo e consolidado de impacto e desenhar o roadmap para o trimestre subsequente."}
                        {companyMetadata.archetype === "Distribuído" && "Implantar a plataforma interna comum (servidores MCP corporativos) e receber telemetria de 60% dos squads."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* MATRIZ DE 4 NÍVEIS DE PROFICIÊNCIA */}
              <div className="border border-slate-200 rounded-xl p-6 bg-white mb-6">
                <h3 className="text-lg font-bold text-slate-950 mb-4 flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-indigo-650" />
                  Calculadora e Heatmap de Fluência Geral de IA
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">
                  De acordo com o framework do Tech Leads Club, existem 4 níveis de maturidade individual. Certificar que seu time mude de nível evita desastres ou adoções superficiais. Ajuste o número de desenvolvedores abaixo em cada estágio para avaliar compatibilidade com os critérios mínimos recomendados de escala.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { key: "l0", label: "L0 · Curioso", desc: "Ouviu falar, ainda não utiliza IA sistematicamente em suas entregas comuns.", meta: "< 10% no time" },
                    { key: "l1", label: "L1 · Aplicador", desc: "Usa IA no fluxo diário comum com boa desenvoltura em prompts padrão.", meta: ">= 60% do time piloto (gate de entrada)" },
                    { key: "l2", label: "L2 · Crítico", desc: "Equipado com senso analítico: identifica e veta bugs de IA ou alucinações de modelos.", meta: ">= 20% total na escala de equipe" },
                    { key: "l3", label: "L3 · Multiplicador", desc: "Capaz de formar, treinar outrem, policiar o uso e estruturar templates corporativos.", meta: ">= 5% total (mínimo 1 por squad)" }
                  ].map((level) => (
                    <div key={level.key} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between shadow-xs">
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">{level.label}</span>
                        <p className="text-xxs text-slate-500 mt-1 leading-relaxed">{level.desc}</p>
                        <span className="text-xxs font-bold text-indigo-700 uppercase tracking-widest block mt-2">Requisito: {level.meta}</span>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-200/60 pt-3">
                        <span className="text-xs text-slate-500 font-semibold uppercase">Quantidade:</span>
                        <input
                          type="number"
                          min="0"
                          value={membersProficiency[level.key as keyof typeof membersProficiency]}
                          onChange={(e) => setMembersProficiency({
                            ...membersProficiency,
                            [level.key]: Math.max(0, parseInt(e.target.value) || 0)
                          })}
                          className="w-16 text-center text-sm font-bold border border-slate-250 rounded-lg p-1 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-505 text-slate-900"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* PROGRESSO E VALIDAÇÃO DA META DE PROFICIÊNCIA */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl shadow-xs">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-200/80 pb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Validação com a Meta de Escala do Framework</span>
                    <span className="text-xs text-slate-400 font-medium">Total avaliado: {totalDevsMatriz} engenheiros</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Abaixo de 10% em L0 · Curiosos</span>
                        <span className={metaAproveL0 ? "text-indigo-700 font-bold" : "text-rose-700 font-bold"}>
                          {pctL0.toFixed(1)}% {metaAproveL0 ? "✓ Aprovado" : "✗ Fora da Meta"}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${metaAproveL0 ? 'bg-indigo-600' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, pctL0)}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Pelo menos 60% em L1+ · Capacitados</span>
                        <span className={metaAproveL1 ? "text-indigo-700 font-bold" : "text-rose-700 font-bold"}>
                          {pctL1Plus.toFixed(1)}% {metaAproveL1 ? "✓ Aprovado" : "✗ Fora da Meta"}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${metaAproveL1 ? 'bg-indigo-600' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, pctL1Plus)}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Pelo menos 20% em L2+ · Críticos</span>
                        <span className={metaAproveL2 ? "text-indigo-700 font-bold" : "text-rose-700 font-bold"}>
                          {pctL2Plus.toFixed(1)}% {metaAproveL2 ? "✓ Aprovado" : "✗ Fora da Meta"}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${metaAproveL2 ? 'bg-indigo-600' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, pctL2Plus)}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Pelo menos 5% em L3 · Multiplicadores</span>
                        <span className={metaAproveL3 ? "text-indigo-700 font-bold" : "text-rose-700 font-bold"}>
                          {pctL3.toFixed(1)}% {metaAproveL3 ? "✓ Aprovado" : "✗ Fora da Meta"}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${metaAproveL3 ? 'bg-indigo-600' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, pctL3)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between">
                <button
                  onClick={() => setActiveTab(1)}
                  className="px-4 py-2 text-xs font-semibold hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                >
                  Voltar para Diagnóstico
                </button>
                <button
                  onClick={() => setActiveTab(3)}
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-705 rounded-lg transition-colors inline-flex items-center gap-2 text-sm cursor-pointer"
                >
                  Fase 3: Seleção do Time Piloto
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB 3: DEFINIÇÃO DE TIME PILOTO & FERRAMENTAS -------------------- */}
        {activeTab === 3 && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="mb-6">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">Fase 3 · Definição do Time Piloto candidato</span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">Validação de Prontidão e Seleção de Tecnologia</h2>
                <p className="text-sm text-slate-600 mt-1">
                  &ldquo;O primeiro piloto deve ser feito no ambiente com maior probabilidade de sucesso — não no mais crítico, mais visível ou mais problemático.&rdquo;
                </p>
              </div>

              {/* CALCULADORA DE PRONTIDÃO DO CANDIDATO PILOTO */}
              <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 mb-8 shadow-xs">
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider mb-4 border-b border-slate-250 pb-2">
                  Questionário de Avaliação do Time Piloto
                </h3>

                <div className="space-y-5">
                  {[
                    { key: "autonomia", label: "Autonomia Técnica (Peso 2x)", desc: "O time piloto consegue tomar decisões arquiteturais e experimentar sem requisições externas?", optBaixo: "Totalmente engessado por comitês centrais", optMedio: "Autonomia padrão com exceções burocráticas", optAlto: "Completa soberania de ponta-a-ponta no squad" },
                    { key: "senioridade", label: "Senioridade Coletiva (Peso 2x)", desc: "O time possui staff/sêniores suficientes para avaliar criticamente os inputs da IA?", optBaixo: "Dominado por juniores com pouca maturidade", optMedio: "Senioridade equilibrada ou mista", optAlto: "Sêniores e staff dominam e orientam o squad" },
                    { key: "feedback", label: "Velocidade de Feedback (Peso 2x)", desc: "O pipeline de CI/CD permite loops de verificação e testes rápidos (<10 min)?", optBaixo: "Mais de 30 minutos por deploy ou build", optMedio: "Feedback médio estável in 15 minutos", optAlto: "Feedback instantâneo e CI/CD rápido" },
                    { key: "seguranca", label: "Segurança Psicológica (Peso 1x)", desc: "Os desenvolvedores se sentem seguros para falhar, reportar erros de IA e aprender?", optBaixo: "Cobranças extremas e punição em bugs", optMedio: "Ambiente equilibrado mas com medo ocasional", optAlto: "Cultura saudável de aceitação do erro" },
                    { key: "roadmap", label: "Estabilidade do Roadmap (Peso 1x)", desc: "O cronograma do time tem folga e estabilidade para suportar a carga de Onboarding?", optBaixo: "Correções constantes e roadmap instável", optMedio: "Foco dividido mas aceitável", optAlto: "Foco claro com tempo livre para inovação" }
                  ].map((field) => (
                    <div key={field.key} className="bg-white p-4 rounded-xl border border-slate-200">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                        <div>
                          <strong className="text-sm text-slate-900 block">{field.label}</strong>
                          <span className="text-xs text-slate-500 mt-1 block">{field.desc}</span>
                        </div>
                        <div className="flex bg-slate-100 p-1 border border-slate-200 rounded-lg shrink-0 overflow-x-auto gap-1">
                          {[1, 2, 3].map((val) => (
                            <button
                              key={val}
                              onClick={() => setPilot({ ...pilot, [field.key]: val })}
                              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                                pilot[field.key as keyof PilotAnswers] === val
                                  ? val === 1 ? "bg-rose-500 text-white" : val === 2 ? "bg-amber-500 text-white" : "bg-indigo-600 text-white"
                                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                              }`}
                            >
                              {val === 1 ? "Baixo" : val === 2 ? "Médio" : "Alto"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 border-t border-slate-100 pt-2 text-xxs text-slate-500 leading-normal">
                        <div><strong className="text-rose-700 uppercase font-bold block mb-0.5">Baixo</strong>{field.optBaixo}</div>
                        <div><strong className="text-amber-700 uppercase font-bold block mb-0.5">Médio</strong>{field.optMedio}</div>
                        <div><strong className="text-indigo-700 uppercase font-bold block mb-0.5">Alto</strong>{field.optAlto}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* VISUALIZAÇÃO DO SCORE PONDERADO DO PILOTO */}
                {(() => {
                  const scorePiloto = parseFloat((
                    (pilot.autonomia * 2 + pilot.senioridade * 2 + pilot.feedback * 2 + pilot.seguranca * 1 + pilot.roadmap * 1) / 8
                  ).toFixed(2));
                  const classe = scorePiloto < 1.67 ? "bg-rose-50 border-rose-200 text-rose-800" : scorePiloto < 2.34 ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-indigo-50 border-indigo-200 text-indigo-900";

                  return (
                    <div className={`mt-6 p-5 border rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm ${classe}`}>
                       <div>
                        <span className="text-xs uppercase font-bold tracking-wider opacity-85 block">Score de Prontidão do Squad</span>
                        <h4 className="text-xl font-bold mt-1">
                          O Squad de testes obteve o score de: <strong className="text-2xl font-extrabold">{scorePiloto}</strong> / 3.0
                        </h4>
                        <p className="text-xs leading-relaxed mt-2 opacity-90 max-w-3xl">
                          {scorePiloto < 1.67 && "O time possui gargalos críticos acumulados em pontos-chaves (CD, Autonomia, Senioridade). Recomendamos remediar os principais gargalos na Fase 4 antes de iniciá-lo ou escolher outro squad."}
                          {scorePiloto >= 1.67 && scorePiloto < 2.34 && "O time candidato possui uma base funcional, mas enfrentará resistência de Onboarding e de tempo. Monitoramento de perto pelos Enablers será necessário."}
                          {scorePiloto >= 2.34 && "Maturidade impecável! Este time possui as credenciais de elite ideais: loop de deploy rápido, estabilidade produtiva e sêniores prontos para mentorar os demais."}
                        </p>
                      </div>
                      <div className="bg-white border rounded-xl p-3 text-center min-w-32 shrink-0 border-slate-250 shadow-xs">
                        <span className="text-slate-500 text-xxs block uppercase">Aptidão do Time</span>
                        <span className="text-base font-bold text-slate-900 mt-1 block uppercase tracking-wide">
                          {scorePiloto >= 1.67 ? "Aprovado" : "Aviso"}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* EXEMPLOS DE FERRAMENTAS POR CATEGORIA DO GUIA */}
              <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-xs">
                <h3 className="text-base font-bold text-slate-950 mb-4 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-indigo-600" />
                  Mapeador Técnico de Ferramentas Homologadas
                </h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed font-semibold">
                  Mapeamento de principais ferramentas de inteligência artificial de acordo com as lacunas capturadas no diagnóstico:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { title: "GitHub Copilot", cat: "Codificação", desc: "Autocompletar de código em editor clássico. Recomendado para times de maturidade básica na escrita.", priority: answers.q7 === 1 },
                    { title: "Cursor", cat: "Codificação / IDE", desc: "Ambiente e chat interativo de alto nível contextual. Indicado para squads de alta autonomia.", priority: answers.q1 === 3 },
                    { title: "CodeRabbit", cat: "Revisão / PR", desc: "Auditoria contínua de PRs no GitHub. Prioritário se a velocidade de feedback for baixa.", priority: answers.q6 === 1 },
                    { title: "Notion AI / Linear", cat: "Planejamento", desc: "Extrai requisitos técnicos e organiza escopo. Ideal se a maturidade estrutural for baixa.", priority: answers.q2 === 1 },
                    { title: "Datadog IA", cat: "Monitoramento", desc: "Triagem assistida e detecção de anomalias em logs. Indicado para baixa velocidade de feedback.", priority: answers.q6 <= 2 }
                  ].map((tool, i) => (
                    <div key={i} className={`p-4 rounded-xl border flex flex-col justify-between shadow-xs ${tool.priority ? 'bg-indigo-50/30 border-indigo-200 ring-1 ring-indigo-400' : 'bg-slate-50 border-slate-200'}`}>
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-xxs font-bold text-indigo-700 uppercase tracking-widest bg-indigo-50 p-1 rounded-sm">{tool.cat}</span>
                          {tool.priority && (
                            <span className="text-xxs font-extrabold text-white bg-indigo-600 px-1 py-0.5 rounded-xs animate-pulse">Prioritário</span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">{tool.title}</h4>
                        <p className="text-xxs text-slate-600 leading-normal font-medium">{tool.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between">
                <button
                  onClick={() => setActiveTab(2)}
                  className="px-4 py-2 text-xs font-semibold hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                >
                  Voltar para Enablers
                </button>
                <button
                  onClick={() => setActiveTab(4)}
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-705 rounded-lg transition-colors inline-flex items-center gap-2 text-sm cursor-pointer"
                >
                  Fase 4: Remoção de Gargalos
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB 4: REMOÇÃO DE GARGALOS (PRIORIZAÇÃO INTERATIVA) -------------------- */}
        {activeTab === 4 && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block">Fase 4 · Processo de Priorização de Gargalos</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">Lista Editável e Matriz de Impacto, Esforço e Risco</h2>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Modifique as notas dos gargalos e ordene pela fórmula: <strong className="text-slate-950 font-bold">Score = Impacto*3 + EsforcoInverso*2 + Risco*2</strong>.
                  </p>
                </div>
                <button
                  onClick={handleAddGargalo}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-705 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5" />
                  Novo Gargalo
                </button>
              </div>

              {/* TABELA DE GARGALOS INTERATIVOS ONDE O USUÁRIO PODE CONTROLAR ANTES DA GERAÇÃO */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs mb-8 bg-white">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3.5 text-xs font-bold text-slate-550 uppercase tracking-wider">Trilha</th>
                        <th className="px-5 py-3.5 text-xs font-bold text-slate-550 uppercase tracking-wider">Descrição do Obstáculo</th>
                        <th className="px-5 py-3.5 text-xs font-bold text-slate-550 uppercase tracking-wider text-center">Impacto (X3)</th>
                        <th className="px-5 py-3.5 text-xs font-bold text-slate-550 uppercase tracking-wider text-center">Esforço (X2)</th>
                        <th className="px-5 py-3.5 text-xs font-bold text-slate-550 uppercase tracking-wider text-center">Risco (X2)</th>
                        <th className="px-5 py-3.5 text-xs font-bold text-slate-550 uppercase tracking-wider text-center">Score</th>
                        <th className="px-5 py-3.5 text-xs font-bold text-slate-550 uppercase tracking-wider text-center">Estado</th>
                        <th className="px-2 py-3.5 text-xs font-bold text-slate-550 uppercase tracking-wider text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {gargalos
                        .sort((a, b) => b.score - a.score)
                        .map((g) => (
                          <tr key={g.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-4 whitespace-nowrap">
                              <select
                                value={g.trilha}
                                onChange={(e) => handleUpdateGargalo(g.id, "trilha", e.target.value)}
                                className={`text-xxs font-extrabold tracking-widest uppercase p-1 rounded-sm border focus:outline-none ${
                                  g.trilha === "Técnica"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : g.trilha === "Organizacional"
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                <option value="Técnica">Técnica</option>
                                <option value="Organizacional">Organizacional</option>
                                <option value="Cultura">Cultura</option>
                              </select>
                            </td>
                            <td className="px-5 py-4">
                              <input
                                type="text"
                                value={g.nome}
                                onChange={(e) => handleUpdateGargalo(g.id, "nome", e.target.value)}
                                className="w-full text-xs font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-350 focus:border-indigo-500 py-1 focus:outline-none"
                              />
                              <span className="text-slate-400 text-xxs block mt-0.5 font-medium">Dimensão: {g.dimensao}</span>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <select
                                value={g.impacto}
                                onChange={(e) => handleUpdateGargalo(g.id, "impacto", parseInt(e.target.value))}
                                className="text-xs bg-slate-100 border border-slate-200 rounded-sm p-1 text-slate-900"
                              >
                                <option value="1">1 (Baixo)</option>
                                <option value="2">2 (Médio)</option>
                                <option value="3">3 (Alto)</option>
                              </select>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <select
                                value={g.esforco}
                                onChange={(e) => handleUpdateGargalo(g.id, "esforco", parseInt(e.target.value))}
                                className="text-xs bg-slate-100 border border-slate-200 rounded-sm p-1 text-slate-900"
                              >
                                <option value="1">1 (Baixo)</option>
                                <option value="2">2 (Médio)</option>
                                <option value="3">3 (Alto)</option>
                              </select>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <select
                                value={g.risco}
                                onChange={(e) => handleUpdateGargalo(g.id, "risco", parseInt(e.target.value))}
                                className="text-xs bg-slate-100 border border-slate-200 rounded-sm p-1 text-slate-900"
                              >
                                <option value="1">1 (Baixo)</option>
                                <option value="2">2 (Médio)</option>
                                <option value="3">3 (Alto)</option>
                              </select>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-center text-xs font-bold text-slate-900">
                              {g.score}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center rounded-xs px-2 py-0.5 text-xxs font-bold ${
                                g.score >= 11
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-slate-100 text-slate-700"
                                }`}>
                                {g.score >= 11 ? "Crítico" : "Médio"}
                              </span>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap text-center">
                              <button
                                onClick={() => handleRemoveGargalo(g.id)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded-sm cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MILESTONES DE REMEDIAÇÃO DO GUIA */}
              <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 shadow-xs">
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider mb-4 border-b border-slate-250 pb-2 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Estrutura de Milestones Recomendações (+30, +90, +180 Dias)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs relative overflow-hidden">
                    <span className="text-3xl font-black text-slate-100 absolute top-2 right-2">+30d</span>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Item Crítico / Quick Wins</h4>
                    <p className="text-xxs text-slate-500 mb-3">Resolução de bloqueadores fáceis e de grande atrito diário.</p>
                    <div className="space-y-2">
                      {gargalos.sort((a,b)=>b.score-a.score).filter(g => g.score >= 11).slice(0, 2).map((g, i) => (
                        <div key={i} className="bg-rose-50/50 p-2 border border-rose-200 rounded-sm text-xxs font-semibold text-rose-900">
                          {g.nome}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs relative overflow-hidden">
                    <span className="text-3xl font-black text-slate-100 absolute top-2 right-2">+90d</span>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Estruturação de Base de CD e QA</h4>
                    <p className="text-xxs text-slate-500 mb-3">Sanar debilidades de pipelines para adoção sustentável.</p>
                    <div className="space-y-2">
                      {gargalos.sort((a,b)=>b.score-a.score).filter(g => g.score >= 8 && g.score < 11).slice(0, 2).map((g, i) => (
                        <div key={i} className="bg-amber-50/50 p-2 border border-amber-200 rounded-sm text-xxs font-semibold text-amber-900">
                          {g.nome}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs relative overflow-hidden">
                    <span className="text-3xl font-black text-slate-100 absolute top-2 right-2">+180d</span>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Maturidade & Escala Organizacional</h4>
                    <p className="text-xxs text-slate-500 mb-3">Melhoria em governança sistêmica e padrões corporativos.</p>
                    <div className="space-y-2">
                      {gargalos.sort((a,b)=>b.score-a.score).filter(g => g.score < 8).slice(0, 2).map((g, i) => (
                        <div key={i} className="bg-slate-50 p-2 border border-slate-200 rounded-sm text-xxs font-semibold text-slate-900">
                          {g.nome}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between">
                <button
                  onClick={() => setActiveTab(3)}
                  className="px-4 py-2 text-xs font-semibold hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                >
                  Voltar para Time Piloto
                </button>
                <button
                  onClick={() => setActiveTab(5)}
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-705 rounded-lg transition-colors inline-flex items-center gap-2 text-sm cursor-pointer"
                >
                  Fase 5: Playbook SDLC
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB 5: ADOÇÃO PROGRESSIVA NO SDLC -------------------- */}
        {activeTab === 5 && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block">Fase 5 · Adoção Progressiva de IA no SDLC</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">Configuração Interativa do Fluxo de Trabalho (6 Estágios)</h2>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Modifique as etapas do ciclo de desenvolvimento de software em correspondência com a sua maturidade real.
                  </p>
                </div>

                {/* BOTÕES DE SELEÇÃO DINÂMICA DE TEMPLATE DO GUIA */}
                <div className="flex bg-slate-100 p-1 border border-slate-200 rounded-lg text-xs gap-1">
                  {[
                    { name: "Conservador", label: "Conservador" },
                    { name: "Balanceado", label: "Balanceado" },
                    { name: "Agressivo", label: "Agressivo" }
                  ].map((tpl) => (
                    <button
                      key={tpl.name}
                      onClick={() => applySdlcTemplate(tpl.name as any)}
                      className={`px-3 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                        sdlc.template === tpl.name
                          ? "bg-white text-indigo-950 shadow-xs border border-slate-250"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* DEFINIÇÃO DOS NÍVEIS DE ADOÇÃO (none -> experimental -> team -> org) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 6 ESTÁGIOS - CONTROLES SELETORES */}
                <div className="lg:col-span-1 space-y-4">
                  {[
                    { key: "planejamento", label: "1. Planejamento" },
                    { key: "codificacao", label: "2. Codificação" },
                    { key: "codeReview", label: "3. Code Review" },
                    { key: "testes", label: "4. Testes & Shift Left" },
                    { key: "deploy", label: "5. Deploy" },
                    { key: "observabilidade", label: "6. Observabilidade" }
                  ].map((stg) => {
                    const currentVal = sdlc[stg.key as keyof SdlcCustomizations];

                    return (
                      <div key={stg.key} className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-xs">
                        <strong className="text-xs text-slate-900 block font-bold mb-2">{stg.label}</strong>
                        <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-200/50 rounded-lg">
                          {[
                            { val: "none", label: "None" },
                            { val: "experimental", label: "Exp" },
                            { val: "team", label: "Team" },
                            { val: "org", label: "Org" }
                          ].map((opt) => (
                            <button
                              key={opt.val}
                              onClick={() => setSdlc({ ...sdlc, [stg.key]: opt.val })}
                              className={`py-1 text-center text-xxs font-bold rounded-md transition-all cursor-pointer ${
                                currentVal === opt.val
                                  ? "bg-white text-indigo-900 shadow-xs border border-slate-300"
                                  : "text-slate-500 hover:text-slate-900"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* DETAILS DE EXIBIÇÃO EM MAIS ALTO GRAU DINÂMICO PARA CADA ESTÁGIO SELECIONADO */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-850">
                    <h3 className="font-bold text-lg mb-4 text-indigo-400 flex items-center gap-1.5">
                      <Code2 className="h-5 w-5 text-indigo-400" />
                      Visualizador do Playbook Técnico Ativo
                    </h3>
                    
                    <div className="space-y-6">
                      {Object.keys(SDLC_STAGES_DETAILS).map((key) => {
                        const level = sdlc[key as keyof SdlcCustomizations];
                        const sData = SDLC_STAGES_DETAILS[key];

                        return (
                          <div key={key} className="border-b border-slate-800 pb-5 last:border-b-0 last:pb-0">
                            <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
                              <h4 className="font-bold text-sm text-slate-100">{sData.title}</h4>
                              <span className={`inline-flex items-center rounded-xs px-2 py-0.5 text-xxs font-bold uppercase tracking-widest ${
                                level === "none"
                                  ? "bg-slate-850 text-slate-300"
                                  : level === "experimental"
                                  ? "bg-blue-900/40 text-blue-300 border border-blue-800/20"
                                  : level === "team"
                                  ? "bg-amber-900/40 text-amber-300 border border-amber-800/20"
                                  : "bg-indigo-900/40 text-indigo-300 border border-indigo-800/20"
                              }`}>
                                Nível Recomendado: {level}
                              </span>
                            </div>

                            {level !== "none" ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                <div>
                                  <span className="text-xxs font-bold text-indigo-405 uppercase tracking-widest block mb-1">O que a IA executa:</span>
                                  <ul className="text-xxs text-slate-300 space-y-1 list-disc pl-4 font-normal">
                                    {sData.iaFaz.map((li, idx) => <li key={idx}>{li}</li>)}
                                  </ul>
                                </div>
                                <div>
                                  <span className="text-xxs font-bold text-rose-400 uppercase tracking-widest block mb-1">Anti-Padrões de uso:</span>
                                  <ul className="text-xxs text-slate-300 space-y-1 list-disc pl-4 font-semibold">
                                    {sData.antiPadroes.map((li, idx) => <li key={idx}>{li}</li>)}
                                  </ul>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xxs text-slate-400 mt-2 font-medium italic">IA não configurada para atuação activa nesta fase no momento.</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between">
                <button
                  onClick={() => setActiveTab(4)}
                  className="px-4 py-2 text-xs font-semibold hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                >
                  Voltar para Gargalos
                </button>
                <button
                  onClick={() => setActiveTab(6)}
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-705 rounded-lg transition-colors inline-flex items-center gap-2 text-sm cursor-pointer"
                >
                  Fase 6: Governança & Segurança
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB 6: GOVERNANÇA E CONTROLES DE SEGURANÇA -------------------- */}
        {activeTab === 6 && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="mb-6">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block">Fase 6 · Comitê de Governança, Políticas e Padronização</span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">Conformidade e Defesa Ativa contra Riscos LLM</h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Proteja sua organização aplicando processos de mitigação em sincronia com o OWASP LLM 2025.
                </p>
              </div>

              {/* SIMULADOR DE DEFESA EM 3 CAMADAS (INPUT, OUTPUT, RUNTIME) */}
              <div className="border border-slate-205 rounded-xl p-6 bg-slate-50 shadow-xs mb-8">
                <div className="flex justify-between items-center border-b border-slate-250 pb-3 mb-4 flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">Simulador de Proteção Sistêmica</span>
                    <h3 className="text-lg font-bold text-slate-950">Framework de Defesa em 3 Camadas</h3>
                  </div>
                  {/* COMPLIANCE CORE SCORE */}
                  <div className="bg-white border text-center p-2 rounded-lg border-slate-250 shrink-0 shadow-xs">
                    <span className="text-xxs text-slate-500 block uppercase font-medium">Postura de Risco</span>
                    <span className={`text-sm font-black tracking-wide ${
                      governance.inputGuardrail && governance.outputGuardrail && governance.runtimeGuardrail
                        ? "text-indigo-700" : "text-amber-700"
                    }`}>
                      {governance.inputGuardrail && governance.outputGuardrail && governance.runtimeGuardrail
                        ? "ALTA DEFESA / SEGURADO" : "VULNERABILIDADES POSSÍVEIS"
                      }
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* CAMADA 1 */}
                  <div className={`p-4 rounded-xl border bg-white shadow-xs transition-all ${governance.inputGuardrail ? 'ring-2 ring-indigo-500/50 border-indigo-350 bg-indigo-50/10' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <h4 className="font-bold text-xs text-slate-900 block tracking-wide">Camada 1 · Input Guardrails</h4>
                      <input
                        type="checkbox"
                        checked={governance.inputGuardrail}
                        onChange={(e) => setGovernance({ ...governance, inputGuardrail: e.target.checked })}
                        className="rounded-xs text-indigo-650 border-slate-350 focus:ring-indigo-500 cursor-pointer h-4 w-4"
                      />
                    </div>
                    <p className="text-xxs text-slate-500 leading-normal font-semibold mb-3">Antes de o prompt chegar ao modelo de LLM externo.</p>
                    <ul className="text-xxs text-slate-600 space-y-1.5 list-disc pl-4 font-normal">
                      <li>Sanitização automática de PII (CPF, e-mails).</li>
                      <li>Detecção de Prompt Injection simples.</li>
                      <li>Context shaping estruturado no System prompt.</li>
                    </ul>
                  </div>

                  {/* CAMADA 2 */}
                  <div className={`p-4 rounded-xl border bg-white shadow-xs transition-all ${governance.outputGuardrail ? 'ring-2 ring-indigo-500/50 border-indigo-350 bg-indigo-50/10' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <h4 className="font-bold text-xs text-slate-900 block tracking-wide">Camada 2 · Output Guardrails</h4>
                      <input
                        type="checkbox"
                        checked={governance.outputGuardrail}
                        onChange={(e) => setGovernance({ ...governance, outputGuardrail: e.target.checked })}
                        className="rounded-xs text-indigo-650 border-slate-350 focus:ring-indigo-500 cursor-pointer h-4 w-4"
                      />
                    </div>
                    <p className="text-xxs text-slate-500 leading-normal font-semibold mb-3">Antes de o output chegar ao desenvolvedor ou usuário.</p>
                    <ul className="text-xxs text-slate-600 space-y-1.5 list-disc pl-4 font-normal">
                      <li>Validação do esquema de dados estruturado (JSON/SQL).</li>
                      <li>Varredura contra credenciais vazadas e tokens.</li>
                      <li>Detecção de vazamento de System Prompt (LLM07).</li>
                    </ul>
                  </div>

                  {/* CAMADA 3 */}
                  <div className={`p-4 rounded-xl border bg-white shadow-xs transition-all ${governance.runtimeGuardrail ? 'ring-2 ring-indigo-500/50 border-indigo-350 bg-indigo-50/10' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <h4 className="font-bold text-xs text-slate-900 block tracking-wide">Camada 3 · Runtime Guardrails</h4>
                      <input
                        type="checkbox"
                        checked={governance.runtimeGuardrail}
                        onChange={(e) => setGovernance({ ...governance, runtimeGuardrail: e.target.checked })}
                        className="rounded-xs text-indigo-650 border-slate-350 focus:ring-indigo-500 cursor-pointer h-4 w-4"
                      />
                    </div>
                    <p className="text-xxs text-slate-500 leading-normal font-semibold mb-3">Durante a execução em cenários com agentes autônomos.</p>
                    <ul className="text-xxs text-slate-600 space-y-1.5 list-disc pl-4 font-normal">
                      <li>Privilégio mínimo por tool call (tokens de sessão).</li>
                      <li>Logs de auditoria obrigatórios por chamada de ferramenta.</li>
                      <li>Aprovação humana expressa (Human-in-the-loop).</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* MURAL INTERATIVO DE POLÍTICAS VIGENTES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-3">9 Diretrizes Fundamentais de Uso</h3>
                  <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                    {FA_POLICIES.map((p) => (
                      <div key={p.id} className="bg-white border border-slate-200 p-3.5 rounded-lg flex items-start gap-3 shadow-xs">
                        <input
                          type="checkbox"
                          checked={!!governance.policiesChecked[p.id]}
                          onChange={(e) => setGovernance({
                            ...governance,
                            policiesChecked: { ...governance.policiesChecked, [p.id]: e.target.checked }
                          })}
                          className="rounded-xs text-indigo-600 border-slate-300 focus:ring-indigo-500 mt-1 cursor-pointer h-4 w-4"
                        />
                        <div>
                          <strong className="text-xs text-slate-900 block font-bold leading-tight">{p.title}</strong>
                          <p className="text-xxs text-slate-600 mt-1 font-medium leading-relaxed">{p.desc}</p>
                          <div className="mt-1.5 text-slate-455 text-xxs block flex items-center gap-2 font-semibold">
                            <span>Resp: {p.resp}</span>
                            <span>•</span>
                            <span>Revisão: {p.review}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-3">7 Padrões Técnicos de Qualidade</h3>
                  <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                    {FA_STANDARDS.map((s) => (
                      <div key={s.id} className="bg-white border border-slate-200 p-3.5 rounded-lg flex items-start gap-3 shadow-xs">
                        <input
                          type="checkbox"
                          checked={!!governance.standardsChecked[s.id]}
                          onChange={(e) => setGovernance({
                            ...governance,
                            standardsChecked: { ...governance.standardsChecked, [s.id]: e.target.checked }
                          })}
                          className="rounded-xs text-indigo-600 border-slate-350 focus:ring-indigo-500 mt-1 cursor-pointer h-4 w-4"
                        />
                        <div>
                          <strong className="text-xs text-slate-900 block font-bold leading-tight">{s.title}</strong>
                          <p className="text-xxs text-slate-600 mt-1 font-medium leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between">
                <button
                  onClick={() => setActiveTab(5)}
                  className="px-4 py-2 text-xs font-semibold hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                >
                  Voltar para SDLC
                </button>
                <button
                  onClick={() => setActiveTab(7)}
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-705 rounded-lg transition-colors inline-flex items-center gap-2 text-sm cursor-pointer"
                >
                  Fase 7: Escala & Relatório Final
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB 7: ESCALA ORGANIZACIONAL, METRICAS E RELATORIO FINAL -------------------- */}
        {activeTab === 7 && (
          <div className="space-y-6 flex flex-col justify-start">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="mb-6">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block">Fase 7 · Escala Organizacional e Conclusão do Framework</span>
                <h2 className="text-2xl font-black text-slate-950 mt-1">Plano consolidado de Rollout e Métricas DORA</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Examine as métricas chave em 3 camadas e gere o seu parecer consultivo sob medida via inteligência artificial baseado nos dados de maturidade inseridos.
                </p>
              </div>

              {/* PLANO DE ONDAS SULLOUT SIZER */}
              <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 mb-8 shadow-xs">
                <h3 className="text-sm font-bold text-slate-950 uppercase mb-4 border-b border-slate-250 pb-2 flex items-center gap-1.5">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                  Estratégia Recomendada de Rollout em Ondas (Tech Leads Club)
                </h3>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h4 className="text-indigo-900 text-lg font-bold">
                      {companyMetadata.teamSize <= 9 && "1 Onda (Duração sugerida: 4-6 semanas)"}
                      {companyMetadata.teamSize > 9 && companyMetadata.teamSize <= 29 && "2 Ondas sequenciais (6-8 semanas cada)"}
                      {companyMetadata.teamSize > 29 && companyMetadata.teamSize <= 99 && "3 Ondas sequenciais (8 semanas cada)"}
                      {companyMetadata.teamSize > 99 && companyMetadata.teamSize <= 299 && "4 Ondas sequenciais (6-10 semanas cada)"}
                      {companyMetadata.teamSize > 299 && "5 Ondas sequenciais (8-12 semanas cada)"}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2 max-w-2xl font-medium">
                      {companyMetadata.teamSize <= 9 && "Estratégia: Adoção simultânea em toda a equipe pequena. A fase de piloto e escala acontecem conjuntamente devido à facilidade de controle comunicacional direta."}
                      {companyMetadata.teamSize > 9 && companyMetadata.teamSize <= 29 && "Estratégia: Onda 1 abrange 50% da equipe (times com maior nota técnica no diagnóstico anterior). Onda 2 consolida os times restantes com os playbooks validados da Onda 1."}
                      {companyMetadata.teamSize > 29 && companyMetadata.teamSize <= 99 && "Estratégia: Onda 1 é o time piloto oficial mais 1 squad parceiro adjacente. Ondas 2 e 3 de rollout geral ocorrem por ordem de afinidade técnica e prontidão comprovada dos campeões."}
                      {companyMetadata.teamSize > 99 && companyMetadata.teamSize <= 299 && "Estratégia: Onda 1 inicia apenas em squads com campeões técnicos formalmente certificados. O rollout geral subsequente ocorre em fatias por verticais inteiras de produto."}
                      {companyMetadata.teamSize > 299 && "Estratégia: Gigante escala! Rollouts segmentados por Business Units ou Grandes Domínios inteiros de arquitetura corporativa. Exige plataforma interna e MCP centrais robustos."}
                    </p>
                  </div>
                  <div className="bg-white border rounded-lg p-4 shrink-0 text-center min-w-32 shadow-xs ring-1 ring-slate-150">
                    <span className="text-slate-500 text-xxs block">N° de Ondas total</span>
                    <span className="text-3xl font-black text-indigo-900 mt-1 block">
                      {companyMetadata.teamSize <= 9 ? "1 Onda" : companyMetadata.teamSize <= 29 ? "2 Ondas" : companyMetadata.teamSize <= 99 ? "3 Ondas" : companyMetadata.teamSize <= 299 ? "4 Ondas" : "5 Ondas"}
                    </span>
                  </div>
                </div>
              </div>

              {/* LISTA DAS 9 MÉTRICAS EM 3 CAMADAS DO FRAMEWORK COM SIZING VISUAL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* CAMADA 1: ADOÇÃO */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <span className="text-xxs font-bold text-slate-500 uppercase tracking-widest block mb-1">Métricas Camada 1</span>
                  <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2 mb-3">Adoção e Capacidade</h4>
                  <ul className="space-y-3.5 text-xxs font-medium text-slate-705">
                    <li>
                      <strong className="text-slate-905 block text-xs">MET-A01 · % de Engenheiros Ativos</strong>
                      Proporção de devs que usaram IA pelo menos 1 vez na semana corrente. Meta de progresso: 25% → 50% → 80%.
                    </li>
                    <li>
                      <strong className="text-slate-905 block text-xs">MET-A03 · Taxa de adoção por Squad</strong>
                      Porcentagem de squads com pelo menos uma ferramenta corporativa oficial homologada e adotada por todos no squad.
                    </li>
                    <li>
                      <strong className="text-slate-905 block text-xs">MET-A04 · Distribuição de Fluência</strong>
                      Proporção em cada nível da matriz. Meta escala final: <span className="text-indigo-805 font-bold">&lt;10% em L0, &gt;=60% em L1+, &gt;=20% em L2+, &gt;=5% em L3</span>.
                    </li>
                  </ul>
                </div>

                {/* CAMADA 2: ENGAJAMENTO */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <span className="text-xxs font-bold text-slate-500 uppercase tracking-widest block mb-1">Métricas Camada 2</span>
                  <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2 mb-3">Engajamento e Qualidade</h4>
                  <ul className="space-y-3.5 text-xxs font-medium text-slate-705">
                    <li>
                      <strong className="text-slate-905 block text-xs">MET-E01 · Cobertura do SDLC por IA</strong>
                      Proporção dos 6 estágios do SDLC que operam com nível de maturidade &ldquo;team&rdquo; ou superior na organização.
                    </li>
                    <li>
                      <strong className="text-slate-905 block text-xs">MET-E02 · Sessões ativas por Dev</strong>
                      Média semanal de sessões de interação real do desenvolvedor com o assistente (indica profundidade do uso).
                    </li>
                    <li>
                      <strong className="text-slate-905 block text-xs">MET-E03 · % de PRs com IA assistidos</strong>
                      Proporção de pull requests submetidos que contam com código auditado e explicado por ferramentas de review automático.
                    </li>
                  </ul>
                </div>

                {/* CAMADA 3: IMPACTO CRÍTICO DORA */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <span className="text-xxs font-bold text-slate-500 uppercase tracking-widest block mb-1">Métricas Camada 3</span>
                  <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2 mb-3">Impacto nos Resultados (DORA)</h4>
                  <ul className="space-y-3.5 text-xxs font-medium text-slate-705">
                    <li>
                      <strong className="text-slate-905 block text-xs">MET-I01 · Variação de Cycle Time</strong>
                      Delta percentual no tempo decorrido desde o commit inicial até o deploy final em produção, comparado com o baseline histórico.
                    </li>
                    <li>
                      <strong className="text-slate-905 block text-xs">MET-I02 · Variação na taxa de Bugs</strong>
                      Variação da frequência de defeitos relatados em produção causados pelos módulos que utilizaram assistência de IA.
                    </li>
                    <li>
                      <strong className="text-slate-905 block text-xs">MET-I03 · Consolidado DORA complessivo</strong>
                      Análise global das métricas de core (deployment frequency, lead time, mean time to recover MTTR) antes de depois.
                    </li>
                  </ul>
                </div>
              </div>

              {/* PARECER TÉCNICO PERSONALIZADO GERADO PELO GEMINI */}
              <div className="border border-slate-300 rounded-2xl p-6 bg-slate-950 text-slate-100 shadow-lg relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-5">
                  <Sparkles className="h-64 w-64 text-indigo-400" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5 z-10 relative">
                  <div>
                    <span className="text-xxs font-bold tracking-widest text-indigo-400 uppercase bg-indigo-900/30 px-2 py-1 rounded-sm">Plano Executivo Inteligente</span>
                    <h3 className="text-xl font-bold text-white mt-2 flex items-center gap-2">
                      <Sparkles className="h-5.5 w-5.5 text-indigo-405 animate-pulse" />
                      Parecer Técnico Emitido por IA (Consultor Tech Leads)
                    </h3>
                    <p className="text-xxs text-slate-400 mt-1">Este relatório estratégico consolida todos os dados de engenharia, prioriza seus gargalos e calcula prazos reais.</p>
                  </div>
                  <button
                    onClick={handleGenerateAiPlan}
                    disabled={isGenerating}
                    className="px-5 py-2 text-xs font-bold bg-white hover:bg-slate-100 text-slate-950 rounded-xl transition-all shadow-md inline-flex items-center gap-1.5 shrink-0 disabled:opacity-40 cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                    {aiPlan ? "Regerar Parecer" : "Gerar Parecer por IA"}
                  </button>
                </div>

                {/* VISUALIZAÇÃO DO CONTEÚDO DO PLANO EM MARKDOWN COM REAC-MARKDOWN */}
                {aiPlan ? (
                  <div className="markdown-body text-slate-300 text-xs leading-relaxed max-h-[600px] overflow-y-auto pr-2 space-y-4">
                    <ReactMarkdown>{aiPlan}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-450 flex flex-col items-center justify-center gap-2">
                    <Sparkles className="h-10 w-10 text-indigo-500/30 mb-2" />
                    <span className="font-bold text-slate-300 text-sm">Nenhum parecer gerado ainda.</span>
                    <p className="text-xxs text-slate-500 max-w-lg leading-normal mt-1">
                      Você pode clicar no botão &ldquo;Gerar Parecer por IA&rdquo; para que o Gemini processe suas 9 respostas do diagnóstico, analise seus gargalos priorizados e retorne o manual tático de governança com as métricas de acompanhamento.
                    </p>
                  </div>
                )}
              </div>

              {/* checklist dos 5 CRITÉRIOS DE CONCLUSÃO DO FRAMEWORK DO TECH LEADS CLUB */}
              <div className="mt-8 border border-indigo-600/15 rounded-xl p-5 bg-indigo-50/10 shadow-xs relative">
                <h4 className="font-extrabold text-sm text-indigo-950 mb-3 uppercase tracking-wider">5 Critérios Mandatórios de Conclusão de Jornada</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { text: "Pelo menos 80% dos engenheiros da organização usando ativamente pelo menos uma ferramenta homologada semanalmente." },
                    { text: "Todos os squads operando com maturidade de IA no nível mínimo de 'team' ou superior em pelo menos 2 estágios do SDLC." },
                    { text: "Manual e Framework de Governança técnico corporativa (v1) oficialmente escrito, aprovado pelo jurídico e publicado." },
                    { text: "Métricas DORA mapeadas relatando melhora mensurável em relação ao baseline histórico original pré-framework." },
                    { text: "Realização de pelo menos 1 ciclo completo de retrospectiva geral com a presença oficial de toda a liderança executiva." }
                  ].map((ci, k) => (
                    <div key={k} className="flex items-start gap-2.5 text-slate-700 text-xxs font-semibold bg-white p-3 border border-slate-205 rounded-lg shadow-xxs">
                      <span className="bg-indigo-100 text-indigo-800 rounded-full p-0.5 mt-0.5"><Check className="h-3 w-3" /></span>
                      <span>{ci.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between">
                <button
                  onClick={() => setActiveTab(6)}
                  className="px-4 py-2 text-xs font-semibold hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                >
                  Voltar para Governança
                </button>
                <span className="text-xs text-slate-400 font-medium py-2">Tech Leads Club • Framework de Adoção de IA</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER EM PÁGINAS LIMPAS */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 font-medium">
          <p>Framework de Adoção de IA é um guia distribuído de forma gratuita para a comunidade Tech Leads Club.</p>
          <div className="flex justify-center gap-4 mt-3 flex-wrap">
            <span className="text-slate-400">Copyright © 2026 Tech Leads Club</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-400">Guia de Referência Autossuficiente</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

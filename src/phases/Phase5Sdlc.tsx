import { useFramework } from "../hooks/FrameworkContext";
import {
  Code2,
  ArrowRight
} from "lucide-react";
import { SDLC_STAGES_DETAILS } from "../data";
import type { SdlcCustomizations } from "../types";

export function Phase5Sdlc() {
  const {
    activeTab, setActiveTab,
    companyMetadata, setCompanyMetadata,
    answers, setAnswers,
    pilot, setPilot,
    gargalos, setGargalos,
    sdlc, setSdlc,
    governance, setGovernance,
    membersProficiency, setMembersProficiency,
    aiPlan, isGenerating, genError, loadingMessage,
    scoreGeral, currentClassification, menorDimensao,
    totalDevsMatriz, pctL0, pctL1Plus, pctL2Plus, pctL3,
    metaAproveL0, metaAproveL1, metaAproveL2, metaAproveL3,
    handleAddGargalo, handleUpdateGargalo, handleRemoveGargalo,
    handleGenerateAiPlan, handleClearData, applySdlcTemplate,
    handleExportProgress, handleImportProgress, handleDownloadAiPlan,
  } = useFramework();

  return (
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
  );
}

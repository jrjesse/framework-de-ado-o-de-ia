import { useFramework } from "../hooks/FrameworkContext";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Info
} from "lucide-react";
import { FA_QUESTIONS, RECOMMENDATIONS } from "../data";
import type { DiagnosticAnswers } from "../types";

export function Phase1Diagnostico() {
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
  );
}

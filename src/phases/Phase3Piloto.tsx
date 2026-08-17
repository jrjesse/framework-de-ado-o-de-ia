import { useFramework } from "../hooks/FrameworkContext";
import {
  Code2,
  ArrowRight
} from "lucide-react";
import type { PilotAnswers } from "../types";

export function Phase3Piloto() {
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
  );
}

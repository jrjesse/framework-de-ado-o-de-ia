import { useFramework } from "../hooks/FrameworkContext";
import {
  ArrowRight,
  Plus,
  Trash2,
  Calendar
} from "lucide-react";

export function Phase4Gargalos() {
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
  );
}

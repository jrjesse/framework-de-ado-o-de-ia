import { useFramework } from "../hooks/FrameworkContext";
import {
  ArrowRight
} from "lucide-react";
import { FA_POLICIES, FA_STANDARDS } from "../data";

export function Phase6Governanca() {
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
  );
}

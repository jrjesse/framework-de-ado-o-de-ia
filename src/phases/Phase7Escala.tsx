import { useFramework } from "../hooks/FrameworkContext";
import {
  TrendingUp,
  Sparkles,
  RefreshCw,
  Check,
  FileDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export function Phase7Escala() {
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
    handleExportProgress, handleImportProgress, handleDownloadAiPlan, handleDownloadAiPlanPdf,
  } = useFramework();

  return (
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
                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  {aiPlan && (
                    <>
                      <button
                        type="button"
                        onClick={handleDownloadAiPlan}
                        className="px-5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileDown className="h-3.5 w-3.5" />
                        Markdown
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            handleDownloadAiPlanPdf();
                          } catch (err) {
                            alert(err instanceof Error ? err.message : "Falha ao abrir impressão PDF.");
                          }
                        }}
                        className="px-5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileDown className="h-3.5 w-3.5" />
                        PDF
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={handleGenerateAiPlan}
                    disabled={isGenerating}
                    className="px-5 py-2 text-xs font-bold bg-white hover:bg-slate-100 text-slate-950 rounded-xl transition-all shadow-md inline-flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                    {aiPlan ? "Regerar Parecer" : "Gerar Parecer por IA"}
                  </button>
                </div>
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
  );
}

import { useFramework } from "../hooks/FrameworkContext";
import {
  Users,
  ArrowRight,
  Sliders,
  Check
} from "lucide-react";

export function Phase2Enablers() {
  const {
    activeTab, setActiveTab,
    companyMetadata, setCompanyMetadata,
    answers, setAnswers,
    pilot, setPilot,
    gargalos, setGargalos,
    sdlc, setSdlc,
    governance, setGovernance,
    membersProficiency, setMembersProficiency,
    enablers, toggleEnabler, enablerImpact, enablerCatalog,
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

            {/* SIMULAÇÃO DE IMPACTO DOS ENABLERS */}
            <div className="border border-slate-200 rounded-xl p-6 bg-white mb-6 shadow-xs">
              <h3 className="text-lg font-bold text-slate-950 mb-2 flex items-center gap-2">
                <Sliders className="h-5 w-5 text-indigo-650" />
                Simulação de impacto dos Enablers
              </h3>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed font-medium">
                Ligue ou desligue habilitadores técnicos e organizacionais para estimar o efeito sobre
                onboarding (semanas) e ganho de eficiência (%). A projeção combina seu score de diagnóstico
                ({scoreGeral}) com o arquétipo {companyMetadata.archetype}.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  {enablerCatalog.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                        enablers[item.id]
                          ? "border-indigo-300 bg-indigo-50/40"
                          : "border-slate-200 bg-slate-50 hover:bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={enablers[item.id]}
                        onChange={() => toggleEnabler(item.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="min-w-0">
                        <span className="text-sm font-bold text-slate-900 block">{item.title}</span>
                        <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">{item.desc}</span>
                        <span className="text-xxs text-indigo-700 font-semibold block mt-1.5">
                          Onboarding {item.onboardingDelta} sem · Eficiência +{item.efficiencyDelta} pp
                        </span>
                      </span>
                    </label>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                    <span className="text-xs font-bold text-slate-500 uppercase block">Onboarding estimado</span>
                    <span className="text-4xl font-black text-slate-950 mt-2 block">
                      {enablerImpact.onboardingWeeks}
                    </span>
                    <span className="text-xs text-slate-500">semanas</span>
                    <p className="text-xxs text-slate-500 mt-2">
                      Baseline sem enablers extras: {enablerImpact.baselineOnboardingWeeks} sem
                    </p>
                  </div>
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-center">
                    <span className="text-xs font-bold text-indigo-700 uppercase block">Ganho de eficiência</span>
                    <span className="text-4xl font-black text-indigo-950 mt-2 block">
                      +{enablerImpact.efficiencyGainPct}%
                    </span>
                    <span className="text-xs text-indigo-700">projeção relativa</span>
                    <p className="text-xxs text-indigo-600/80 mt-2">
                      Baseline: +{enablerImpact.baselineEfficiencyPct}% · {enablerImpact.activeCount} enablers ativos
                    </p>
                  </div>
                  <p className="text-xxs text-slate-400 leading-relaxed">
                    Valores ilustrativos para alinhamento de liderança — não substituem métricas DORA reais do seu contexto.
                  </p>
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
  );
}

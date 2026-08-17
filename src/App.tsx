import { useRef } from "react";
import {
  AlertTriangle,
  Sparkles,
  RefreshCw,
  FileDown,
  Upload,
} from "lucide-react";
import { FrameworkContext } from "./hooks/FrameworkContext";
import { useFrameworkState } from "./hooks/useFrameworkState";
import {
  Phase1Diagnostico,
  Phase2Enablers,
  Phase3Piloto,
  Phase4Gargalos,
  Phase5Sdlc,
  Phase6Governanca,
  Phase7Escala,
} from "./phases";

const TABS = [
  { id: 1, name: "1. Diagnóstico" },
  { id: 2, name: "2. AI Enablers" },
  { id: 3, name: "3. Time Piloto" },
  { id: 4, name: "4. Gargalos" },
  { id: 5, name: "5. SDLC Playbook" },
  { id: 6, name: "6. Governança & Seg" },
  { id: 7, name: "7. Escala & Relatório" },
];

export default function App() {
  const state = useFrameworkState();
  const importInputRef = useRef<HTMLInputElement>(null);
  const {
    activeTab,
    setActiveTab,
    companyMetadata,
    setCompanyMetadata,
    isGenerating,
    loadingMessage,
    genError,
    handleClearData,
    handleGenerateAiPlan,
    handleExportProgress,
    handleImportProgress,
  } = state;

  return (
    <FrameworkContext.Provider value={state}>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-950">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-550 rounded-sm flex items-center justify-center text-white font-bold text-xs italic">
                  TL
                </div>
                <span className="text-slate-900 font-bold tracking-tight text-sm">
                  TECH LEADS <span className="font-normal opacity-70">CLUB</span>
                </span>
                <span className="text-xs text-slate-500">• Guia de Referência Completo v0.7</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-950 tracking-tight mt-1 flex items-center gap-2">
                Framework de Adoção de IA
              </h1>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <input
                ref={importInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  try {
                    await handleImportProgress(file);
                  } catch (err) {
                    alert(err instanceof Error ? err.message : "Falha ao importar o JSON.");
                  }
                }}
              />
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1.5 border border-slate-200 bg-white"
              >
                <Upload className="h-3 w-3" />
                Importar
              </button>
              <button
                type="button"
                onClick={handleExportProgress}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1.5 border border-slate-200 bg-white"
              >
                <FileDown className="h-3 w-3" />
                Exportar
              </button>
              <button
                type="button"
                onClick={handleClearData}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1.5 border border-slate-200 bg-white"
              >
                <RefreshCw className="h-3 w-3" />
                Resetar Dados
              </button>
              <button
                type="button"
                onClick={handleGenerateAiPlan}
                disabled={isGenerating}
                className="px-4 py-1.5 text-xs font-semibold bg-indigo-650 hover:bg-indigo-700 text-white rounded-md shadow-md shadow-indigo-100 transition-all duration-150 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isGenerating ? "Gerando..." : "Gerar Plano por IA com Gemini"}
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-900 text-slate-300 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-1 py-1.5 px-1 overflow-x-auto" aria-label="Tabs">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <section className="mb-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap md:flex-nowrap items-center justify-between gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Nome da Organização</label>
                <input
                  type="text"
                  value={companyMetadata.companyName}
                  onChange={(e) =>
                    setCompanyMetadata({ ...companyMetadata, companyName: e.target.value })
                  }
                  className="w-full text-sm font-semibold text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Engenharia (N° devs)</label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={companyMetadata.teamSize}
                  onChange={(e) =>
                    setCompanyMetadata({
                      ...companyMetadata,
                      teamSize: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="w-full text-sm font-semibold text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Stack de Tecnologias</label>
                <input
                  type="text"
                  value={companyMetadata.techStack}
                  onChange={(e) =>
                    setCompanyMetadata({ ...companyMetadata, techStack: e.target.value })
                  }
                  className="w-full text-sm text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  placeholder="Ex. React, Java, AWS"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Nível de Uso de IA</label>
                <select
                  value={companyMetadata.aiUsage}
                  onChange={(e) =>
                    setCompanyMetadata({ ...companyMetadata, aiUsage: e.target.value })
                  }
                  className="w-full text-sm text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  <option value="none">Inexistente/Nenhum</option>
                  <option value="individual">Individual (Devs usam por conta)</option>
                  <option value="squad">Squads (Times começaram pilotos)</option>
                  <option value="organization">Corporativo (Homologado global)</option>
                </select>
              </div>
            </div>
          </section>

          {isGenerating && (
            <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center animate-pulse flex flex-col items-center justify-center gap-3 shadow-xs">
              <Sparkles className="h-8 w-8 text-indigo-600 animate-spin" />
              <h3 className="font-bold text-indigo-950 text-base">Gerando Plano Técnico via Gemini AI</h3>
              <p className="text-indigo-700 text-sm">{loadingMessage}</p>
              <span className="text-indigo-400 text-xs mt-1">
                O processo pode levar entre 10 e 20 segundos.
              </span>
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

          {activeTab === 1 && <Phase1Diagnostico />}
          {activeTab === 2 && <Phase2Enablers />}
          {activeTab === 3 && <Phase3Piloto />}
          {activeTab === 4 && <Phase4Gargalos />}
          {activeTab === 5 && <Phase5Sdlc />}
          {activeTab === 6 && <Phase6Governanca />}
          {activeTab === 7 && <Phase7Escala />}
        </main>

        <footer className="bg-white border-t border-slate-200 mt-12 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 font-medium">
            <p>
              Framework de Adoção de IA é um guia distribuído de forma gratuita para a comunidade Tech
              Leads Club.
            </p>
            <div className="flex justify-center gap-4 mt-3 flex-wrap">
              <span className="text-slate-400">Copyright © 2026 Tech Leads Club</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">Guia de Referência Autossuficiente</span>
            </div>
          </div>
        </footer>
      </div>
    </FrameworkContext.Provider>
  );
}

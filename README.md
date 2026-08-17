# Framework de Adoção de IA no SDLC · Tech Leads Club

Aplicativo interativo baseado no **Framework de Adoção de Inteligência Artificial no Ciclo de Vida de Desenvolvimento de Software (SDLC)** do **Tech Leads Club**.

Apoia CTOs, VPs de Engenharia, Tech Leads e Agile Coaches a diagnosticar, planejar, governar e escalar o uso produtivo e seguro de assistentes de codificação, agentes de IA e ferramentas auto-adaptativas.

> **MVP v0.5** — projeto aberto à comunidade. Feedback e PRs são bem-vindos.

---

## O que o aplicativo faz

Jornada guiada em 7 fases:

1. **Diagnóstico de Fluência** — 9 perguntas em três dimensões (Processos & Métricas, Cultura & Habilidades, Infraestrutura & Ferramental), com score e classificação de maturidade.
2. **Time AI Enablers** — arquétipo automático (Lean / Dedicado / Distribuído) conforme o tamanho do time, com sizing, rituais e metas de fluência sugeridos.
3. **Time piloto & ferramentas** — score ponderado do squad candidato e mapeamento de ferramentas homologadas (ex.: Copilot, Cursor, CodeRabbit).
4. **Priorização de gargalos** — planilha com fórmula `Score = Impacto × 3 + (3 − Esforço) × 2 + Risco × 2` e trilhas +30 / +90 / +180 dias.
5. **Playbook do SDLC** — templates Conservador / Balanceado / Agressivo e níveis de engajamento da IA por estágio.
6. **Governança e segurança** — guardrails de Input / Output / Runtime, políticas e padrões (orientação OWASP LLM).
7. **Rollout & parecer técnico** — ondas de rollout por tamanho do time e parecer personalizado via **Gemini** (requer API key).

---

## Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Vite 6
- **Backend:** Node.js + Express (proxy da API Gemini — a chave não vai para o browser)
- **IA:** `@google/genai`
- **Ícones:** `lucide-react`

---

## Requisitos

- Node.js **18+**
- Conta Google AI / Gemini (apenas se for usar a Fase 7)

---

## Instalação

```bash
git clone https://github.com/jrjesse/framework-de-ado-o-de-ia.git
cd framework-de-ado-o-de-ia
npm install
cp .env.example .env
```

Edite o `.env` e adicione sua chave (necessária só para gerar o parecer na Fase 7):

```env
GEMINI_API_KEY=sua_chave_do_gemini_aqui
```

Obtenha a chave em: [Google AI Studio](https://aistudio.google.com/apikey)

---

## Executando

### Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Produção

```bash
npm run build
npm run start
```

### Outros scripts

| Script | Descrição |
|--------|-----------|
| `npm run lint` | Typecheck (`tsc --noEmit`) |
| `npm run clean` | Remove artefatos de build |

---

## Como aplicar o framework

### Passo 1 — Alinhamento (Fases 1 e 2)

1. Reúna líderes técnicos e preencha o diagnóstico em conjunto.
2. Se o resultado for L0/L1, foque nos Enablers da Fase 2 (arquétipo, sizing e rituais) antes de expandir ferramentas.

### Passo 2 — Piloto e gargalos (Fases 3 e 4)

1. Use o score da Fase 3 para escolher o squad piloto.
2. Priorize gargalos culturais/técnicos na Fase 4 (+30 / +90 / +180 dias).

### Passo 3 — Playbook e segurança (Fases 5 e 6)

1. Modele onde a IA atua como copiloto vs. onde humanos permanecem autoritativos.
2. Homologue políticas e guardrails antes de liberar uso amplo.

### Passo 4 — Escalar (Fase 7)

1. Ajuste as ondas de rollout ao tamanho do time.
2. Gere o parecer por IA para consolidar o plano (requer `GEMINI_API_KEY`).

---

## Known limitations

- **MVP / protótipo:** UX e conteúdo das 7 fases estão funcionais; packaging e estrutura de código ainda em evolução.
- **Estado só no browser:** progresso fica em `localStorage` — limpar dados do site apaga o preenchimento.
- **Fase 7 depende do Gemini:** sem `GEMINI_API_KEY`, as demais fases funcionam; só a geração do parecer falha.
- **Sem autenticação / multi-usuário / banco:** um dispositivo = uma sessão local.
- **Sem testes automatizados / CI** neste momento.
- **UI concentrada em um monólito** (`src/App.tsx`) — refatoração por fase está no roadmap.

---

## Contribuindo

Issues e PRs são bem-vindos. Prefira:

- [Bug](https://github.com/jrjesse/framework-de-ado-o-de-ia/issues/new?template=bug.yml)
- [Ideia / melhoria](https://github.com/jrjesse/framework-de-ado-o-de-ia/issues/new?template=ideia.yml)
- [Dúvida de uso](https://github.com/jrjesse/framework-de-ado-o-de-ia/issues/new?template=duvida.yml)

Feedback especialmente útil: se o **diagnóstico** e a **priorização de gargalos** batem com a realidade do seu time.

---

*“IA não substitui engenheiros seniores, mas engenheiros munidos de IA e processos maduros de governança certamente substituirão aqueles que competem em isolamento técnico.” — Tech Leads Club*

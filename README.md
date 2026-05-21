Este é o aplicativo interativo do **Framework de Adoção de Inteligência Artificial no Ciclo de Vida de Desenvolvimento de Software (SDLC)** criado pelo **Tech Leads Club**. 

Ele foi desenvolvido para apoiar Diretores de Tecnologia, VPs de Engenharia, CTOs, Tech Leads e Agile Coaches a diagnosticar, planejar, governar e escalar o uso produtivo e seguro de assistentes de codificação com IA, agentes de IA e ferramentas auto-adaptativas dentro de suas organizações de engenharia.

---

## 🚀 O que o Aplicativo Faz

O aplicativo traduz o framework estratégico de adoção em uma jornada digital e prática de 7 etapas consecutivas:

1. **Fase 1 · Diagnóstico de Fluência**: Um questionário aprofundado com 9 perguntas-chave que medem a maturidade da organização em três dimensões (**Processos & Métricas**, **Cultura & Habilidades** e **Infraestrutura & Ferramental**), classificando a empresa em níveis que vão desde o **L0 (Inexistente/Ad-hoc)** ao **L3 (Sistêmico/Auto-adaptativo)**.
2. **Fase 2 · Configuração de Enablers**: Permite às lideranças ligarem/desligarem os habilitadores técnicos e organizacionais e visualizarem simulações dinâmicas de impactos em **Onboarding de Desenvolvedores (semanas)** e **Ganho de Eficiência Geral (%)**.
3. **Fase 3 · Seleção de Time Piloto & Ferramentas**: Apresenta uma calculadora de score para squads (testando autonomia, senioridade coletiva, velocidade de feedback de CI/CD, segurança psicológica e estabilidade do roadmap) para identificar o time piloto ideal, além de propor um mapeamento dinâmico de ferramentas homologadas recomendadas como prioritárias.
4. **Fase 4 · Priorização de Gargalos**: Uma planilha interativa de problemas com cálculo automático baseado na fórmula de prioridade ponderada do Tech Leads Club ($Score = Impacto \times 3 + (3 - Esforço) \times 2 + Risco \times 2$). Aloca dinamicamente os gargalos em uma trilha temporal de remediação (+30, +90 e +180 dias).
5. **Fase 5 · Playbook do SDLC**: Um modelador de fluxo onde o arquiteto de software ou líder decide o nível de engajamento da IA em 6 estágios sequenciais do desenvolvimento (Discussão de Requisitos, Design de Arquitetura, Codificação, Testes, Deploy e Manutenção), exibindo diretrizes detalhadas de código.
6. **Fase 6 · Comitê de Governança e Segurança**: Configuração ativa de posturas de mitigação de conformidade e defesa contra vulnerabilidades OWASP LLM 2025, cobrando homologação de políticas e estabelecimento de guardrails de Entrada (Input), Saída (Output) e Execução (Runtime).
7. **Fase 7 · Rollout & Parecer Técnico com Inteligência Artificial**: Define uma estratégia de Rollout recomendada em Ondas sequenciais indexada ao tamanho exato do time da organização e gera, por meio do **Gemini LLM**, um **Parecer Técnico Inteligente Personalizado**, analisando as dores, as escolhas de ferramentas, guardrails elegidos e o cronograma de ação tática sob medida.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (para micro-animações robustas e transições suaves).
- **Backend**: Node.js com Express para proxy de chamadas de IA seguro contra vazamento de credenciais no cliente.
- **Integração de IA**: `@google/genai` (SDK moderno oficial do Google AI para conexão com os modelos Gemini executivo).
- **Ícones**: `lucide-react`.

---

## ⚙️ Instalação e Configuração

Certifique-se de ter o **Node.js v18 ou superior** instalado em sua máquina local.

### 1. Clonar e Instalar as Dependências

```bash
# Navegue até a pasta do projeto
cd frameworks-sdlc-ai

# Instale os pacotes npm
npm install
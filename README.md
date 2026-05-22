# Framework de Adoção de IA no SDLC • Tech Leads Club

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
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do diretório baseado no exemplo (`.env.example`):

```bash
cp .env.example .env
```

Adicione sua chave de acesso oficial do Gemini para habilitar a geração rápida de relatórios táticos pelas lideranças de engenharia:

```env
GEMINI_API_KEY=sua_chave_do_gemini_aqui
```

---

## 🚦 Executando o Projeto

O projeto utiliza um pipeline unificado onde o servidor Express orquestra e encapsula o ecossistema de compilação rápida do Vite:

### Modo de Desenvolvimento

Para executar em modo de desenvolvimento local com acompanhamento de atualizações rápidas:

```bash
npm run dev
```

O servidor Express e a interface gráfica do usuário estarão disponíveis no terminal em:
[http://localhost:3000](http://localhost:3000)

### Modo de Produção (Build e Inicialização)

Para gerar os arquivos otimizados finais de front-end e empacotar o backend com consistência contra problemas de importação:

```bash
# 1. Compilar o frontend e agrupar o servidor em uma única entrega estável
npm run build

# 2. Iniciar o servidor em modo de alta performance de produção
npm run start
```

---

## 📈 Como Aplicar o Framework na Sua Empresa

A adoção produtiva de IA não é uma simples compra de licenças; é uma transformação estrutural. Siga este playbook para aplicar o framework do **Tech Leads Club** nos seus times:

### Passo 1: O Alinhamento Executivo (Fase 1 e 2)
1. Reúna seus principais líderes técnicos (diretores, gerentes, coordenadores e principais tech leads).
2. Abra o aplicativo e preencha as 9 perguntas diagnósticas em conjunto, debatendo a realidade transparente da sua infraestrutura e processos de métricas atuais.
3. Se seu diagnóstico der **L0 ou L1**, não tente pular etapas para ferramentas complexas. Primeiro ative os **Enablers** da Fase 2, focando em garantir o estabelecimento de um sandbox de segurança e trilhas fundamentais de Onboarding de times.

### Passo 2: O Escopo Piloto e Escolha Tecnológica (Fase 3 e 4)
1. Use o avaliador da Fase 3 para selecionar o primeiro time que experimentará as ferramentas. Busque um time com alta autonomia técnica e feedback fluído (CI/CD rápido).
2. Avalie as ferramentas recomendadas prioritariamente pelo mapeador inteligente baseadas nas suas maiores debilidades diagnósticas.
3. Insira as resistências culturais e burocráticas identificadas na lista de gargalos na Fase 4, priorizando o que resolver nos primeiros 30, 90 e 180 dias.

### Passo 3: O Playbook de Atuação e Segurança (Fase 5 e 6)
1. Modele o comportamento desejado no fluxo SDLC da Fase 5. Garanta que o time saiba em quais fases a IA atua como **Copiloto** (e.g., Codificação, Geração de Testes) e onde os papéis humanos permanecem **Consultivos/Autoritativos** (e.g., Requisitos, Revisão de Arquitetura).
2. Estabeleça as políticas obrigatórias listadas na Fase 6. Não permita a adoção de assistentes de IA antes de aprovar formalmente uma **Política de Uso Aceitável de IA** e garantir que segredos industriais e dependências de código proprietário estejam devidamente protegidos de inputs LLM externos.

### Passo 4: Escalar e Sustentar (Fase 7)
1. Calcule seu plano baseado no tamanho do time para mapear a estratégia em Ondas graduais (Piloto -> Expansão -> Escala Geral).
2. Clique em **Gerar Parecer por IA** para consolidar essas respostas em um plano estratégico estruturado, use-o para justificar investimentos técnicos e demonstrar o ROI por meio das métricas DORA que o framework sugere mapear.

---

*“IA não substitui engenheiros seniores, mas engenheiros munidos de IA e processos maduros de governança certamente substituirão aqueles que competem em isolamento técnico.” — Tech Leads Club*

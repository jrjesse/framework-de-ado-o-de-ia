import { Gargalo } from "./types";

export interface Question {
  id: number;
  dimensaoName: string;
  questionText: string;
  mede: string;
  impacto: string;
  opBaixo: string;
  opMedio: string;
  opAlto: string;
}

export const FA_QUESTIONS: Question[] = [
  {
    id: 1,
    dimensaoName: "Autonomia de Engenharia",
    questionText: "Os engenheiros do seu time conseguem liderar funcionalidades de ponta a ponta — do design técnico ao deploy — sem depender de aprovações externas ao squad?",
    mede: "Grau de autonomia técnica real dos engenheiros para tomar decisões e entregar sem bloqueios externos.",
    impacto: "Times com baixa autonomia não conseguem incorporar IA no fluxo de trabalho porque cada mudança de processo exige aprovação de fora do squad.",
    opBaixo: "Engenheiros dependem de múltiplas aprovações externas para a maioria das decisões técnicas. Funcionalidades passam por arquitetos centrais, comitês ou outras equipes antes de qualquer avanço. O ciclo de decisão é longo e previsível somente para quem está fora do squad.",
    opMedio: "Engenheiros têm autonomia para a maioria das decisões técnicas rotineiras, mas ainda dependem de aprovação externa para mudanças de arquitetura, tecnologia ou impacto cross-squad. A exceção vira regra com alguma frequência.",
    opAlto: "Engenheiros lideram funcionalidades de ponta a ponta com ownership técnico completo. Decisões de arquitetura, tecnologia e deploy são feitas dentro do squad. Coordenação com outros times é por convenção, não por aprovação."
  },
  {
    id: 2,
    dimensaoName: "Flexibilidade Organizacional",
    questionText: "Quando seu time identifica uma nova prática, ferramenta ou tecnologia relevante, quanto tempo leva para experimentá-la formalmente no ambiente de trabalho?",
    mede: "Velocidade com que a organização consegue avaliar e adotar novas práticas tecnológicas sem burocracia excessiva.",
    impacto: "Organizações com baixa flexibilidade levam meses para aprovar ferramentas de IA, perdendo janelas de adoção enquanto a tecnologia avança rapidamente.",
    opBaixo: "Adoção de novas práticas ou ferramentas leva meses e exige múltiplos níveis de aprovação. O processo de avaliação é informal ou inexistente, resultando em decisões lentas e frequentemente bloqueadas por fatores políticos ou organizacionais.",
    opMedio: "Existe um processo de avaliação de novas tecnologias, mas o ciclo médio leva de 4 a 8 semanas. Há critérios definidos, mas aprovações ainda passam por múltiplas camadas. Times conseguem fazer experimentos controlados, mas a adoção formal é lenta.",
    opAlto: "Times conseguem iniciar experimentos formais em menos de 2 semanas. O processo de adoção é claro, rápido e com critérios objetivos. Decisões de tecnologia são descentralizadas e baseadas em evidências, não em hierarquia."
  },
  {
    id: 3,
    dimensaoName: "Ownership e Accountability",
    questionText: "Quando algo falha em produção em um sistema do seu time, o processo de resolução e aprendizado é conduzido pelo próprio squad — incluindo análise de causa raiz e ações preventivas?",
    mede: "Grau em que times assumem responsabilidade completa pelos resultados das suas entregas, incluindo operação e incidentes.",
    impacto: "Times sem ownership real de produção não têm incentivo para usar IA em observabilidade e detecção de problemas, pois não se sentem responsáveis pelo sistema em execução.",
    opBaixo: "Incidentes são frequentemente escalados para equipes externas (SRE, ops, arquitetura) para resolução. O squad que desenvolveu não é o responsável primário pela operação. Análises de causa raiz são raras ou conduzidas por outra equipe.",
    opMedio: "O squad é responsável pelo on-call mas ainda delega parte da resolução para equipes de suporte especializadas. Análises de causa raiz acontecem para incidentes maiores, mas ações preventivas têm acompanhamento inconsistente.",
    opAlto: "O squad tem ownership completo do sistema em produção — detecta, resolve, analisa e age preventivamente. On-call é rotativo dentro do time. Cada incidente gera aprendizado documentado e melhorias rastreáveis."
  },
  {
    id: 4,
    dimensaoName: "Maturidade de Continuous Delivery",
    questionText: "Com que frequência seu time realiza deploys em produção e qual o nível de automação desse processo?",
    mede: "Frequência e previsibilidade das entregas em produção, com o grau de automação que as suporta.",
    impacto: "Pipelines manuais e deploys infrequentes tornam impossível usar IA em code review, análise de PR e sugestões de refatoração de forma integrada ao fluxo real de entrega.",
    opBaixo: "Deploys ocorrem mensalmente ou com menor frequência e envolvem processos manuais significativos. Cada deploy é um evento de alto risco que requer coordenação entre múltiplas equipes. O pipeline de CI existe mas não garante deploy automatizado.",
    opMedio: "Deploys acontecem semanalmente com automação parcial. O pipeline de CI/CD cobre build e testes, mas o deploy para produção ainda tem etapas manuais ou janelas de manutenção. A frequência é limitada por processo, não por capacidade técnica.",
    opAlto: "Deploys acontecem múltiplas vezes por semana ou diariamente, com pipeline totalmente automatizado do commit ao deploy. Feature flags separam deploy de release. O processo é previsível e reversível, com rollback automatizado quando necessário."
  },
  {
    id: 5,
    dimensaoName: "Maturidade de Qualidade",
    questionText: "Qual é o nível de automação de testes e o grau em que o próprio time de engenharia é responsável pela qualidade do código em produção?",
    mede: "Maturidade da automação de testes e do ownership de qualidade pelo time de engenharia.",
    impacto: "Código sem cobertura de testes torna arriscada a adoção de IA para geração e refatoração de código, pois não há rede de segurança para validar o output da IA automaticamente.",
    opBaixo: "Testes automatizados cobrem menos de 30% da base de código ou são inconsistentes entre módulos. Qualidade é responsabilidade de QA manual separado do time de desenvolvimento. Bugs em produção são frequentes e difíceis de rastrear.",
    opMedio: "Há cobertura de testes automatizados para as principais funcionalidades, mas a cobertura é desigual e testes de integração são limitados. QA ainda tem papel separado, mas o time de engenharia assume mais responsabilidade pela qualidade do que antes.",
    opAlto: "Cobertura de testes automatizados é alta e consistente. O próprio time de engenharia define e mantém a qualidade. Quality gates no pipeline bloqueiam código com cobertura insuficiente ou falha em testes. QA automatizado é parte integral do processo de desenvolvimento."
  },
  {
    id: 6,
    dimensaoName: "Velocidade de Feedback",
    questionText: "Quanto tempo leva desde um commit até o feedback completo — testes, build, análise estática — e até o primeiro sinal de comportamento em produção?",
    mede: "Velocidade dos ciclos de feedback desde o código até a observabilidade em produção.",
    impacto: "Ciclos de feedback longos limitam a eficácia de IA em code review e pair programming, pois o custo de validar sugestões da IA é alto quando o loop de feedback demora horas.",
    opBaixo: "O pipeline de CI leva mais de 30 minutos para dar feedback. Monitoramento de produção é reativo — problemas são detectados por usuários antes de alertas internos. O ciclo completo de commit a sinal de produção leva horas ou dias.",
    opMedio: "O pipeline de CI entrega feedback em 10 a 30 minutos. Há monitoramento básico de produção com alertas configurados para os principais erros. O tempo de detecção de problemas em produção é medido em horas.",
    opAlto: "O pipeline de CI entrega feedback em menos de 10 minutos. Monitoramento de produção é proativo com detecção de anomalias antes de impacto ao usuário. O ciclo completo de commit a sinal de produção é medido em minutos."
  },
  {
    id: 7,
    dimensaoName: "DX & Qualidade do Código",
    questionText: "Como você avalia a qualidade da arquitetura do código e a produtividade real dos engenheiros no dia a dia de desenvolvimento?",
    mede: "Saúde da arquitetura de código e a experiência real de desenvolvimento — tempo de onboarding, facilidade de mudança, nível de débito técnico.",
    impacto: "Código com alto débito técnico e arquitetura acoplada limita o que IA consegue ajudar — sugestões de IA são ineficazes quando o contexto do código é fragmentado e difícil de entender mesmo para humanos.",
    opBaixo: "A base de código tem alto débito técnico que torna mudanças arriscadas e lentas. Onboarding de novos engenheiros leva semanas devido à falta de documentação e à complexidade acidental. Ambiente de desenvolvimento local é instável e difícil de configurar.",
    opMedio: "Há partes da base de código bem estruturadas e outras com débito técnico significativo. Onboarding é possível em alguns dias com acompanhamento. Ambiente de desenvolvimento funciona mas tem inconsistências entre membros do time.",
    opAlto: "A arquitetura é clara, modular e documentada. Onboarding de novos engenheiros acontece em menos de 2 dias produtivos. Ambiente de desenvolvimento é reproduzível e consistente. Débito técnico é monitorado e priorizado sistematicamente."
  },
  {
    id: 8,
    dimensaoName: "Uso de IA",
    questionText: "Em que extensão ferramentas de IA já estão integradas ao fluxo de desenvolvimento do seu time — desde sugestões de código até automação de tarefas de engenharia?",
    mede: "Grau de integração de IA no fluxo de desenvolvimento e a profundidade do uso além do básico.",
    impacto: "Dimensão de auto-referência: o nível atual de uso de IA revela a prontidão do time para aprofundar a adoção e o quanto a organização está preparada para extrair valor das próximas ondas de IA.",
    opBaixo: "IA não é usada sistematicamente no fluxo de desenvolvimento. Alguns membros podem usar ferramentas individualmente, mas sem padronização, incentivo ou política organizacional. O time não tem visão clara do que IA pode oferecer para o desenvolvimento.",
    opMedio: "Assistentes de código com IA são usados pela maioria do time, mas o uso está limitado a sugestões de código e completions. IA ainda não é usada sistematicamente para testes, revisão de código, documentação ou refatoração.",
    opAlto: "IA está integrada em múltiplas etapas do fluxo de desenvolvimento — sugestão de código, revisão, geração de testes, documentação e análise de pull requests. O time mede o impacto do uso de IA e usa os dados para otimizar a adoção."
  },
  {
    id: 9,
    dimensaoName: "Senioridade da Engenharia",
    questionText: "Qual é a proporção de engenheiros sêniores e staff no seu time — profissionais capazes de tomar decisões técnicas complexas com autonomia real?",
    mede: "Capacidade técnica coletiva do time para operar com autonomia, avaliar trade-offs e liderar decisões de arquitetura.",
    impacto: "Times com baixa senioridade não conseguem avaliar criticamente o output da IA, resultando em adoção superficial ou em código gerado por IA que cria novos problemas não detectados.",
    opBaixo: "Menos de 20% do time é composto por engenheiros sêniores ou staff. Decisões técnicas complexas frequentemente dependem de consultoria externa ao squad ou estão concentradas em 1-2 pessoas. O time tem dificuldade em operar autonomamente em problemas novos.",
    opMedio: "Entre 20% e 40% do time são sêniores ou staff. Há capacidade técnica para a maioria das decisões rotineiras, mas problemas de arquitetura ou escala ainda requerem apoio externo frequente. O time está em transição para maior autonomia técnica.",
    opAlto: "Mais de 40% do time são sêniores, staff ou principal. O time tem capacidade técnica para tomar decisões complexas de forma autônoma. Há engenheiros de referência que elevam o nível técnico coletivo e mentoram a progressão dos demais."
  }
];

// Recomendações por Dimensão e Nível (Baixo, Médio, Alto)
export const RECOMMENDATIONS: Record<string, { baixo: string; medio: string; alto: string }> = {
  "Autonomia de Engenharia": {
    baixo: "Mapear dependências externas que bloqueiam decisões técnicas dos times. Implementar ownership por squad com escopo claro.",
    medio: "Estabelecer critérios objetivos para escalada de decisões versus decisão local. Criar fóruns de arquitetura que preservem autonomia.",
    alto: "Documentar os mecanismos de autonomia para replicar em novos times. Auditar periodicamente se a autonomia está gerando coerência técnica."
  },
  "Flexibilidade Organizacional": {
    baixo: "Identificar os principais pontos de aprovação burocrática que atrasam adoção de tecnologia. Criar processo de experimentação controlada.",
    medio: "Formalizar um framework de decisão para avaliação de novas tecnologias. Reduzir o ciclo de feedback entre proposta e decisão para menos de 2 semanas.",
    alto: "Documentar o modelo de adoção como referência para novos times e produtos. Avaliar se a velocidade de adoção está criando débito de governança."
  },
  "Ownership e Accountability": {
    baixo: "Definir SLOs por squad e torná-los visíveis para toda a engenharia. Estabelecer on-call rotativo por produto, não por componente.",
    medio: "Conectar métricas de negócio aos resultados de engenharia de cada squad. Implementar revisões regulares de incidentes com ownership explícito.",
    alto: "Verificar se o ownership está distribuído de forma sustentável ou concentrado em poucos. Usar dados de incidentes para orientar priorização técnica."
  },
  "Maturidade de Continuous Delivery": {
    baixo: "Automatizar o processo de build e deploy antes de qualquer outra iniciativa de CD. Medir lead time atual para estabelecer baseline.",
    medio: "Implementar feature flags para separar deploy de release e reduzir risco. Reduzir o tamanho médio dos pull requests para acelerar o ciclo.",
    alto: "Garantir que a frequência de deploy não esteja degradando a estabilidade de produção. Explorar deployment progressivo (canary, blue-green)."
  },
  "Maturidade de Qualidade": {
    baixo: "Estabelecer cobertura mínima de testes automatizados como critério de merge. Criar testes de integração para os 5 componentes mais críticos.",
    medio: "Mover testes manuais de regressão para automação progressivamente por release. Implementar quality gates no pipeline de CI.",
    alto: "Medir o custo de manutenção dos testes para prevenir debt em automação. Avaliar a eficácia dos testes em detectar defeitos antes de produção."
  },
  "Velocidade de Feedback": {
    baixo: "Instrumentar o pipeline de CI para medir tempo médio de feedback de testes. Criar alertas de produção com detecção de anomalias.",
    medio: "Reduzir o tempo de execução do pipeline de CI para menos de 10 minutos. Implementar monitoramento de experiência real do usuário (RUM).",
    alto: "Avaliar se a velocidade de feedback está sendo usada ativamente em decisões de produto. Documentar o fluxo como padrão para novos produtos."
  },
  "DX & Qualidade do Código": {
    baixo: "Realizar auditoria de débito técnico nas áreas de maior volume de alteração. Medir tempo de onboarding de novos engenheiros.",
    medio: "Padronizar ambiente de desenvolvimento local com containers reproduzíveis. Criar convenções de código documentadas e aplicadas via linting.",
    alto: "Medir a correlação entre qualidade do código e velocidade de entrega. Investir em abstrações internas que reduzam código repetitivo."
  },
  "Uso de IA": {
    baixo: "Adotar assistentes de código com IA para toda a engenharia como ponto de partida. Definir casos de uso concretos onde IA gera ganho mensurável.",
    medio: "Medir o impacto do uso de IA em velocity, qualidade e tempo de ciclo. Expandir uso de IA para revisão de código, geração de testes e documentação.",
    alto: "Explorar agentes de IA para tarefas de refatoração e automação de fluxos repetitivos. Estabelecer governança integral para uso de IA."
  },
  "Senioridade da Engenharia": {
    baixo: "Criar plano de carreira técnico com critérios explícitos de progressão para sênior. Identificar engenheiros com potencial e oferecer mentoria estruturada.",
    medio: "Revisar distribuição de tarefas complexas para desenvolver sêniores emergentes. Criar fóruns técnicos onde sêniores compartilhem decisões.",
    alto: "Avaliar se a senioridade está sendo usada para elevar o nível técnico coletivo. Documentar critérios de promoção para staff/principal."
  }
};

// Gargalos Sugeridos Iniciais baseado no Framework
export const SUGGESTED_GARGALOS: Omit<Gargalo, "score">[] = [
  { id: "g1", nome: "Ausência de cobertura de testes mínimos para usar IA com segurança", trilha: "Técnica", dimensao: "Maturidade de Qualidade", impacto: 3, esforco: 2, risco: 3 },
  { id: "g2", nome: "Pipeline de CI/CD lento que desestimula feedback rápido", trilha: "Técnica", dimensao: "Velocidade de Feedback", impacto: 2, esforco: 2, risco: 2 },
  { id: "g3", nome: "Processo de aprovação de ferramentas extremamente lento e burocrático", trilha: "Organizacional", dimensao: "Flexibilidade Organizacional", impacto: 3, esforco: 1, risco: 2 },
  { id: "g4", nome: "Falta de ownership claro dos squads sobre os microsserviços", trilha: "Organizacional", dimensao: "Ownership e Accountability", impacto: 2, esforco: 2, risco: 2 },
  { id: "g5", nome: "Resistência de engenheiros seniores quanto à precisão e valor da IA", trilha: "Cultura", dimensao: "Senioridade da Engenharia", impacto: 3, esforco: 2, risco: 1 },
  { id: "g6", nome: "Medo de cometer erros ou sofrer punições ao experimentar ferramentas novas", trilha: "Cultura", dimensao: "Autonomia de Engenharia", impacto: 2, esforco: 1, risco: 2 },
  { id: "g7", nome: "Código altamente acoplado e arquitetura antiga dificultando contexto para IA", trilha: "Técnica", dimensao: "DX & Qualidade do Código", impacto: 3, esforco: 3, risco: 2 },
  { id: "g8", nome: "Falta de patrocínio executivo formal para guiar a adoção", trilha: "Organizacional", dimensao: "Uso de IA", impacto: 3, esforco: 1, risco: 3 }
];

// Estágios completados do SDLC
export interface StageData {
  title: string;
  iaFaz: string[];
  antiPadroes: string[];
  calibracoes: string;
  critariosAvanco: string[];
}

export const SDLC_STAGES_DETAILS: Record<string, StageData> = {
  planejamento: {
    title: "1. Planejamento",
    iaFaz: [
      "Síntese de requisitos a partir de discussões e documentos de produto.",
      "Geração automática de critérios de aceite detalhados e casos de borda.",
      "Estimativas de complexidade inicial baseadas no histórico do repositório.",
      "Sugestões de decomposição inteligente de macro-tarefas."
    ],
    antiPadroes: [
      "Usar IA para substituir completamente conversas de alinhamento com produto.",
      "Aceitar estimativas e prazos gerados por IA sem validação ou veto técnico.",
      "Delegar decisões críticas de priorização estratégica para a inteligência artificial."
    ],
    calibracoes: "Se flexibilidade organizacional for Baixa: Priorizar a criação de workflows simples de aprovação em menos de 2 semanas antes de automatizar o planejamento.",
    critariosAvanco: [
      "Pelo menos 80% das especificações técnicas possuem critérios de aceite gerados com assistência de IA analisados e aprovados.",
      "Sinalização de redução subjetiva de esforço no processo de especificação pelos Tech Leads e Product Managers.",
      "Melhoria mensurável na qualidade dos critérios de aceite (menos retrabalho por ambiguidade técnica)."
    ]
  },
  codificacao: {
    title: "2. Codificação",
    iaFaz: [
      "Autocompletar de código inline inteligente e contextual em tempo real (Copilot mode).",
      "Geração rápida de boilerplates seguros, interfaces e tipos estáticos.",
      "Refatoração localizada de código com base no contexto completo de arquivos abertos.",
      "Explicação de lógica legada de terceiros e geração de JSDoc/Documentações."
    ],
    antiPadroes: [
      "Aceitar trechos de código sugeridos sem revisão manual crítica do contexto de negócio.",
      "Usar IA para gerar códigos complexos em módulos sem qualquer cobertura de testes.",
      "Ignorar deliberadamente vulnerabilidades ou más práticas apontadas em prol de velocidade."
    ],
    calibracoes: "Se DX / Qualidade do Código for Baixa: Limitar o nível de geração em 'experimental'. O código gerado exige revisão sênior obrigatória no par.",
    critariosAvanco: [
      "Aumento real mensurável de velocidade de codificação em tarefas padrão (>= 10% sem degradação de qualidade).",
      "Time tem convenções de codificação assistida por IA documentadas para o stack principal.",
      "Taxa de bugs introduzidos pelo uso de IA é igual ou inferior à do código manual histórico."
    ]
  },
  codeReview: {
    title: "3. Code Review",
    iaFaz: [
      "Revisão sintática e semântica preliminar em pull requests com comentários contextuais.",
      "Identificação prévia de brechas de segurança básicas, bugs comuns e code smells.",
      "Sugestões de melhorias alinhadas com as convenções estilísticas declaradas no repositório.",
      "Geração rápida do changelog descritivo e do resumo executivo das mudanças do PR."
    ],
    antiPadroes: [
      "Substituir completamente a análise e a revisão humana sênior pela automatizada de IA.",
      "Tratar todos os comentários da IA como ruído sem avaliar sua validade técnica.",
      "Aprovar pull requests sem olhar o código detalhadamente, apenas por aprovação prévia de IA."
    ],
    calibracoes: "Se Senioridade da Engenharia for Baixa: Limitar o Code Review apoiado por IA. A auditoria humana de um arquiteto ou líder técnico externo é obrigatória como gate final.",
    critariosAvanco: [
      "Redução de >= 20% no tempo médio total de revisão humana em pull requests (Lead Time de PR).",
      "Uso de IA identificando pelo menos 1 bug crítico ou de segurança por semana que teria passado em revisão comum.",
      "Melhor controle geral: revisores relatam que a IA reduziu a carga de revisão mecânica."
    ]
  },
  testes: {
    title: "4. Testes & Shift Left",
    iaFaz: [
      "Geração automática de testes unitários robustos cobrindo ramificações do código.",
      "Identificação proativa de casos de borda e inputs anômalos não previstos pelo dev.",
      "Geração de testes end-to-end (E2E) em ferramentas como Playwright a partir de critérios de aceite.",
      "Análise dinâmica da cobertura técnica para guiar quais novos testes construir."
    ],
    antiPadroes: [
      "Aceitar testes automatizados por IA que apenas passam visualmente mas não testam regras críticas de comportamento.",
      "Usar ferramentas de teste com IA para 'inflar' artificialmente a cobertura de código sem eficácia real.",
      "Tratar 'Shift Left' puro como iniciativa estritamente ferramental e ignorar a cultura do desenvolvedor."
    ],
    calibracoes: "Se Maturidade de Qualidade for Baixa: Testes gerados são estritamente isolados; os quality gates do CI devem atuar de forma rígida em commits novos.",
    critariosAvanco: [
      "Elevação da cobertura geral de testes do time em >= 15% nos módulos críticos adjacentes à IA.",
      "Pelo menos 50% dos pull requests submetidos já chegam contendo testes funcionais criados junto com a lógica.",
      "Testes automatizados reportam taxa de falso-positivo inferior a 10% de forma recorrente."
    ]
  },
  deploy: {
    title: "5. Deploy",
    iaFaz: [
      "Análise preditiva de riscos no deploy baseada na diferença do código e hitórico anterior.",
      "Sugestão inteligente da estratégia de deploy (canary, azul-verde, ativação via flag).",
      "Geração automatizada de runbook estruturado de rollback para incidentes.",
      "Validação estática de arquivos de infraestrutura (IaC) e configurações de contêineres."
    ],
    antiPadroes: [
      "Autodeploy sem supervisão técnica qualificada para sistemas produtivos de alto risco.",
      "Ignorar avisos de risco de deploy fornecidos pelos modelos para acelerar janelas sob pressão.",
      "Confiar cegamente em scripts de rollback sugeridos por IA sem simulação off-line prévia."
    ],
    calibracoes: "Se Maturidade de Continuous Delivery for Baixa: Manter o nível de deploy autônomo em 'none' ou puramente consultivo. Automatizar o pipeline padrão de CI/CD primeiro.",
    critariosAvanco: [
      "Redução visível (>= 30%) em deploys que demandaram intervenção manual extrema ou rollback.",
      "Análise automatizada de risco da IA integrada ativamente em 100% dos processos de entrega em staging.",
      "Pluto de rollback documentado e testado pelo menos para as 5 APIs principais."
    ]
  },
  observabilidade: {
    title: "6. Observabilidade",
    iaFaz: [
      "Detecção de anomalias estatísticas finas em tempo real em logs e métricas distribuídas.",
      "Triagem assistida e indicação do componente raiz em incidentes de produção.",
      "Geração proativa de painéis de telemetria adaptativos com base em eventos históricos.",
      "Correlação inteligente de fluxos de requisição em sistemas baseados em microsserviços."
    ],
    antiPadroes: [
      "Diminuir ou desativar limites comuns de monitoramento confiando que a IA pegará tudo.",
      "Ignorar avisos de incidentes por taxá-los de falsos positivos sem análise de trilha.",
      "Tratar diagnósticos da IA como verdade absoluta para correções em produção sem checar a telemetria."
    ],
    calibracoes: "Se Feedback de Observabilidade estiver lento: Focar na infraestrutura de logs consolidadas antes de conectar ferramentas de triagem baseadas em IA.",
    critariosAvanco: [
      "Redução de >= 25% no indicador MTTR (Mean Time to Recover) de incidentes críticos em produção.",
      "Detecção proativa pela IA de pelo menos 3 anomalias silenciosas antes do primeiro reporte do usuário final.",
      "Análise rápida de causa raiz gerando subsídios iniciais em 100% das falhas graves P1/P2."
    ]
  }
};

// Políticas e Padrões de Governança
export const FA_POLICIES = [
  { id: "p1", title: "1. Uso de Dados em Prompts", desc: "Nenhum dado pessoal (PII), credencial, token ou propriedade intelectual privada deve constar em prompts enviados para modelos externos sem túnel corporativo seguro. Recomenda-se o uso de dados sintéticos para testes locais.", resp: "Security Engineering", review: "Anual" },
  { id: "p2", title: "2. Escolha e Aprovação de Ferramentas", desc: "Toda e qualquer solução de IA que acesse a base de códigos ou dados de clientes requer um escopo de avaliação formal de conformidade com a segurança da informação antes da contratação corporativa ativa.", resp: "AI Enabler Team + Security", review: "Semestral" },
  { id: "p3", title: "3. Revisão Humana Obrigatória", desc: "Todo bloco de código gerado por inteligência artificial deve, obrigatoriamente, ser aprovado em uma revisão manual por um dev sênior antes de ir para produção. A IA não faz merges autônomos.", resp: "Tech Leads", review: "Anual" },
  { id: "p4", title: "4. Propriedade Intelectual", desc: "Os blocos de código assistidos são propriedade intelectual corporativa exclusiva. Proíbe-se o uso em plataformas e IDEs que exijam direitos autorais compartilhados ou treinamento público de modelos a partir do imput.", resp: "Legal + CTO", review: "Anual" },
  { id: "p5", title: "5. Segurança e Vulnerabilidades", desc: "Lógicas de segurança, autenticação e criptografia criadas por assistentes exigem dupla revisão. A geração desses códigos não deve ser realizada sem orientação direta de um especialista de segurança.", resp: "Security Engineering", review: "Semestral" },
  { id: "p6", title: "6. Controle de Custos de APIs", desc: "Todos os tokens, chamadas e endpoints de APIs de linguagem devem possuir quotas rígidas e limites mensais configurados por squad para mitigar loops de automação custosos.", resp: "EM + Finance", review: "Trimestral" },
  { id: "p7", title: "7. Exceções e Desvios de Compliance", desc: "Todo desvio ou flexibilização temporária das políticas aprovadas deve ter registro formal técnico detalhando o racional, os riscos mitigados e a validade assinada pelo comitê técnico.", resp: "Time AI Enablers", review: "Semestral" },
  { id: "p8", title: "8. Revisão Periódica dos Princípios", desc: "Comitê realiza revisão completa das políticas vigentes a cada mudança corporativa das ferramentas homologadas ou cenários regulatórios governamentais em alta.", resp: "CTO + AI Enablers", review: "Semestral" },
  { id: "p9", title: "9. Exigência de Nível de Fluência", desc: "Desencadeia o pré-requisito de conformidade do dev. Bloqueia acessos produtivos a quem não concluiu capacitação mínima correspondente (nível L1 · Aplicador ou acima).", resp: "AI Enabler Team", review: "Trimestral" }
];

export const FA_STANDARDS = [
  { id: "s1", title: "Commits com Assistência de IA", desc: "Todas os commits contendo mais de 40% de código gerado devem ser marcadas com o prefixo [ai-assisted] no corpo da mensagem." },
  { id: "s2", title: "Prompts Versionados para Críticos", desc: "System prompts e roteiros de contexto complexos utilizados em fluxos produtivos de automação técnica devem ser salvos e controlados sob Git." },
  { id: "s3", title: "Métricas de Instrumentação e Observação", desc: "APIs e rotas que servem IA aos clientes devem expor métricas refinadas de latência, número de tokens, custos reais gerados e taxa de erro." },
  { id: "s4", title: "Checklist de PR Técnico em IA", desc: "Se o PR possuir código com suporte de IA, o desenvolvedor deve marcar a ausência de chaves codificadas e validação manual do algoritmo criado." },
  { id: "s5", title: "Geração Controlada de Dados Sintéticos", desc: "Uso obrigatório de conjuntos de dados anônimos para o ambiente de testes de forma que a IA não leia registros legítimos no banco de dados." },
  { id: "s6", title: "Shift Left Quality Gates Automatizados", desc: "Regras rígidas do pipeline (Linter, testes rodando no commit, cobertura de software aceitável) que atuam como barreiras técnicas incontornáveis." }
];

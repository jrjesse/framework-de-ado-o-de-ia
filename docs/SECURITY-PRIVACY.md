# Security & Privacy Note  
**Framework de Adoção de IA no SDLC · Tech Leads Club**

**Versão do app:** v0.8 · **Demo:** https://framework-adocao-ia-sdlc.fly.dev/  
**Público:** briefing técnico para arquitetura / segurança / compliance  
**Escopo:** ferramenta interativa de planejamento — **não** é sistema oficial de dados corporativos classificados.

---

## 1. Resumo executivo

| Pergunta | Resposta |
|----------|----------|
| Onde ficam as respostas do diagnóstico? | No **browser do usuário** (`localStorage`). Sem banco de dados da aplicação. |
| A chave Gemini fica no frontend? | **Não.** Só no servidor (secret de ambiente). |
| O que sai para um LLM externo? | **Somente** se o usuário acionar a **Fase 7 · Gerar Parecer**. |
| A telemetria coleta PII? | **Não.** Apenas eventos anônimos de uso (ex.: fase visitada). |
| Há autenticação / SSO? | **Não** neste MVP. Tratar como ferramenta de workshop / piloto. |

**Posicionamento recomendado:** uso com **dados sintéticos ou não sensíveis** até haver política interna e, se necessário, endpoint LLM corporativo.

---

## 2. Fluxo de dados

```
[Browser]
  ├─ Preenchimento (fases 1–6)  →  localStorage (dispositivo)
  ├─ Export JSON / PDF / MD     →  arquivo local do usuário
  ├─ Telemetria anônima         →  POST /api/telemetry  (sem PII)
  └─ Gerar Parecer (Fase 7)     →  POST /api/generate-plan
                                      └─ Servidor (Fly.io)
                                           └─ Google Gemini API
```

- **Hospedagem:** Fly.io (`framework-adocao-ia-sdlc`), HTTPS.  
- **Healthcheck:** `GET /api/health` (não expõe a chave).  
- **Uso agregado:** `GET /api/stats` (contadores em memória; resetam no redeploy).

---

## 3. Classificação do que é armazenado / transmitido

| Ativo | Armazenamento | Transmissão | Observação |
|-------|---------------|-------------|------------|
| Metadados (empresa, #devs, stack) | Browser | Só na Fase 7 → Gemini | Evitar nomes/códigos internos reais se a política exigir |
| Respostas do diagnóstico (q1–q9) | Browser | Só na Fase 7 → Gemini | Idem |
| Gargalos, SDLC, governança, enablers | Browser | Só na Fase 7 → Gemini | Idem |
| Parecer gerado | Browser (+ download opcional) | Resposta Gemini → usuário | Conteúdo gerado por LLM |
| `GEMINI_API_KEY` | Secret no servidor | Nunca ao browser | Configurada via `fly secrets` |
| Telemetria (`session_start`, `phase_view`, export, PDF, gerar parecer…) | Contadores + logs no servidor | Browser → API | Sem empresa, respostas ou texto do parecer |

---

## 4. Controles já presentes

- Proxy servidor para Gemini (credencial fora do cliente)  
- Rate limit em `/api/generate-plan` e `/api/telemetry`  
- Payload da telemetria **sanitizado** (só eventos allowlist + fase 1–7)  
- Limite de body JSON (1 MB)  
- Container com usuário não-root e healthcheck  

---

## 5. Limitações conscientes (MVP)

- Sem SSO, RBAC, criptografia at-rest além do browser, nem trilha de auditoria persistente  
- `localStorage` é acessível a scripts na mesma origem (risco XSS clássico de SPA)  
- Conteúdo enviado na Fase 7 fica sujeito aos **termos / retenção do provedor Gemini**  
- Stats em memória **não** substituem SIEM ou retenção corporativa  
- App público na internet: adequado a demo/comunidade; para intranet Copel, avaliar deploy privado  

---

## 6. Recomendações para uso em contexto Copel

1. **Workshop / alinhamento:** preencher com cenários fictícios ou agregados.  
2. **Não** colar PII, segredos, IPs internos, contratos ou código proprietário nos campos.  
3. Se a Fase 7 for necessária com dados reais: exigir **avaliação de fornecedor LLM** + endpoint corporativo (ex.: Vertex AI / contrato Google Cloud) e/ou deploy em rede interna.  
4. Opcional: desabilitar geração de parecer até aprovação (feature flag / remoção da chave).  
5. Preferir **Export JSON** local para compartilhar entre pares, em vez de repositórios públicos.  

---

## 7. Como validar em 5 minutos (demo para arquitetura)

1. Abrir a demo e preencher campos fictícios.  
2. DevTools → Application → Local Storage → chaves `fa_*`.  
3. Network: até a Fase 6, apenas telemetria anônima (se houver).  
4. Fase 7 → Gerar Parecer → inspecionar `POST /api/generate-plan` (chave **não** aparece no cliente).  
5. Abrir `/api/stats` e contrastar com a ausência de dados do diagnóstico.  

---

## 8. Contato / artefatos

- Repositório: https://github.com/jrjesse/framework-de-ado-o-de-ia  
- Este documento: `docs/SECURITY-PRIVACY.md`  
- Código relevante: `server.ts` (proxy Gemini + telemetria), `src/lib/telemetry*.ts`, `src/lib/storage.ts`  

*Documento orientativo de transparência técnica. Não substitui parecer jurídico, DPIA ou aprovação formal de segurança da informação.*

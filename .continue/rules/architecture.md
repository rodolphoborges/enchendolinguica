# ========================================================================================
# 📐 Architecture Design Document: Fofoca Bot Termômetro 🌭
# ========================================================================================
# Este documento descreve a arquitetura do sistema de monitoramento de fofocas,
# que visa coletar, processar e apresentar dados de notoriedade de celebridades
# a partir de fontes de notícias RSS.
#
# 📅 Baseado em: Análise do codebase e documentação de contexto.
# 💡 Status: V1.0 - Estrutura estabelecida.
#
# ----------------------------------------------------------------------------------------
# 1. Visão Geral do Sistema
# ----------------------------------------------------------------------------------------
# O sistema opera como um pipeline ETL (Extract, Transform, Load) especializado:
# 1. **EXTRACTION (Scraper):** Coleta dados brutos de múltiplos feeds RSS.
# 2. **TRANSFORMATION:** Filtra, enriquece (categoriza) e padroniza os dados de notícia,
#    aplicando regras de casais e limitação de volume.
# 3. **LOADING & SERVING:** Persiste o acervo em `data.json` e expõe via API Express.js
#    para consumo pelo dashboard (index.html).
#
# ----------------------------------------------------------------------------------------
# 2. Stack Tecnológica
# ----------------------------------------------------------------------------------------
# *   **Backend/Servidor:** Node.js com framework Express.js.
# *   **Processamento de Dados:** JavaScript, utilizando bibliotecas como `rss-parser`.
# *   **Persistência de Dados:** JSON (Armazenamento de acervo: `data.json`).
# *   **Frontend:** HTML5, CSS (Tailwind CSS via CDN), JavaScript (Chart.js para visualização).
# *   **Orquestração:** GitHub Actions (CI/CD) para execução agendada do scraper.
#
# ----------------------------------------------------------------------------------------
# 3. Estrutura de Pastas e Responsabilidades
# ----------------------------------------------------------------------------------------
# *   `.continue/rules/`: (Este diretório) Contém documentação de regras e padrões.
# *   `config.json`: **Contrato de Configuração.** Define fontes de dados (`feeds`),
#     regras de negócios (`regras_casais`) e limites operacionais (`settings`).
# *   `scraper.js`: **Motor de Ingestão.** Responsável pela extração e pré-processamento dos dados.
# *   `server.js`: **Camada de Serviço (API).** Expõe endpoints RESTful (`/data.json`, `/config`, `/scrape`)
#     e serve os ativos estáticos (`index.html`).
# *   `data.json`: **Modelo de Dados Principal.** Acervo histórico e atualizado das notícias.
# *   `index.html`: **View Layer.** Consome a API, renderiza o dashboard e executa a lógica de visualização.
# *   `tests/`: Contém scripts de validação para garantir a integridade dos dados processados.
#
# ----------------------------------------------------------------------------------------
# 4. Fluxo de Dados (Data Flow)
# ----------------------------------------------------------------------------------------
# 1. **Trigger:** (Manual via API ou Agendado via GitHub Actions) -> Chama `scraper.js`.
# 2. **Extract:** `scraper.js` lê `config.json` -> Conecta-se a feeds RSS -> Baixa conteúdo XML/JSON.
# 3. **Transform:**
#    a. Limpeza de XML/Sanitização de URLs.
#    b. Loop sobre cada item: Verifica se o conteúdo cru contém *ambos* os termos definidos em `regras_casais`.
#    c. Atribuição de Metadados: Define `casal_referenciado`, `categoria`, e armazena `data_publicacao`.
# 4. **Load:** O acervo (news) é consolidado e sobrescreve/atualiza `data.json`, junto com o `last_updated`.
# 5. **Serve:** `server.js` expõe o `data.json` (GET /data.json) para ser consumido pelo frontend.
#
# ----------------------------------------------------------------------------------------
# 5. Decisões Arquiteturais Críticas
# ----------------------------------------------------------------------------------------
# *   **Separation of Concerns:** Clear separation entre coleta (scraper.js), API (server.js) e UI (index.html).
# *   **Fonte Única da Verdade:** O `config.json` é o único ponto de controle para regras de negócio (quais casais monitorar).
# *   **Imutabilidade Parcial:** A estrutura de `data.json` é construída para ser append-only em termos históricos,
#     mas é reescrita por execução para refletir o estado mais recente, mantendo o limite de registros.
# ==================================================================================
# 🚀 Performance Optimization Guidelines
# ==================================================================================
# Este documento guia a otimização de gargalos de performance, focando principalmente
# no processo de scraping e na escalabilidade da API.
#
# ⚡ Principais Gargalos Identificados:
# ---------------------------
# 1. I/O Bound (Leitura de Arquivos): A leitura e escrita frequente do `data.json`.
# 2. Network Bound (Rede): O tempo total gasto na requisição e parsing de múltiplos feeds RSS.
# 3. CPU Bound (Processamento): A checagem de regex complexas dentro do corpo do texto para múltiplos casais.
#
# 🛠️ Estratégias de Otimização
# ---------------------------------------------------------------------------------------
# **1. Otimização de I/O (Data Persistence):**
# *   **Batch Writes:** Em vez de escrever o arquivo a cada notícia, o acervo deve ser montado na memória (JS Object) e escrito *apenas* ao final do ciclo de scrape bem-sucedido.
# *   **State Check:** No `server.js`, se o usuário solicitar `/data.json` e o arquivo `data.json` tiver um `last_updated` recente (ex: < 1 hora), considerar servir um *cache* de memória temporário em vez de ler o disco a cada requisição, reduzindo latência.
#
# **2. Otimização de Rede (Scraping):**
# *   **Paralelismo:** Usar `Promise.all([...feeds])` em vez de iterações sequenciais para baixar os feeds RSS. Isso explora melhor a latência de rede.
# *   **Caching de Feeds:** Implementar um cache de nível de rede (ex: usando `node-fetch` com cabeçalhos de cache apropriados ou bibliotecas como `node-cache`) para feeds que não foram atualizados há X minutos, evitando requisições desnecessárias.
# *   **Rate Limiting:** O scraper deve ser implementado com *delays* (pausas) entre o processamento de feeds de fontes diferentes (mesmo que em paralelo) para não sobrecarregar os servidores RSS e ser bloqueado.
#
# **3. Otimização de Processamento (CPU):**
# *   **Pré-compilação de Regex:** Todas as expressões regulares usadas para identificar casais ou limpar texto devem ser compiladas uma única vez no início do `scraper.js` (usando `new RegExp(...)`) e reutilizadas, em vez de serem recriadas em cada iteração de notícia.
# *   **Priorização de Busca:** Se o número de casais for muito grande, processar primeiro as regras com maior acurácia esperada ou as mais frequentemente buscadas, validando o *match* de forma hierárquica.
#
# ⚖️ Resumo da Performance:
# **Ordem de Prioridade:** 1. Paralelismo de Rede -> 2. Cache de Dados -> 3. Pré-compilação de Regex.
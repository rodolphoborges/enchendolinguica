# ========================================================================================
# 📜 Coding & Style Standards Guide
# ========================================================================================
# Este guia estabelece as convenções de codificação para manter a manutenibilidade
# do codebase, priorizando legibilidade e aderência aos padrões Node.js/JavaScript.
#
# ----------------------------------------------------------------------------------------
# 1. Linguagem e Estrutura Geral
# ----------------------------------------------------------------------------------------
# *   **Linguagem:** JavaScript (ES6+). Deve-se evitar sintaxes legadas do JS < 2015.
# *   **Módulos:** Uso estrito de `import`/`export` (ou `require` se estritamente necessário por dependência antiga).
# *   **Gerenciamento de Dependências:** Todas as bibliotecas de terceiros devem ser instaladas via npm e referenciadas no `package.json`.
#
# ----------------------------------------------------------------------------------------
# 2. Convenções de Nomenclatura (Naming Conventions)
# ----------------------------------------------------------------------------------------
# *   **Variáveis e Funções:** `camelCase` (Ex: `lastUpdated`, `processNewsItem`).
# *   **Constantes Globais/Config:** `SCREAMING_SNAKE_CASE` (Ex: `MAX_NEWS_LIMIT`, `API_ENDPOINT`).
# *   **Classes/Componentes:** `PascalCase` (Ex: `ScraperService`, `DataAggregator`).
# *   **Arquivos:** Preferencialmente legíveis com a funcionalidade que executam (Ex: `scraper.js`, `server.js`).
#
# ----------------------------------------------------------------------------------------
# 3. Boas Práticas Observadas e Recomendadas
# ----------------------------------------------------------------------------------------
# **Práticas Observadas:**
# 1.  **Encapsulamento de Serviço:** Lógica complexa (como a extração de dados) é encapsulada em módulos (ex: `scraper.js`).
# 2.  **State Management:** O estado principal é gerenciado pelo `data.json`, o que centraliza a fonte de verdade.
# 3.  **Separação de Responsabilidade API:** O `server.js` atua estritamente como um *router* que delega tarefas.
#
# **Melhorias Recomendadas (Aprimoramento, não quebra de padrão):**
# *   **Tratamento de Erros:** Implementar *try...catch* em todas as chamadas de rede (fetch) e I/O (file system) para garantir que falhas em feeds não derrubem o processo inteiro.
# *   **Tipagem:** Se a complexidade aumentar, migrar para TypeScript é altamente recomendado para reforçar a segurança dos tipos de dados.
# *   **Assíncrono:** Em funções que orquestram múltiplas requisições de feeds, considerar o uso de `Promise.all()` para paralelizar chamadas, otimizando o tempo total de scraping.
#
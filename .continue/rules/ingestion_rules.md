# ========================================================================================
# 📥 Data Ingestion Rules: Scraping e Validação de Fontes
# ====================================================================================
# Este documento detalha as regras de como os dados devem ser extraídos (Ingestão) e
# validados antes de serem persistidos no acervo principal (`data.json`).
#
# 🎯 Objetivo Principal:
# Garantir que apenas dados relevantes, limpos e estruturados cheguem ao sistema, minimizando ruído e erros de conexão.
#
# ----------------------------------------------------------------------------------------
# 1. Fontes de Dados (Feeds)
# ------------------------------------------------------------
# *   **Fonte Primária:** Feeds RSS listados em `config.json` (G1, Folha, UOL, etc.).
# *   **Mecanismo:** Utiliza bibliotecas como `rss-parser` para transformar o XML bruto em um objeto JavaScript estruturado.
# *   **Regra de Robustez:** Deve haver um *fallback* para feeds que retornem um erro 404 ou conteúdo inválido. A falha de um feed não deve interromper o processamento dos demais.
#
# ----------------------------------------------------------------------------------------
# 2. Regras de Transformação e Filtragem (Business Logic)
# ------------------------------------------------------------
# *   **Filtro de Relevância (Core):** Uma notícia só é processada se o seu corpo de texto (ou título + corpo) contiver *simultaneamente* os termos de `PessoaA` E `PessoaB` definidos para um casal específico.
# *   **Categorização:** O sistema deve mapear a ocorrência para a categoria definida em `config.json` (Real, Fake Ship, Internacional).
# *   **Limpeza de Conteúdo:**
#    *   **XML/HTML:** Remover *tags* HTML/XML indesejadas e caracteres de controle (ex: BOM).
#    *   **Espaços em Branco:** Aplicar `.trim()` em todos os campos de texto (título, descrição, URL).
# *   **Sanitização de URLs:** Garantir que todas as URLs salvas estejam completas e formatadas corretamente.
#
# ----------------------------------------------------------------------------------------
# 3. Validação e Tratamento de Falhas (Error Handling)
# ------------------------------------------------------------
# *   **Limite de Dados:** Deve haver um mecanismo de *throttling* ou truncamento automático no carregamento do `data.json` para não exceder `max_noticias`.
# *   **Timestamp:** O campo `last_updated` de `data.json` DEVE ser atualizado com o timestamp da execução do *scraper* com sucesso.
# *   **Regra de Duplicidade (Avançado):** Implementar uma verificação básica para evitar o registro de notícias com o mesmo `url` que já exista no acervo (embora a sobreescrita por data seja o mecanismo primário de detecção de atualização).
#
# --------------------------------------------------------------------------
# 💡 Nota para Desenvolvimento: A validação de conteúdo deve ser feita *após* a limpeza de tags, mas *antes* da atribuição de categoria.

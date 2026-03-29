# Projeto: Termômetro da Encheção de Linguiça 🌭

Este projeto é uma ferramenta bem-humorada projetada para monitorar, filtrar e arquivar notícias de celebridades de "baixa relevância" (futilidades) publicadas em grandes portais brasileiros. O foco principal é rastrear menções a casais específicos e visualizar o volume dessa produção editorial ao longo do tempo.

## 🎯 Objetivo
O "Termômetro" visa quantificar o esforço dos portais de notícias em manter o público informado sobre detalhes triviais da vida de celebridades, transformando fofoca em dados estruturados.

## 🏗️ Arquitetura do Sistema

O sistema é composto por quatro pilares principais:

### 1. A Configuração (`config.json`)
Arquivo central que controla todo o comportamento do sistema:
- **`feeds`**: Lista de feeds RSS monitorados (11+ portais de entretenimento).
- **`regras_casais`**: Regras de detecção por casal, com termos de busca (`pessoaA`, `pessoaB`) e categoria (`Real`, `Fake Ship`, `Internacional`).
- **`settings`**: Limite de notícias (`max_noticias: 200`) e User-Agent do scraper.
- Pode ser editado manualmente ou via painel de controle do dashboard.

### 2. O Garimpeiro (`scraper.js`)
Um script Node.js modular que atua como coletor automatizado:
- **Fontes**: Consome feeds RSS configurados em `config.json` (G1, Folha, Metrópoles, UOL, Hugo Gloss, Extra, Portal Leo Dias, Revista Caras, Revista Quem, etc).
- **Filtros**: Lê as `regras_casais` do `config.json` para identificar se uma matéria menciona simultaneamente as duas pessoas de um casal.
- **Categorização**: Cada notícia é tagueada com a categoria do casal (Real, Fake Ship, Internacional).
- **Robustez**: Implementa limpeza de XML (`limparXML`) para lidar com BOM, espaços em branco e feeds mal-formados. URLs são sanitizadas com `.trim()`.
- **Metadados**: O `data.json` inclui um campo `last_updated` (timestamp da última execução) e o array `news` com todas as notícias.
- **Limite**: Trunca automaticamente o acervo ao limite configurado para manter performance.

### 3. O Servidor (`server.js`)
API construída com Express para servir o dashboard e gerenciar configurações:
- **Static Host**: Serve `index.html` e arquivos estáticos.
- **`GET /data.json`**: Serve o acervo de notícias.
- **`GET /config`**: Retorna a configuração atual.
- **`POST /config`**: Salva alterações na configuração (adicionar/remover casais).
- **`POST /scrape`**: Dispara uma execução do `scraper.js` sob demanda.

### 4. O Dashboard (`index.html`)
Interface premium com tema dark e glassmorphism:
- **Status em Tempo Real**: Badge "Robô Ativo" com pulse animado e timestamp da última sincronização.
- **Contadores Animados**: Total de notícias no acervo com animação de contagem.
- **Silêncio Editorial**: Tempo desde a última publicação (baseado em `data_publicacao`).
- **Gráfico de Atividade**: Últimos 7 dias de publicações (Chart.js com tema neon).
- **Rankings**: Veículos de imprensa e casais (alvos de ship) mais frequentes.
- **Tags de Categoria**: Cada notícia exibe sua categoria com cor diferenciada (azul=Real, âmbar=Fake Ship, roxo=Internacional).
- **Central de Inteligência** (⚙️ - canto inferior direito):
  - Listar casais monitorados.
  - Adicionar novos casais com termos de busca e categoria.
  - Remover casais (oculta do dashboard, mas preserva histórico no `data.json`).
  - Sincronizar alterações com o `config.json`.
  - Iniciar varredura manual do scraper.

## 📊 Estrutura de Dados (`data.json`)
```json
{
  "last_updated": "2026-03-29T05:29:31.407Z",
  "news": [
    {
      "url": "https://...",
      "titulo": "[Casal] Frase irônica gerada automaticamente.",
      "veiculo": "Metrópoles Celebridades",
      "casal_referenciado": "Paolla & Diogo",
      "categoria": "Real",
      "data_publicacao": "2026-03-14T...",
      "data_registro": "2026-03-14T..."
    }
  ]
}
```

## 🔒 CI/CD (`fofoca-bot.yml`)
O GitHub Actions executa o scraper a cada 4 horas:
1. Instala dependências (`npm install`).
2. Roda validação (`npm test`).
3. Executa garimpo (`node scraper.js`).
4. Commit/push automático do `data.json` (requer `permissions: contents: write`).

## 🛠️ Tecnologias
- **Backend**: Node.js, Express, `rss-parser`.
- **Frontend**: HTML5, Tailwind CSS (CDN), Chart.js, Outfit (Google Fonts).
- **Design**: Glassmorphism, tema dark com neon rose, micro-animações.
- **CI/CD**: GitHub Actions com validação pré-commit.

---
> [!NOTE]
> Este projeto foi desenvolvido para fins didáticos e recreativos, demonstrando técnicas de web scraping, visualização de dados e design de interfaces modernas.

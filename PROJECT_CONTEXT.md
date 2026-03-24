# Projeto: Termômetro da Encheção de Linguiça 🌭

Este projeto é uma ferramenta bem-humorada projetada para monitorar, filtrar e arquivar notícias de celebridades de "baixa relevância" (futilidades) publicadas em grandes portais brasileiros. O foco principal é rastrear menções a casais específicos e visualizar o volume dessa produção editorial ao longo do tempo.

## 🎯 Objetivo
O "Termômetro" visa quantificar o esforço dos portais de notícias em manter o público informado sobre detalhes triviais da vida de celebridades, transformando fofoca em dados estruturados.

## 🏗️ Arquitetura do Sistema

O sistema é composto por três pilares principais:

### 1. O Garimpeiro (`scraper.js`)
Um script Node.js que atua como um coletor automatizado:
- **Fontes**: Consome feeds RSS de portais como G1 Pop & Arte, Metrópoles, UOL (Contigo!, Hugo Gloss, Caras) e Portal Leo Dias.
- **Filtros**: Utiliza o objeto `REGRAS_CASAIS` para identificar se uma matéria menciona simultaneamente as duas pessoas de um casal (ex: Paolla Oliveira & Diogo Nogueira).
- **Armazenamento**: Salva as ocorrências confirmadas no arquivo `data.json`.

### 2. O Servidor (`server.js`)
Uma API simples construída com Express:
- **Static Host**: Serve a interface web (`index.html`).
- **API `/api/add`**: Permite que o usuário adicione manualmente matérias que o robô possa ter deixado passar, validando se a notícia é "válida" (contém o casal) antes de gravar.

### 3. O Dashboard (`index.html`)
Uma interface rica e responsiva para visualização:
- **Estatísticas**: Contador total de "pérolas" jornalísticas.
- **Gráfico de Evolução**: Linha do tempo mostrando picos de futilidade por dia (Chart.js).
- **Rankings**: Lista os veículos de imprensa que mais "enchem linguiça".

## 📊 Estrutura de Dados (`data.json`)
Cada entrada no acervo segue o formato:
- `url`: Link original da matéria.
- `titulo`: Título da notícia.
- `veiculo`: Nome do portal (ex: "Metrópoles").
- `casal_referenciado`: Identificador do casal (ex: "Paolla & Diogo").
- `data_registro`: Timestamp de quando entrou no sistema.

## 🛠️ Tecnologias
- **Backend**: Node.js, Express, `rss-parser`.
- **Frontend**: HTML5, Tailwind CSS, Chart.js.
- **Proxy**: AllOrigins (para burlar bloqueios de CORS ao ler títulos de sites externos).

---
> [!NOTE]
> Este projeto foi desenvolvido para fins didáticos e recreativos, demonstrando técnicas de web scraping e visualização de dados.

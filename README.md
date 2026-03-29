# 🌭 Termômetro da Encheção de Linguiça

O **Termômetro da Encheção de Linguiça** é um robô (scraper) e dashboard para monitorar o esforço da internet em produzir notícias irrelevantes sobre casais de celebridades específicos.

Projeto **local-first**, utilizando arquivos JSON para armazenamento e configuração — zero dependência de banco de dados externo.

## 🚀 Como Funciona

1.  **Garimpo Automático**: O script `scraper.js` lê 11+ feeds RSS de portais de entretenimento a cada 4 horas via GitHub Actions.
2.  **Filtro Cirúrgico**: Detecta automaticamente qual casal está sendo mencionado usando termos configuráveis (ex: "paolla", "oliveira", "diogo", "nogueira").
3.  **Frases Irônicas**: Substitui o título original por uma frase sarcástica gerada aleatoriamente (40+ opções).
4.  **Categorização**: Cada casal possui uma categoria (Real, Fake Ship, Internacional) exibida como tag colorida no dashboard.
5.  **Acervo Local**: Notícias confirmadas são salvas em `data.json` com metadados e timestamp de última atualização.
6.  **Dashboard Premium**: Interface glassmorphism com contadores animados, gráficos, rankings e status do robô em tempo real.

## 🛠️ Tecnologias

- **Node.js** + **Express**: Motor do robô e servidor local.
- **RSS-Parser**: Leitura de 11+ feeds de portais (G1, Folha, UOL, Metrópoles, Revista Quem, etc).
- **Chart.js**: Visualização de dados com gráficos estilizados.
- **Tailwind CSS**: Estilização com tema dark e glassmorphism.
- **GitHub Actions**: Automação do garimpo a cada 4 horas.

## 📦 Instalação

```bash
# Clone o repositório
git clone <url-do-seu-repo>

# Entre na pasta
cd enchendolinguica

# Instale as dependências
npm install
```

## 🖥️ Uso

### Iniciar o Dashboard
```bash
npm start
```
Acesse: [http://localhost:3000](http://localhost:3000)

> **Importante**: O dashboard deve ser acessado via `localhost:3000` para que todas as funcionalidades (salvar configurações, disparar varreduras) funcionem corretamente.

### Executar o Garimpo Manualmente
```bash
node scraper.js
```

### Rodar Testes de Validação
```bash
npm test
```

## ⚙️ Gestão Dinâmica de Casais

O sistema permite adicionar e remover casais monitorados **diretamente pelo dashboard**, sem editar código:

1.  Acesse `http://localhost:3000`.
2.  Clique no ícone de **Engrenagem** (⚙️) no canto inferior direito.
3.  Na **Central de Inteligência**:
    - **Adicionar**: Clique em "+ Adicionar Novo", preencha nome, termos de busca e categoria.
    - **Remover**: Clique no ícone de lixeira (🗑️) ao lado do casal.
4.  Clique em **"Sincronizar Arquivo"** para salvar no `config.json`.
5.  Clique em **"Iniciar Varredura"** para buscar fofocas imediatamente.

> **Nota**: Remover um casal oculta suas matérias do dashboard, mas preserva o histórico no `data.json`. Ao reativar o casal, as matérias reaparecem automaticamente.

Alternativamente, você pode editar o arquivo `config.json` diretamente.

## 📂 Estrutura do Projeto

| Arquivo | Descrição |
|---|---|
| `index.html` | Dashboard com UI glassmorphism e painel de configurações |
| `server.js` | Servidor Express com API de configuração (`GET/POST /config`, `POST /scrape`) |
| `scraper.js` | Robô de garimpo modular (lê `config.json`) |
| `config.json` | Configuração de feeds RSS, regras de casais e categorias |
| `data.json` | Acervo de notícias com metadados (`last_updated`, `news[]`) |
| `tests/validate-data.js` | Validação de integridade do acervo |
| `.github/workflows/fofoca-bot.yml` | CI/CD — garimpo automático a cada 4h |

## 📊 Formato dos Dados (`data.json`)

```json
{
  "last_updated": "2026-03-29T05:29:31.407Z",
  "news": [
    {
      "url": "https://...",
      "casal_referenciado": "Paolla & Diogo",
      "titulo": "[Paolla & Diogo] Frase irônica gerada.",
      "veiculo": "Metrópoles Celebridades",
      "categoria": "Real",
      "data_publicacao": "2026-03-14T...",
      "data_registro": "2026-03-14T..."
    }
  ]
}
```

## 🤖 Automação (GitHub Actions)

O workflow `fofoca-bot.yml` executa automaticamente a cada 4 horas:
1.  Instala dependências.
2.  Roda `npm test` (validação de integridade).
3.  Executa `node scraper.js`.
4.  Faz commit/push automático do `data.json` atualizado.

O workflow possui `permissions: contents: write` para permitir push automático.

---
*Desenvolvido para monitorar a (falta de) utilidade pública das pautas jornalísticas modernas.*

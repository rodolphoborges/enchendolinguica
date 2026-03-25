# 🌭 Termômetro da Encheção de Linguiça

O **Termômetro da Encheção de Linguiça** é um robô (scraper) e um dashboard para monitorar o esforço da internet em produzir notícias irrelevantes sobre casais de celebridades específicos. 

Este projeto foi refatorado para ser **local-first**, utilizando um arquivo JSON para armazenamento, tornando-o independente de serviços de banco de dados externos como o Supabase.

## 🚀 Como Funciona

1.  **Garimpo (Automático)**: Um script Node.js (`scraper.js`) lê diversos feeds RSS de portais de entretenimento.
2.  **Filtro Cirúrgico Inteligente**: O sistema detecta automaticamente qual casal está sendo mencionado na URL/título usando sinônimos expandidos (ex: "paolla", "oliveira", "diogo", "nogueira" para Paolla & Diogo).
3.  **Geração Automática de Frases Irônicas**: Ao invés de usar o título original, o sistema gera automaticamente uma frase irônica aleatória dentre 20 opções, mantendo a proposta satírica do projeto.
4.  **Acervo Local**: As notícias confirmadas são salvas em `data.json` com comentários sarcásticos.
5.  **Dashboard**: Uma interface web (`index.html`) exibe:
    - Total de fofocas catalogadas
    - **Contador de tempo sem notícias** (zera automaticamente quando nova notícia é adicionada)
    - Gráfico de evolução temporal
    - Ranking dos portais mais "produtivos"

## 🛠️ Tecnologias

- **Node.js**: Motor do robô e servidor.
- **Express**: Servidor local para o dashboard e API de gravação.
- **RSS-Parser**: Para leitura dos feeds dos portais.
- **Chart.js**: Para visualização dos dados.
- **Tailwind CSS**: Estilização do dashboard.
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

### Executar o Garimpo Manualmente
Para rodar o robô agora mesmo e procurar novas fofocas:
```bash
node scraper.js
```

### Iniciar o Dashboard
Para ver o gráfico e as estatísticas no seu navegador:
```bash
node server.js
```
Acesse: [http://localhost:3000](http://localhost:3000)

### Adicionar Notícias Manualmente (via Dashboard)
1. Cole a URL da notícia no campo indicado
2. Clique em "Eternizar"
3. O sistema automaticamente:
   - Detecta qual casal está sendo mencionado (sem necessidade de seleção manual)
   - Gera uma frase irônica aleatória para substituir o título original
   - Salva no acervo JSON

**Casais Monitorados:**
- **Paolla & Diogo**: Detecta variações como "paolla", "paola", "oliveira", "diogo", "nogueira"
- **Bruna & Shawn Mendes**: Detecta variações como "bruna", "marquezine", "shawn", "mendes"

## 🤖 Automação (GitHub Actions)

O projeto está configurado para rodar o `scraper.js` automaticamente via GitHub Actions. Toda vez que novas fofocas são encontradas, o robô faz um commit automático do `data.json` de volta para o repositório, garantindo que o dashboard esteja sempre atualizado.

## 📂 Formato dos Dados (`data.json`)

```json
[
  {
    "url": "https://...",
    "casal_referenciado": "Nome do Casal",
    "titulo": "Título da Notícia",
    "veiculo": "Portal X",
    "data_publicacao": "2026-03-14",
    "data_registro": "2026-03-14T..."
  }
]
```

---
*Desenvolvido para monitorar a (falta de) utilidade pública das pautas jornalísticas modernas.*

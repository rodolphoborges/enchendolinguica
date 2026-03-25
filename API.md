# 📖 Documentação da API - Termômetro da Encheção de Linguiça

Esta API é fornecida pelo servidor Express em `server.js` e permite a interação com o acervo de futilidades.

## Endpoints

### 1. `GET /data.json`
Retorna a lista completa de matérias arquivadas.

**Resposta de Sucesso:**
- **Código:** 200 OK
- **Corpo:** Array de objetos de matérias.

---

### 2. Uso Estático
O servidor também serve o diretório raiz como arquivos estáticos. Portanto, acessar a raiz (`/`) carregará o arquivo `index.html` automaticamente.

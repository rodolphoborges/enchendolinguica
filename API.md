# 📖 Documentação da API - Termômetro da Encheção de Linguiça

Esta API é fornecida pelo servidor Express em `server.js` e permite a interação com o acervo de futilidades.

## Endpoints

### 1. `GET /data.json`
Retorna a lista completa de matérias arquivadas.

**Resposta de Sucesso:**
- **Código:** 200 OK
- **Corpo:** Array de objetos de matérias.

---

### 2. `POST /api/add`
Adiciona uma nova matéria manualmente ao acervo. O servidor realiza uma validação básica para evitar duplicatas e ordena o acervo por data após a inserção.

**Corpo da Requisição (JSON):**
```json
{
  "url": "string (obrigatório)",
  "casal_referenciado": "string (obrigatório)",
  "titulo": "string (obrigatório)",
  "veiculo": "string (obrigatório)"
}
```

**Respostas:**
- **200 OK**: `{ "success": true }`
- **400 Bad Request**: `{ "error": "Esta matéria já está no acervo." }`
- **500 Internal Server Error**: Erros de escrita em disco ou JSON inválido no servidor.

## Uso Estático
O servidor também serve o diretório raiz como arquivos estáticos. Portanto, acessar a raiz (`/`) carregará o arquivo `index.html` automaticamente.

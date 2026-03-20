const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(__dirname));

// Endpoint para carregar os dados
app.get('/data.json', (req, res) => {
    if (!fs.existsSync(DATA_FILE)) {
        return res.json([]);
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
});

// Endpoint para adicionar manualmente via dashboard
app.post('/api/add', (req, res) => {
    const { url, casal_referenciado, titulo, veiculo } = req.body;
    
    let acervo = [];
    if (fs.existsSync(DATA_FILE)) {
        acervo = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }

    if (acervo.some(m => m.url === url)) {
        return res.status(400).json({ error: 'Esta matéria já está no acervo.' });
    }

    const novaMateria = {
        url,
        casal_referenciado,
        titulo,
        veiculo,
        data_publicacao: new Date().toISOString(), // Ou extraído do metadado se preferir
        data_registro: new Date().toISOString()
    };

    acervo.push(novaMateria);
    acervo.sort((a, b) => new Date(a.data_registro) - new Date(b.data_registro));
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(acervo, null, 2));
    
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Dashboard disponível no navegador.`);
});

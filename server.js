const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
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



app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Dashboard disponível no navegador.`);
});

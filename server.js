const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, 'data.json');
const CONFIG_FILE = path.join(__dirname, 'config.json');

app.use(express.json());
app.use(express.static(__dirname));

// Endpoint para carregar os dados
app.get('/data.json', (req, res) => {
    if (!fs.existsSync(DATA_FILE)) return res.json({ news: [] });
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
});

// Endpoint para carregar a configuração
app.get('/config', (req, res) => {
    if (!fs.existsSync(CONFIG_FILE)) return res.status(404).json({ error: 'Config file not found' });
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    res.json(JSON.parse(data));
});

// Endpoint para salvar a configuração
app.post('/config', (req, res) => {
    try {
        const newConfig = req.body;
        // Validação básica
        if (!newConfig.regras_casais || !newConfig.feeds) {
            return res.status(400).json({ error: 'Invalid config structure' });
        }
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
        res.json({ message: 'Config saved successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Endpoint para disparar o scraper manualmente
app.post('/scrape', (req, res) => {
    console.log('🤖 Disparando scraper via API...');
    exec('node scraper.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao rodar scraper: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        console.log(`Scraper output: ${stdout}`);
        res.json({ message: 'Scraping finished', output: stdout });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Dashboard disponível no navegador.`);
});

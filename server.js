const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, 'data.json');

// Frases irônicas aleatórias (mesmas do scraper)
const FRASES_IRONICAS = [
    "Breaking news: romance persiste apesar dos pesares.",
    "Jornalismo de ponta: cobrindo o que realmente importa para a humanidade.",
    "A imprensa cumprindo seu papel: nos distrair com carinho alheio.",
    "Mais uma prova de que o amor vence na vida real e nas telas.",
    "Especialistas confirmam: casal continua existindo.",
    "Flagrante histórico pode mudar rumo da civilização.",
    "Fontes seguras indicam: sentimentos ainda são relevantes.",
    "Novo capítulo da saga romântica que todos acompanhávamos.",
    "Surpresa: celebridades demonstram afeto publicamente.",
    "Análise profunda revela: casal troca olhares e gestos.",
    "Plantão urgente: nada mudou, mas estamos aqui mesmo assim.",
    "Repórteres de elite cobram detalhes do relacionamento alheio.",
    "Exclusivo: fontes confirmam óbvio ululante sobre o casal.",
    "Investigação minuciosa aponta: romance segue firme e forte.",
    "Documentado: prova concreta de que se gostam.",
    "Alerta máximo: demonstração de carinho em via pública.",
    "Registro histórico: mais um dia de relacionamento estável.",
    "Furo de reportagem: casal não terminou (ainda).",
    "Bomba: fontes revelam que continuam juntos.",
    "Impactante: evidências de que o amor permanece."
];

function gerarFraseIronica() {
    const indice = Math.floor(Math.random() * FRASES_IRONICAS.length);
    return FRASES_IRONICAS[indice];
}

app.use(express.json());
app.use(express.static(__dirname));

const REGRAS_CASAIS = {
    "Paolla & Diogo": {
        pessoaA: ["paolla", "paola", "oliveira"],
        pessoaB: ["diogo", "nogueira"]
    },
    "Bruna & Shawn Mendes": {
        pessoaA: ["bruna", "marquezine"],
        pessoaB: ["shawn", "mendes"]
    }
};

function detectarCasal(url, titulo = '') {
    const textoAnalise = `${url} ${titulo}`.toLowerCase();
    
    for (const [casal, regras] of Object.entries(REGRAS_CASAIS)) {
        const temPessoaA = regras.pessoaA.some(termo => textoAnalise.includes(termo));
        const temPessoaB = regras.pessoaB.some(termo => textoAnalise.includes(termo));
        
        if (temPessoaA && temPessoaB) {
            return casal;
        }
    }
    return null;
}

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const request = protocol.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        });
        request.on('error', reject);
        request.setTimeout(5000, () => {
            request.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function extrairMetadados(url) {
    try {
        const response = await fetchUrl(url);
        const html = response.data;
        
        // Extrair título do HTML
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const titulo = titleMatch ? titleMatch[1].trim() : '';
        
        return { titulo, sucesso: true };
    } catch (error) {
        console.error('Erro ao extrair metadados:', error.message);
        return { titulo: '', sucesso: false };
    }
}

// Endpoint para carregar os dados
app.get('/data.json', (req, res) => {
    if (!fs.existsSync(DATA_FILE)) {
        return res.json([]);
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
});

// Endpoint para adicionar manualmente via dashboard (agora automático)
app.post('/api/add', async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL é obrigatória.' });
    }
    
    let acervo = [];
    if (fs.existsSync(DATA_FILE)) {
        acervo = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }

    if (acervo.some(m => m.url === url)) {
        return res.status(400).json({ error: 'Esta matéria já está no acervo.' });
    }

    // Extrair metadados da URL
    console.log(`🔍 Analisando URL: ${url}`);
    const metadados = await extrairMetadados(url);
    
    // Detectar casal baseado na URL e título extraído
    const casal = detectarCasal(url, metadados.titulo);
    
    if (!casal) {
        return res.status(400).json({ 
            error: 'Não foi possível identificar o casal nesta notícia. Verifique se a matéria menciona ambos os nomes do casal monitorado.',
            debug: { url, tituloExtraido: metadados.titulo }
        });
    }

    // Gerar frase irônica automaticamente
    const fraseIronica = gerarFraseIronica();
    const veiculo = new URL(url).hostname.replace('www.', '');

    const novaMateria = {
        url,
        casal_referenciado: casal,
        titulo: `[${casal}] ${fraseIronica}`,
        veiculo,
        data_publicacao: new Date().toISOString(),
        data_registro: new Date().toISOString()
    };

    acervo.push(novaMateria);
    acervo.sort((a, b) => new Date(a.data_registro) - new Date(b.data_registro));
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(acervo, null, 2));
    
    console.log(`✅ Notícia adicionada: ${novaMateria.titulo}`);
    res.json({ success: true, materia: novaMateria });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Dashboard disponível no navegador.`);
});

const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

// Inicializa o arquivo se não existir
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

function carregarDados() {
    try {
        const conteudo = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(conteudo);
    } catch (e) {
        return [];
    }
}

function salvarDados(dados) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dados, null, 2));
}

// Truque para furar os firewalls
const parser = new Parser({
    headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml; q=0.1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
});

// Pelotão de Elite da Fofoca (Feeds estáveis e com XML validado)
const FEEDS = [
    { veiculo: 'G1 Pop & Arte', url: 'https://g1.globo.com/dynamo/pop-arte/rss2.xml' },
    { veiculo: 'Metrópoles Celebridades', url: 'https://www.metropoles.com/celebridades/feed' },
    { veiculo: 'Contigo! (UOL)', url: 'https://contigo.uol.com.br/feed/' },
    { veiculo: 'Hugo Gloss (UOL)', url: 'https://hugogloss.uol.com.br/feed/' },
    { veiculo: 'Portal Leo Dias', url: 'https://portalleodias.com/feed/' },
    { veiculo: 'Revista Caras', url: 'https://caras.uol.com.br/feed/' }
];

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

async function iniciarGarimpo() {
    console.log("🤖 A iniciar o garimpo cirúrgico de futilidades...");
    let inseridas = 0;
    const acervo = carregarDados();

    for (const feedConfig of FEEDS) {
        try {
            console.log(`📡 A ler o feed de: ${feedConfig.veiculo}...`);
            const feed = await parser.parseURL(feedConfig.url);

            for (const item of feed.items) {
                const titulo = item.title || '';
                const link = item.link || '';
                const textoAnalise = `${titulo} ${link}`.toLowerCase();

                for (const [casal, regras] of Object.entries(REGRAS_CASAIS)) {
                    const temPessoaA = regras.pessoaA.some(termo => textoAnalise.includes(termo));
                    const temPessoaB = regras.pessoaB.some(termo => textoAnalise.includes(termo));

                    if (temPessoaA && temPessoaB) {
                        // Verifica se já existe para evitar duplicados
                        if (acervo.some(m => m.url === link)) {
                            continue;
                        }

                        console.log(`🚨 Fofoca Confirmada! [${casal}] -> ${titulo}`);
                        
                        const dataPublicacaoReal = item.isoDate || new Date().toISOString();
                        
                        acervo.push({ 
                            url: link, 
                            casal_referenciado: casal, 
                            titulo: titulo, 
                            veiculo: feedConfig.veiculo,
                            data_publicacao: dataPublicacaoReal,
                            data_registro: new Date().toISOString()
                        });
                        inseridas++;
                        console.log("✅ Guardado com sucesso no Acervo.");
                    }
                }
            }
        } catch (err) {
            console.error(`❌ Erro ao ler ${feedConfig.veiculo}:`, err.message);
        }
    }
    
    if (inseridas > 0) {
        salvarDados(acervo.sort((a, b) => new Date(a.data_registro) - new Date(b.data_registro)));
    }

    console.log(`🏁 Garimpo finalizado! ${inseridas} novas pérolas eternizadas.`);
    process.exit(0); 
}

iniciarGarimpo();

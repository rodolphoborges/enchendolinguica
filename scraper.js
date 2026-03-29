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

// Frases irônicas aleatórias
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
    "Impactante: evidências de que o amor permanece.",
    "Urgente: casal continua respirando o mesmo oxigênio.",
    "Revelação bombástica: eles ainda se seguem no Instagram.",
    "Ciência explica: a gravidade ainda mantém o casal unido.",
    "Exclusivo: fontes próximas confirmam que o sol nasceu para ambos.",
    "Marco histórico: mais de 24 horas sem boatos de separação.",
    "Análise técnica: o nível de 'ship' permanece estável na bolsa.",
    "Furo: paparazzi confirmam que eles comem comida, como humanos.",
    "Plantão fofoca: a paz mundial depende deste relacionamento.",
    "Relatório especial: o amor não é apenas uma construção social.",
    "Bomba: eles foram vistos em um lugar, fazendo coisas.",
    "Incrível: o carinho mútuo ainda é legalizado por lei.",
    "Notícia de última hora: o amor é lindo, e o clique é lucro.",
    "Investigação: a química do casal desafia as leis da termodinâmica.",
    "Alerta de fofura: o nível de glicose na internet subiu 20%.",
    "Documentário: a vida segue, e o casal também, aparentemente.",
    "Extra: fontes revelam que eles conversam um com o outro.",
    "Urgente: nada de novo no front, mas o feed precisa rodar.",
    "Sensacional: demonstração de afeto em 4K disponível.",
    "Histórico: o primeiro beijo do dia (provavelmente) já aconteceu.",
    "Basta: o mundo para para ver o casal passear com o cachorro."
];

function gerarFraseIronica() {
    const indice = Math.floor(Math.random() * FRASES_IRONICAS.length);
    return FRASES_IRONICAS[indice];
}

// Truque para furar os firewalls
const parser = new Parser({
    headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml; q=0.1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    },
    customFields: {
        item: ['content', 'description']
    }
});

// Pelotão de Elite da Fofoca (Feeds estáveis e com XML validado)
const FEEDS = [
    { veiculo: 'G1 Pop & Arte', url: 'https://g1.globo.com/dynamo/pop-arte/rss2.xml' },
    { veiculo: 'Folha de S.Paulo', url: 'https://feeds.folha.uol.com.br/rss091.xml' },
    { veiculo: 'Metrópoles Leo Dias', url: 'https://www.metropoles.com/colunas/leo-dias/feed' },
    { veiculo: 'Metrópoles Celebridades', url: 'https://www.metropoles.com/celebridades/feed' },
    { veiculo: 'UOL Splash', url: 'https://rss.uol.com.br/feed/noticias.xml' },
    { veiculo: 'Extra Famosos', url: 'https://extra.globo.com/famosos/rss.xml' },
    { veiculo: 'Contigo! (UOL)', url: 'https://contigo.uol.com.br/rss' },
    { veiculo: 'Hugo Gloss (UOL)', url: 'https://hugogloss.uol.com.br/feed/' },
    { veiculo: 'Portal Leo Dias', url: 'https://portalleodias.com/feed/' },
    { veiculo: 'Revista Caras', url: 'https://caras.uol.com.br/feed/' },
    { veiculo: 'Revista Quem', url: 'https://revistaquem.globo.com/rss/quem' }
];

const REGRAS_CASAIS = {
    "Paolla & Diogo": {
        pessoaA: ["paolla", "paola", "oliveira"],
        pessoaB: ["diogo", "nogueira"]
    },
    "Bruna & Shawn Mendes": {
        pessoaA: ["bruna", "marquezine"],
        pessoaB: ["shawn", "mendes"]
    },
    "Vini Jr & Virgínia": {
        pessoaA: ["vinicius jr", "vinícius jr", "vini jr", "vini junior", "vinicius junior", "vinícius junior"],
        pessoaB: ["virginia", "virgínia"]
    }
};

function limparXML(xml) {
    if (!xml) return '';
    // Remove BOM (Byte Order Mark) se presente
    let limpo = xml.replace(/^\ufeff/g, '');
    // Remove espaços em branco no início e fim
    limpo = limpo.trim();
    // Garante que começa com < (evita erros de "Non-whitespace before first tag")
    const match = limpo.match(/<[\s\S]*/);
    let finalXml = match ? match[0] : limpo;
    
    // Suporte para feeds mal-formados como o do UOL que vêm sem versão
    if (finalXml.startsWith('<rss') && !finalXml.includes('version=')) {
        finalXml = finalXml.replace('<rss', '<rss version="2.0"');
    }
    
    return finalXml;
}

async function iniciarGarimpo() {
    console.log("🤖 A iniciar o garimpo cirúrgico de futilidades...");
    let inseridas = 0;
    const acervo = carregarDados();

    for (const feedConfig of FEEDS) {
        try {
            console.log(`📡 A ler o feed de: ${feedConfig.veiculo}...`);
            
            // Fetch manual para ter controle sobre o corpo da resposta
            const response = await fetch(feedConfig.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'application/rss+xml, application/xml, text/xml; q=0.9'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            }

            const xmlBruto = await response.text();
            const xmlLimpo = limparXML(xmlBruto);

            if (!xmlLimpo.startsWith('<')) {
                throw new Error(`Resposta não parece ser XML válido. Início: ${xmlLimpo.slice(0, 50)}`);
            }

            const feed = await parser.parseString(xmlLimpo);

            for (const item of feed.items) {
                const titulo = item.title || '';
                const link = (item.link || '').trim();
                const dataPublicacaoReal = item.isoDate || item.pubDate || new Date().toISOString();
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
                        
                        const fraseIronica = gerarFraseIronica();
                        
                        acervo.push({ 
                            url: link, 
                            casal_referenciado: casal, 
                            titulo: `[${casal}] ${fraseIronica}`,
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
            console.error(`❌ Erro ao ler ${feedConfig.veiculo}: ${err.message}`);
        }
    }
    
    if (inseridas > 0) {
        salvarDados(acervo.sort((a, b) => new Date(a.data_registro) - new Date(b.data_registro)));
    }

    console.log(`🏁 Garimpo finalizado! ${inseridas} novas pérolas eternizadas.`);
    process.exit(0); 
}

iniciarGarimpo();

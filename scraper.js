const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

// Carrega configurações modulares
const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));
const DATA_FILE = path.join(__dirname, 'data.json');

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

const parser = new Parser({
    headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml; q=0.1',
        'User-Agent': CONFIG.settings.user_agent
    },
    customFields: {
        item: ['content', 'description']
    }
});

function carregarDados() {
    try {
        if (!fs.existsSync(DATA_FILE)) return { last_updated: null, news: [] };
        const conteudo = fs.readFileSync(DATA_FILE, 'utf-8');
        if (!conteudo.trim()) return { last_updated: null, news: [] };
        
        const parsed = JSON.parse(conteudo);
        // Migração suave se for o formato antigo (array)
        if (Array.isArray(parsed)) {
            return { last_updated: new Date().toISOString(), news: parsed };
        }
        return parsed;
    } catch (e) {
        console.error(`❌ ERRO FATAL: Falha ao ler ou processar o arquivo de dados (${DATA_FILE}).`);
        console.error(`Detalhes: ${e.message}`);
        console.error("O processo foi interrompido para evitar a perda permanente de registros.");
        process.exit(1);
    }
}

function salvarDados(dados) {
    // Aplica o limite de notícias configurado
    if (dados.news.length > CONFIG.settings.max_noticias) {
        dados.news = dados.news.slice(-CONFIG.settings.max_noticias);
    }
    dados.last_updated = new Date().toISOString();
    
    // Backup antes de salvar
    try {
        if (fs.existsSync(DATA_FILE)) {
            fs.copyFileSync(DATA_FILE, `${DATA_FILE}.bak`);
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(dados, null, 2));
    } catch (err) {
        console.error(`❌ Erro ao salvar dados no arquivo: ${err.message}`);
    }
}

function limparXML(xml) {
    if (!xml) return '';
    let limpo = xml.replace(/^\ufeff/g, '');
    limpo = limpo.trim();
    const match = limpo.match(/<[\s\S]*/);
    let finalXml = match ? match[0] : limpo;
    if (finalXml.startsWith('<rss') && !finalXml.includes('version=')) {
        finalXml = finalXml.replace('<rss', '<rss version="2.0"');
    }
    return finalXml;
}

async function iniciarGarimpo() {
    console.log("🤖 A iniciar o garimpo cirúrgico de futilidades...");
    let inseridas = 0;
    const acervo = carregarDados();

    for (const feedConfig of CONFIG.feeds) {
        try {
            console.log(`📡 A ler o feed de: ${feedConfig.veiculo}...`);
            const response = await fetch(feedConfig.url, {
                headers: {
                    'User-Agent': CONFIG.settings.user_agent,
                    'Accept': 'application/rss+xml, application/xml, text/xml; q=0.9'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            }

            const xmlBruto = await response.text();
            const xmlLimpo = limparXML(xmlBruto);
            if (!xmlLimpo.startsWith('<')) throw new Error("XML Inválido");

            const feed = await parser.parseString(xmlLimpo);

            for (const item of feed.items) {
                const titulo = item.title || '';
                const link = (item.link || '').trim();
                const dataPublicacaoReal = item.isoDate || item.pubDate || new Date().toISOString();
                const textoAnalise = `${titulo} ${link}`.toLowerCase();

                for (const [casal, regras] of Object.entries(CONFIG.regras_casais)) {
                    const temPessoaA = regras.pessoaA.some(termo => textoAnalise.includes(termo));
                    const temPessoaB = regras.pessoaB.some(termo => textoAnalise.includes(termo));

                    if (temPessoaA && temPessoaB) {
                        // Sanitização básica de URL para evitar duplicatas por parâmetros de tracking
                        const linkBase = link.split('?')[0].toLowerCase().trim();
                        if (acervo.news.some(m => m.url.split('?')[0].toLowerCase().trim() === linkBase)) continue;

                        console.log(`🚨 Fofoca Confirmada! [${casal}] -> ${titulo}`);
                        acervo.news.push({ 
                            url: link, 
                            casal_referenciado: casal, 
                            titulo: `[${casal}] ${gerarFraseIronica()}`,
                            veiculo: feedConfig.veiculo,
                            categoria: regras.categoria || 'Geral',
                            data_publicacao: dataPublicacaoReal,
                            data_registro: new Date().toISOString()
                        });
                        inseridas++;
                    }
                }
            }
        } catch (err) {
            console.error(`❌ Erro ao ler ${feedConfig.veiculo}: ${err.message}`);
        }
    }
    
    if (inseridas > 0) {
        acervo.news.sort((a, b) => new Date(a.data_registro) - new Date(b.data_registro));
    }
    
    // Sempre salva para atualizar o 'last_updated' mesmo que não haja novas fofocas
    salvarDados(acervo);

    console.log(`🏁 Garimpo finalizado! ${inseridas} novas pérolas eternizadas.`);
    process.exit(0); 
}

iniciarGarimpo();

const Parser = require('rss-parser');
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase via Variáveis de Ambiente
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

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
                        console.log(`🚨 Fofoca Confirmada! [${casal}] -> ${titulo}`);
                        
                        // Captura a data real da matéria no RSS (ou usa a atual se falhar)
                        const dataPublicacaoReal = item.isoDate || new Date().toISOString();
                        
                        const { error } = await supabase.from('materias_inuteis').insert([
                            { 
                                url: link, 
                                casal_referenciado: casal, 
                                titulo: titulo, 
                                veiculo: feedConfig.veiculo,
                                data_publicacao: dataPublicacaoReal
                            }
                        ]);

                        if (error && error.code !== '23505') {
                            console.error("❌ Erro ao guardar:", error.message);
                        } else if (!error) {
                            inseridas++;
                            console.log("✅ Guardado com sucesso no Acervo.");
                        }
                    }
                }
            }
        } catch (err) {
            console.error(`❌ Erro ao ler ${feedConfig.veiculo}:`, err.message);
        }
    }
    
    console.log(`🏁 Garimpo finalizado! ${inseridas} novas pérolas eternizadas.`);
    
    // Força o encerramento imediato do robô, cortando a ligação com o banco de dados
    process.exit(0); 
}

iniciarGarimpo();

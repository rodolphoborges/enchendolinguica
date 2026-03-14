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

const FEEDS = [
    { veiculo: 'G1 Pop & Arte', url: 'https://g1.globo.com/dynamo/pop-arte/rss2.xml' },
    { veiculo: 'Metrópoles Celebridades', url: 'https://www.metropoles.com/celebridades/feed' },
    { veiculo: 'UOL Entretenimento', url: 'https://rss.uol.com.br/feed/entretenimento.xml' }
];

// O novo filtro cirúrgico: exige a presença de AMBOS para classificar como "fofoca de casal"
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
                    // Verifica se o texto tem pelo menos um termo da Pessoa A *E* um termo da Pessoa B
                    const temPessoaA = regras.pessoaA.some(termo => textoAnalise.includes(termo));
                    const temPessoaB = regras.pessoaB.some(termo => textoAnalise.includes(termo));

                    // Só é fofoca de casal se OS DOIS estiverem no radar da mesma matéria
                    if (temPessoaA && temPessoaB) {
                        console.log(`🚨 Fofoca Confirmada! [${casal}] -> ${titulo}`);
                        
                        const { error } = await supabase.from('materias_inuteis').insert([
                            { url: link, casal_referenciado: casal, titulo: titulo, veiculo: feedConfig.veiculo }
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
}

iniciarGarimpo();

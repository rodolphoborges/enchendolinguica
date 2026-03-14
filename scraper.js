const Parser = require('rss-parser');
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase via Variáveis de Ambiente
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const parser = new Parser();

const FEEDS = [
    { veiculo: 'Globo.com', url: 'https://gshow.globo.com/rss/c/tudo-mais/' },
    { veiculo: 'UOL', url: 'https://www.uol.com.br/splash/rss.xml' }
];

const PALAVRAS_CHAVE = {
    "Paolla & Diogo": ["paolla", "paola", "diogo", "oliveira", "nogueira"],
    "Bruna & Shawn Mendes": ["bruna", "marquezine", "shawn", "mendes"]
};

async function iniciarGarimpo() {
    console.log("🤖 A iniciar o garimpo de futilidades...");
    let inseridas = 0;

    for (const feedConfig of FEEDS) {
        try {
            console.log(`📡 A ler o feed de: ${feedConfig.veiculo}`);
            const feed = await parser.parseURL(feedConfig.url);

            for (const item of feed.items) {
                const titulo = item.title;
                const link = item.link;
                const textoAnalise = `${titulo} ${link}`.toLowerCase();

                for (const [casal, termos] of Object.entries(PALAVRAS_CHAVE)) {
                    const passouNoTeste = termos.some(termo => textoAnalise.includes(termo));

                    if (passouNoTeste) {
                        console.log(`🚨 Achado! [${casal}] -> ${titulo}`);
                        
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
            console.error(`Erro ao ler ${feedConfig.veiculo}:`, err.message);
        }
    }
    console.log(`🏁 Garimpo finalizado! ${inseridas} novas pérolas eternizadas.`);
}

iniciarGarimpo();

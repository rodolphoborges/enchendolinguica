const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

console.log('🔍 Iniciando validação do acervo (data.json)...');

try {
    if (!fs.existsSync(DATA_FILE)) {
        console.error('❌ Erro: data.json não encontrado!');
        process.exit(1);
    }

    const conteudo = fs.readFileSync(DATA_FILE, 'utf-8');
    const root = JSON.parse(conteudo);

    // Novo formato: { last_updated, news: [...] }
    if (!root.news || !Array.isArray(root.news)) {
        console.error('❌ Erro: Estrutura inválida. Esperado { last_updated, news: [] }');
        process.exit(1);
    }

    const dados = root.news;
    const camposObrigatorios = ['url', 'casal_referenciado', 'titulo', 'veiculo', 'data_publicacao', 'data_registro'];
    let erros = 0;

    dados.forEach((registro, index) => {
        camposObrigatorios.forEach(campo => {
            if (!registro[campo]) {
                console.error(`❌ Registro [${index}]: Campo '${campo}' está ausente ou vazio.`);
                erros++;
            }
        });

        if (registro.url && (registro.url.includes('\n') || registro.url.trim() !== registro.url)) {
            console.error(`❌ Registro [${index}]: URL malformada.`);
            erros++;
        }
    });

    if (erros > 0) {
        console.error(`\n❌ Falha na validação: ${erros} erros encontrados.`);
        process.exit(1);
    }

    console.log(`✅ Sucesso! Acervo de ${dados.length} notícias validado com sucesso.`);
    console.log(`🕒 Última atualização registrada: ${root.last_updated}`);
    process.exit(0);

} catch (e) {
    console.error('❌ Erro fatal durante a validação:', e.message);
    process.exit(1);
}

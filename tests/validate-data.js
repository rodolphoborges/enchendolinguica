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
    const dados = JSON.parse(conteudo);

    if (!Array.isArray(dados)) {
        console.error('❌ Erro: data.json deve ser uma lista (Array).');
        process.exit(1);
    }

    const camposObrigatorios = ['url', 'casal_referenciado', 'titulo', 'veiculo', 'data_publicacao', 'data_registro'];
    let erros = 0;

    dados.forEach((registro, index) => {
        camposObrigatorios.forEach(campo => {
            if (!registro[campo]) {
                console.error(`❌ Registro [${index}]: Campo '${campo}' está ausente ou vazio.`);
                erros++;
            }
        });

        // Validação extra de URL (não pode ter nova linha ou espaço no início)
        if (registro.url && (registro.url.includes('\n') || registro.url.trim() !== registro.url)) {
            console.error(`❌ Registro [${index}]: URL malformada (contém whitespace não limpo).`);
            erros++;
        }

        // Validação de data básica
        if (registro.data_publicacao && isNaN(new Date(registro.data_publicacao).getTime())) {
            console.error(`❌ Registro [${index}]: 'data_publicacao' inválida.`);
            erros++;
        }
    });

    if (erros > 0) {
        console.error(`\n❌ Falha na validação: ${erros} erros encontrados.`);
        process.exit(1);
    }

    console.log(`✅ Sucesso! Acervo de ${dados.length} notícias validado com sucesso.`);
    process.exit(0);

} catch (e) {
    console.error('❌ Erro fatal durante a validação:', e.message);
    process.exit(1);
}

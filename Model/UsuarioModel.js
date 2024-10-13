const Database = require("./database");

const db = new Database();

class UsuarioModel {
    constructor({
        usu_id = null,
        usu_nome = '',
        usu_cpf = '',
        usu_nascimento = '',
        usu_senha = '',
        usu_recrutador = 'N',
        usu_tel = '',
        usu_curriculo = null, // Novo campo para o currículo
    } = {}) {
        this.usu_id = usu_id;
        this.usu_nome = usu_nome;
        this.usu_cpf = usu_cpf;
        this.usu_nascimento = usu_nascimento;
        this.usu_senha = usu_senha;
        this.usu_recrutador = usu_recrutador;
        this.usu_tel = usu_tel;
        this.usu_curriculo = usu_curriculo; // Inicializa o campo do currículo
    }

    // Inserir um novo usuário
    static async criar(usuario) {
        const sql = 'INSERT INTO usuario (usu_nome, usu_cpf, usu_nascimento, usu_senha, usu_tel, usu_curriculo) VALUES (?, ?, ?, ?, ?, ?)'; // Adiciona o currículo na consulta
        const params = [
            usuario.usu_nome,
            usuario.usu_cpf,
            usuario.usu_nascimento,
            usuario.usu_senha,
            usuario.usu_tel,
            usuario.usu_curriculo, // Adiciona o currículo nos parâmetros
        ];
        const result = await db.executaComandoNonQuery(sql, params);
        return result.insertId ? new UsuarioModel({ ...usuario, usu_id: result.insertId }) : null;
    }
    static async obterTodos() {
        const sql = 'SELECT * FROM usuario';
        const result = await db.executaComando(sql);
        return result
    }

    // Método para obter currículo por ID de usuário
    static async obterCurriculo(usu_id) {
        const sql = 'SELECT usu_curriculo FROM usuario WHERE usu_id = ?';
        const params = [usu_id];
        const result = await db.executaComando(sql, params);
        return result[0] ? result[0].usu_curriculo : null; // Retorna o caminho do currículo
    }
    static async Autenticar(usu_cpf, usu_senha) {
        const sql = 'SELECT * FROM usuario WHERE usu_cpf = ? AND usu_senha = ?';
        const params = [usu_cpf, usu_senha];
        console.log('Executando SQL:', sql, 'Com parâmetros:', params); // Adicione este log
        const results = await db.executaComando(sql, params);
    
        if (results.length > 0) {
            return new UsuarioModel(results[0]);
        }
        return null;
    }
    
}

module.exports = UsuarioModel;

const Database = require("./database");

const db = new Database();

class UsuarioVagaModel {
    constructor({ usu_id = null, vag_id = null, data_inscricao = null } = {}) {
        this.usu_id = usu_id;
        this.vag_id = vag_id;
        this.data_inscricao = data_inscricao;
    }
       // Verificar se o usuário já está inscrito na vaga
       static async verificarInscricao(usu_id, vag_id) {
        const sql = 'SELECT COUNT(*) as count FROM usuario_vaga WHERE usu_id = ? AND vag_id = ?';
        const params = [usu_id, vag_id];
        const result = await db.executaComando(sql, params);
        return result[0].count > 0; // Retorna true se houver pelo menos uma inscrição
    }


    static async listarVagasPorUsuario(usu_id) {
        const sql = `
            SELECT v.vag_id, v.vag_cargo, v.vag_salario, v.vag_descricao, v.vag_local
            FROM vagas v
            INNER JOIN usuario_vaga uv ON v.vag_id = uv.vag_id
            WHERE uv.usu_id = ?
        `;
        const params = [usu_id];
        const results = await db.executaComando(sql, params);
        return results;
    }

    // Inserir uma nova relação entre usuário e vaga
    static async associar(vagaUsuario) {
        const sql = `
            INSERT INTO usuario_vaga (usu_id, vag_id, data_inscricao) 
            VALUES (?, ?, ?)
        `;
        const params = [
            vagaUsuario.usu_id,
            vagaUsuario.vag_id,
            vagaUsuario.data_inscricao,
        ];
        const result = await db.executaComandoNonQuery(sql, params);
        return result.insertId ? new UsuarioVagaModel({ ...vagaUsuario }) : null;
    }

    // Obter todos os usuários cadastrados em uma vaga
    static async ObterUsuariosPorVaga(vag_id) {
        const sql = `
            SELECT u.usu_id, u.usu_nome, u.usu_tel, u.usu_curriculo
            FROM usuario u
            INNER JOIN usuario_vaga uv ON u.usu_id = uv.usu_id
            WHERE uv.vag_id = ?
        `;
        const params = [vag_id];
        const results = await db.executaComando(sql, params);
    
        // Mapeia os resultados para incluir a URL do currículo
        const usuariosComCurriculo = results.map(usuario => {
            return {
                ...usuario,
                usu_curriculo: usuario.usu_curriculo ? `http://localhost:4000/${usuario.usu_curriculo.replace(/\\/g, '/')}` : null
            };
        });
    
        return usuariosComCurriculo;
    }
    

    // Buscar usuários por nome em uma vaga
    static async BuscarUsuariosPorNomeEmVaga(vag_id, nome) {
        const sql = `
            SELECT u.usu_id, u.usu_nome, u.usu_tel, u.usu_curriculo 
            FROM usuario u
            INNER JOIN usuario_vaga uv ON u.usu_id = uv.usu_id
            WHERE uv.vag_id = ? AND u.usu_nome LIKE ?
        `;
        const params = [vag_id, `%${nome}%`];
        const results = await db.executaComando(sql, params);
    
        // Mapeia os resultados para incluir a URL do currículo
        const usuariosComCurriculo = results.map(usuario => {
            return {
                ...usuario,
                usu_curriculo: usuario.usu_curriculo ? `http://localhost:4000/${usuario.usu_curriculo.replace(/\\/g, '/')}` : null
            };
        });
    
        return usuariosComCurriculo;
    }
    
}

module.exports = UsuarioVagaModel;

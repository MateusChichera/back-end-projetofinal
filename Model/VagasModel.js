const Database = require("./database");

const db = new Database();

class VagaModel {
    constructor({ vag_id = null, vag_cargo = '', vag_salario = '', vag_descricao = '', vag_local = '' } = {}) {
        this.vag_id = vag_id;
        this.vag_cargo = vag_cargo;
        this.vag_salario = vag_salario;
        this.vag_descricao = vag_descricao;
        this.vag_local = vag_local;
    }

    static async criar(vaga) {
        const sql = 'INSERT INTO vagas (vag_cargo, vag_salario, vag_descricao, vag_local) VALUES (?, ?, ?, ?)';
        const params = [vaga.vag_cargo, vaga.vag_salario, vaga.vag_descricao, vaga.vag_local];
        const result = await db.executaComandoNonQuery(sql, params);
        return result.insertId ? new VagaModel({ ...vaga, vag_id: result.insertId }) : null;
    }

    // Consultar todas as vagas
    static async ObterTodas() {
        const sql = 'SELECT * FROM vagas';
        const results = await db.executaComando(sql);
        return results.map(row => new VagaModel(row));
    }
    
    static async atualizar(vaga) {
        const sql = 'UPDATE vagas SET vag_cargo = ?, vag_salario = ?, vag_descricao = ?, vag_local = ? WHERE vag_id = ?';
        const params = [vaga.vag_cargo, vaga.vag_salario, vaga.vag_descricao, vaga.vag_local, vaga.vag_id];
        const result = await db.executaComandoNonQuery(sql, params);
        return result.affectedRows > 0 ? new VagaModel(vaga) : null;
    }

    // Excluir uma vaga por ID
    static async excluir(vag_id) {
        const sql = 'DELETE FROM vagas WHERE vag_id = ?';
        const params = [vag_id];
        const result = await db.executaComandoNonQuery(sql, params);
        return result.affectedRows > 0;
    }
}

module.exports = VagaModel;

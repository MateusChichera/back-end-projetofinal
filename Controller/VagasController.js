const VagaModel = require('../Model/VagasModel'); // Certifique-se de que o caminho está correto

class VagaController {
    async Obter(req, res) {
        try {
            const vagas = await VagaModel.ObterTodas();
            return res.status(200).json(vagas);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao obter vagas", error: error.message });
        }
    }

    async Inserir(req, res) {
        try {
            const vaga = new VagaModel(req.body);
            const vagaInserida = await VagaModel.criar(vaga);
            return res.status(200).json(vagaInserida);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao inserir vaga", error: error.message });
        }
    }

    async Excluir(req, res) {
        try {
            const { id } = req.params;
            const excluido = await VagaModel.excluir(id);
            return res.status(200).json({ message: "Vaga excluída com sucesso" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao excluir vaga", error: error.message });
        }
    }
}

module.exports = VagaController;

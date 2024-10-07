const UsuarioVagaModel = require('../Model/UsuarioVagaModel');


class UsuarioVagaController {

    async ObterPorUsuarioEVaga(req, res) {
        try {
            const { usu_id, vag_id } = req.params;
            const inscricao = await UsuarioVagaModel.ObterPorUsuarioEVaga(usu_id, vag_id);
            return res.status(200).json(inscricao);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao obter inscrição", error: error.message });
        }
    }

    async listarVagas(req, res) {
        try {
            const { usu_id } = req.params; // O ID do usuário pode ser passado como parâmetro da requisição
    
            const vagas = await UsuarioVagaModel.listarVagasPorUsuario(usu_id);
            if (vagas.length === 0) {
                return res.status(404).json({ message: "Nenhuma vaga encontrada para este usuário." });
            }
    
            return res.status(200).json(vagas);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao listar vagas", error: error.message });
        }
    }

  
    async Inserir(req, res) {
        try {
            const { usu_id, vag_id, data_inscricao } = req.body;
    
            // Verifica se o usuário já está inscrito na vaga
            const usuarioInscrito = await UsuarioVagaModel.verificarInscricao(usu_id, vag_id);
            if (usuarioInscrito) {
                return res.status(400).json({ message: "Usuário já se candidatou a esta vaga." });
            }
    
            const inscricao = new UsuarioVagaModel({
                usu_id,
                vag_id,
                data_inscricao,
            });
    
            // Associa o usuário à vaga
            const inscricaoInserida = await UsuarioVagaModel.associar(inscricao);
            
            // Retorna a resposta com mensagem de sucesso e os dados da inscrição
            return res.status(201).json({
                message: "Inscrição realizada com sucesso.",
            });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao inserir inscrição", error: error.message });
        }
    }
    
    
    // Buscar usuários cadastrados em uma vaga
    async ObterUsuariosPorVaga(req, res) {
        try {
            const { vag_id } = req.params;
            const usuarios = await UsuarioVagaModel.ObterUsuariosPorVaga(vag_id);
            return res.status(200).json(usuarios);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao obter usuários da vaga", error: error.message });
        }
    }

    // Buscar usuários por nome em uma vaga
    async BuscarUsuariosPorNomeEmVaga(req, res) {
        try {
            const { vag_id } = req.params;
            const { nome } = req.body; // Nome deve ser passado como um parâmetro de consulta
            const usuarios = await UsuarioVagaModel.BuscarUsuariosPorNomeEmVaga(vag_id, nome);
            return res.status(200).json(usuarios);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar usuários", error: error.message });
        }
    }

    // Excluir uma inscrição
    async Excluir(req, res) {
        try {
            const { usu_id, vag_id } = req.params;
            const excluido = await UsuarioVagaModel.Excluir(usu_id, vag_id);
            return res.status(200).json({ message: "Inscrição excluída com sucesso" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao excluir inscrição", error: error.message });
        }
    }
}


module.exports =  UsuarioVagaController

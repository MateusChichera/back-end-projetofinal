const UsuarioModel = require('../Model/UsuarioModel');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('../Midw/MulterConfig'); // Importe a configuração do multer
require('dotenv').config();

class UsuarioController {
    async Inserir(req, res) {
        try {
            const usuario = new UsuarioModel(req.body);
            
            // Verifica se um arquivo foi enviado
            if (req.file) {
                usuario.usu_curriculo = path.join('uploads', req.file.filename); // Define o caminho do currículo
            }
            
            const usuarioInserido = await UsuarioModel.criar(usuario);
            
            console.log('Usuário inserido:', usuarioInserido); // Log para depuração
    
            // Verifique se a inserção foi bem-sucedida
            if (usuarioInserido && usuarioInserido.usu_id) {
                return res.status(200).json({
                    message: 'Usuário cadastrado com sucesso',
                    id: usuarioInserido.usu_id // Retorna o ID do usuário
                });
            } else {
                console.log('Erro ao inserir usuário, retorno inesperado:', usuarioInserido); // Log para depuração
                return res.status(400).json({ message: "Erro ao cadastrar usuário, dados inválidos" });
            }
        } catch (error) {
            console.error('Erro ao inserir usuário:', error); // Log de erro
            return res.status(500).json({ message: "Erro ao inserir usuário", error: error.message });
        }
    }
    
    async obter(req,res){
        try{
            const listaUsuarios = await  UsuarioModel.obterTodos();
            return res.status(200).json(listaUsuarios);
        }catch(error){
            return res.status(500).json({message:"Erro ao obter usuarios"});
        }
    }
    

    async Excluir(req, res) {
        try {
            const { id } = req.params;
            const excluido = await UsuarioModel.excluir(id);
            return res.status(200).json({ message: "Usuário excluído com sucesso" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao excluir usuário", error: error.message });
        }
    }

    async Autenticar(req, res) {
        console.log('JWT Secret:', process.env.JWT_SECRET);
        try {
            const { cpf, senha } = req.body;
            console.log(`CPF: ${cpf}, Senha: ${senha}`);

            const usuario = await UsuarioModel.Autenticar(cpf, senha);
            console.log('Usuário retornado:', usuario);

            if (usuario) {
                const payload = {
                    id: usuario.usu_id,
                    nome: usuario.usu_nome
                };

                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 3600000 // UMA HORA 
                });

                return res.json({ message: 'Login bem-sucedido', token, nome: usuario.usu_nome, id: usuario.usu_id });
            } else {
                return res.status(401).json({ message: "Credenciais inválidas" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Erro ao autenticar usuário", error: error.message });
        }
    }

    // Método para obter o currículo de um usuário
    async obterCurriculo(req, res) {
        const { id } = req.params; // Obtém o ID do usuário dos parâmetros da rota
        try {
            const curriculo = await UsuarioModel.obterCurriculo(id); // Obtém o caminho do currículo do modelo
            if (curriculo) {
                // Retorna a URL completa
                const urlCompleta = `http://localhost:4000/${curriculo.replace(/\\/g, '/')}`; // Converte o caminho para usar barras normais
                return res.json({ curriculo: urlCompleta });
            } else {
                return res.status(404).json({ message: 'Currículo não encontrado' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao obter o currículo' });
        }
    }
}

module.exports = UsuarioController;

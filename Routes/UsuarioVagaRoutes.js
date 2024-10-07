const express = require('express');
const router = express.Router();
const  UsuarioVagaController = require('../Controller/UsuarioVagaController');

const usuarioVagaController = new UsuarioVagaController();


router.post('/',usuarioVagaController.Inserir); // FUNCIONANDO
router.get('/vagas/:usu_id', usuarioVagaController.listarVagas);  // FUNCIONANDO
router.get('/:vag_id', usuarioVagaController.ObterUsuariosPorVaga) //FUNCIONANDO
router.get('/buscar/:vag_id',usuarioVagaController.BuscarUsuariosPorNomeEmVaga); // FUNCIONANDO


router.delete('/inscricao/:usu_id/:vag_id', (req, res) => {
    usuarioVagaController.Excluir(req, res);
});

module.exports = router;

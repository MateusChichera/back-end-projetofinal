const express = require('express');
const VagaController = require('../Controller/VagasController');

const router = express.Router();
const vagaC = new VagaController();

// Rotas para Vagas
router.get('/', vagaC.Obter);                      
router.post('/', vagaC.Inserir);                 
router.delete('/:id', vagaC.Excluir); 

module.exports = router;

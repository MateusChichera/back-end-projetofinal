const express = require('express');
const UsuarioController = require('../Controller/UsuarioController');
const upload = require('../Midw/MulterConfig'); // Importando o multer

const router = express.Router();
const usuarioC = new UsuarioController();

// Rota para inserir um usuário
router.post('/', upload, usuarioC.Inserir);
router.post('/login', usuarioC.Autenticar);                
router.delete('/:id', usuarioC.Excluir);  
router.get('/curriculo/:id', usuarioC.obterCurriculo);
router.get('/', usuarioC.obter);

module.exports = router;

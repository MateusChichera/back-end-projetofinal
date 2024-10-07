require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path'); // Importa o módulo 'path' para manipulação de caminhos
const app = express();
const port = 4000;


// Importa as rotas
const usuarioRotas = require('./Routes/UsuarioRoutes');
const vagasRotas = require('./Routes/VagasRoutes');
const UsuarioVagaRotas = require('./Routes/UsuarioVagaRoutes');

// Middleware para servir arquivos estáticos na pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Configuração para acessar o currículo

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Configuração das rotas
app.use('/usuario', usuarioRotas);
app.use('/vagas', vagasRotas);
app.use('/inscricoes', UsuarioVagaRotas);

// Inicializa o servidor
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));

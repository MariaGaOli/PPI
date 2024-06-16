const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Arrays para armazenar dados (simulando um banco de dados)
let interessados = [];
let petsDisponiveis = [];
let adocoes = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1800000 } // 30 minutes
}));

// Configuração da view engine e diretório de views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para renderizar o formulário de login
app.get('/', (req, res) => {
    res.render('index', { error: null });
});

// Rota para processar o formulário de login (POST)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Lógica de autenticação aqui (exemplo simplificado)
    if (username === 'admin' && password === 'password') {
        req.session.loggedIn = true;
        // Atualiza o cookie de último acesso no login
        res.cookie('ultimoAcesso', new Date().toLocaleString(), { maxAge: 1800000 });
        res.redirect('/menu'); // Redireciona para o menu após o login
    } else {
        res.render('index', { error: 'Usuário ou senha incorretos' });
    }
});

// Rota protegida - menu principal
app.get('/menu', (req, res) => {
    if (req.session.loggedIn) {
        const ultimoAcesso = req.cookies.ultimoAcesso || 'Primeiro acesso';
        res.render('menu', { ultimoAcesso });
    } else {
        res.redirect('/'); // Redireciona para o login se não estiver autenticado
    }
});

// Rota para listar interessados
app.get('/interessados', (req, res) => {
    res.render('interessados/listar', { interessados });
});

// Rota para criar um interessado (formulário)
app.get('/interessados/criar', (req, res) => {
    res.render('interessados/criar');
});

// Rota para processar a criação de um interessado (POST)
app.post('/interessados', (req, res) => {
    const { nome, email, telefone } = req.body;
    const id = interessados.length + 1; // Gerar um ID simples
    interessados.push({ id, nome, email, telefone });
    res.redirect('/interessados');
});

// Rota para listar pets
app.get('/pets', (req, res) => {
    res.render('pets/listar', { pets: petsDisponiveis });
});

// Rota para criar um pet (formulário)
app.get('/pets/criar', (req, res) => {
    res.render('pets/criar');
});

// Rota para processar a criação de um pet (POST)
app.post('/pets', (req, res) => {
    const { nome, raca, idade } = req.body;
    const id = petsDisponiveis.length + 1; // Gerar um ID simples
    petsDisponiveis.push({ id, nome, raca, idade });
    res.redirect('/pets');
});

// Rota para listar as adoções feitas
app.get('/adocao/listar', (req, res) => {
    res.render('adocao/listar', { adocoes });
});

// Rota para criar adoção (formulário)
app.get('/adocao/criar', (req, res) => {
    res.render('adocao/criar', { interessados, pets: petsDisponiveis, error: null });
});

// Rota para processar a criação de uma adoção (POST)
app.post('/adocao/criar', (req, res) => {
    const { interessadoId, petId } = req.body;
    const interessado = interessados.find(i => i.id === parseInt(interessadoId));
    const pet = petsDisponiveis.find(p => p.id === parseInt(petId));

    if (interessado && pet) {
        const dataAdocao = new Date();
        const adocao = { interessado, pet, dataAdocao };
        adocoes.push(adocao);
        res.redirect('/adocao/listar');
    } else {
        res.render('adocao/criar', { error: 'Interessado ou Pet não encontrado', interessados, pets: petsDisponiveis });
    }
});

// Rota para logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Redirecionamento para criar uma adoção
app.get('/adocao', (req, res) => {
    res.redirect('/adocao/criar');
});

// Configurar a escuta do servidor
app.listen(PORT, () => {
    console.log(`Servidor está rodando em http://localhost:${PORT}`);
});

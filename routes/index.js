const express = require('express');

module.exports = (interessados, pets, adocoes) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        if (req.session.usuario) {
            res.redirect('/menu');
        } else {
            res.render('login');
        }
    });

    router.post('/login', (req, res) => {
        const { username, password } = req.body;
        if (username === 'admin' && password === 'password') {
            req.session.usuario = username;
            res.cookie('ultimoAcesso', new Date().toISOString(), { maxAge: 1800000 });
            res.redirect('/menu');
        } else {
            res.redirect('/');
        }
    });

    router.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    });

    router.get('/menu', (req, res) => {
        if (!req.session.usuario) {
            res.redirect('/');
        } else {
            const ultimoAcesso = req.cookies.ultimoAcesso || 'N/A';
            res.render('menu', { ultimoAcesso });
        }
    });

    return router;
};

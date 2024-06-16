const express = require('express');

module.exports = (interessados) => {
    const router = express.Router();

    router.get('/criar', (req, res) => {
        res.render('interessados/criar');
    });

    router.post('/criar', (req, res) => {
        const { nome, email, telefone } = req.body;
        if (!nome || !email || !telefone) {
            res.redirect('/interessados/criar');
        } else {
            interessados.push({ id: interessados.length + 1, nome, email, telefone });
            res.redirect('/interessados/listar');
        }
    });

    router.get('/listar', (req, res) => {
        res.render('interessados/listar', { interessados });
    });

    return router;
};

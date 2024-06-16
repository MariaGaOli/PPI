const express = require('express');

module.exports = (pets) => {
    const router = express.Router();

    router.get('/criar', (req, res) => {
        res.render('pets/criar');
    });

    router.post('/criar', (req, res) => {
        const { nome, raca, idade } = req.body;
        if (!nome || !raca || !idade) {
            res.redirect('/pets/criar');
        } else {
            pets.push({ id: pets.length + 1, nome, raca, idade });
            res.redirect('/pets/listar');
        }
    });

    router.get('/listar', (req, res) => {
        res.render('pets/listar', { pets });
    });

    return router;
};

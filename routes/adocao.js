const express = require('express');

module.exports = (interessados, pets, adocoes) => {
    const router = express.Router();

    router.get('/criar', (req, res) => {
        res.render('adocao/criar', { interessados, pets });
    });

    router.post('/criar', (req, res) => {
        const { interessadoId, petId } = req.body;
        if (!interessadoId || !petId) {
            res.redirect('/adocao/criar');
        } else {
            adocoes.push({ id: adocoes.length + 1, interessadoId, petId, data: new Date() });
            res.redirect('/adocao/criar');
        }
    });

    return router;
};

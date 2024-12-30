const express = require('express');
const { obtenerTodos, obtenerUno, crear, actualizar, eliminar } = require('../controllers/crudController');
const verificarToken = require('../../src/middlewares/verificarToken');

const router = express.Router();

// Rutas CRUD para clientes
router.get('/api/clientes', verificarToken, async (req, res) => {
    try {
        const resultados = await obtenerTodos('clientes');
        res.send(resultados);
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener clientes', detalle: error.message });
    }
});

router.get('/api/clientes/:id', verificarToken, async (req, res) => {
    try {
        const resultado = await obtenerUno('clientes', req.params.id);
        res.send(resultado);
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener cliente', detalle: error.message });
    }
});

router.post('/api/clientes', verificarToken, async (req, res) => {
    try {
        const resultado = await crear('clientes', req.body);
        res.send(resultado);
    } catch (error) {
        res.status(500).send({ error: 'Error al crear cliente', detalle: error.message });
    }
});

router.put('/api/clientes/:id', verificarToken, async (req, res) => {
    try {
        const resultado = await actualizar('clientes', req.params.id, req.body);
        res.send(resultado);
    } catch (error) {
        res.status(500).send({ error: 'Error al actualizar cliente', detalle: error.message });
    }
});

router.delete('/api/clientes/:id', verificarToken, async (req, res) => {
    try {
        const resultado = await eliminar('clientes', req.params.id);
        res.send(resultado);
    } catch (error) {
        res.status(500).send({ error: 'Error al eliminar cliente', detalle: error.message });
    }
});

module.exports = router;


const express = require('express');
const { crearUsuario, actualizarUsuario, obtenerTodos, obtenerUsuarioPorUsername } = require('../../src/controllers/usuariosController');
const verificarToken = require('../../src/middlewares/verificarToken');
const bcrypt = require('bcrypt'); // Importa bcrypt
const jwt = require('jsonwebtoken'); // Importa JWT

const router = express.Router();

// Ruta pública: Página de inicio
router.get('/', (req, res) => {
    res.send('Ruta INICIO');
});

// Ruta para crear usuario (pública)
router.post('/api/usuarios', async (req, res) => {
    try {
        const resultado = await crearUsuario(req.body);
        res.send(resultado);
    } catch (error) {
        res.status(500).send({ error: 'Error al crear usuario', detalle: error.message });
    }
});

// Ruta de autenticación (login)
router.post('/api/login', async (req, res) => {
    try {
        const { usuario, passwords } = req.body;

        // Busca el usuario por nombre de usuario
        const [user] = await obtenerUsuarioPorUsername(usuario);
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        // Verifica la contraseña
        const validPassword = await bcrypt.compare(passwords, user.passwords);
        if (!validPassword) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Genera un token JWT
        const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).send({ error: 'Error en el login', detalle: error.message });
    }
});

// Ruta protegida: Obtener usuarios
router.get('/api/usuarios', verificarToken, async (req, res) => {
    try {
        const resultados = await obtenerTodos('usuarios');
        const usuariosSinPassword = resultados.map(({ passwords, ...usuario }) => usuario);
        res.send(usuariosSinPassword);
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener usuarios', detalle: error.message });
    }
});

// Ruta protegida: Actualizar usuario
router.put('/api/usuarios/:id', verificarToken, async (req, res) => {
    try {
        const resultado = await actualizarUsuario(req.params.id, req.body);
        res.send(resultado);
    } catch (error) {
        res.status(500).send({ error: 'Error al actualizar usuario', detalle: error.message });
    }
});

module.exports = router;
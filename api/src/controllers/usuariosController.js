const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const conexion = require('../../src/config/db');

// Funciones específicas para usuarios
async function crearUsuario(data) {
    const hash = await bcrypt.hash(data.passwords, 3)
    data.passwords = hash
    return new Promise((resolve, reject) => {
        conexion.query('INSERT INTO usuarios SET ?', data, (error, resultado) => {
            if (error) reject(error)
            else {
                const { passwords, ...usuarioSinPassword } = data
                resolve({ ...usuarioSinPassword, id: resultado.insertId })
            }
        })
    })
}

async function actualizarUsuario(id, data) {
    if (data.passwords) {
        data.passwords = await bcrypt.hash(data.passwords, 10)
    }
    return new Promise((resolve, reject) => {
        conexion.query('UPDATE usuarios SET ? WHERE id = ?', [data, id], (error, resultado) => {
            if (error) reject(error)
            else resolve(resultado)
        })
    })
}

function obtenerUsuarioPorUsername(usuario) {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (error, resultado) => {
            if (error) reject(error)
            else resolve(resultado)
        })
    })
}

module.exports = { 
    crearUsuario,
    actualizarUsuario,
    obtenerUsuarioPorUsername 
};
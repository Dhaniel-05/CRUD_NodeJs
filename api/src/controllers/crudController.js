const conexion = require('../../src/config/db'); // Requiere la conexión de la base de datos 

// Funciones genéricas para operaciones CRUD
function obtenerTodos(tabla) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla}`, (error, resultados) => {
            if (error) reject(error)
            else resolve(resultados)
        })
    })
}

function obtenerUno(tabla, id) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id], (error, resultado) => {
            if (error) reject(error)
            else resolve(resultado)
        })
    })
}

function crear(tabla, data) {
    return new Promise((resolve, reject) => {
        conexion.query(`INSERT INTO ${tabla} SET ?`, data, (error, resultado) => {
            if (error) reject(error)
            else {
                Object.assign(data, { id: resultado.insertId })
                resolve(data)
            }
        })
    })
}

function actualizar(tabla, id, data) {
    return new Promise((resolve, reject) => {
        conexion.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, id], (error, resultado) => {
            if (error) reject(error)
            else resolve(resultado)
        })
    })
}

function eliminar(tabla, id) {
    return new Promise((resolve, reject) => {
        conexion.query(`DELETE FROM ${tabla} WHERE id = ?`, [id], (error, resultado) => {
            if (error) reject(error)
            else resolve(resultado)
        })
    })
}

module.exports = {
    obtenerTodos,
    obtenerUno,
    crear,
    actualizar,
    eliminar
};
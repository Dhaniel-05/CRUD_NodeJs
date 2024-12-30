const mysql = require('mysql2')

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'salitre'
})

// Función para manejar la conexión y reconexión
function conectarDB() {
    conexion.connect((error) => {
        if (error) {
            console.log('[db error]', error)
            setTimeout(conectarDB, 200)
        } else {
            console.log("¡Conexión exitosa a la base de datos!")
        }
    })

    conexion.on('error', error => {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            conectarDB()
        } else {
            throw error
        }
    })
}

conectarDB();

module.exports = conexion;
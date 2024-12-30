// const express = require('express')
// const mysql = require('mysql2')
// const cors = require('cors')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const app = express()

// app.use(express.json())
// app.use(cors())

// const conexion = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'salitre'
// })

// // Función para manejar la conexión y reconexión
// function conectarDB() {
//     conexion.connect((error) => {
//         if (error) {
//             console.log('[db error]', error)
//             setTimeout(conectarDB, 200)
//         } else {
//             console.log("¡Conexión exitosa a la base de datos!")
//         }
//     })

//     conexion.on('error', error => {
//         if (error.code === 'PROTOCOL_CONNECTION_LOST') {
//             conectarDB()
//         } else {
//             throw error
//         }
//     })
// }

// conectarDB()

// Middleware de autenticación
// const verificarToken = (req, res, next) => {
//     const token = req.headers['authorization']
//     if (!token) return res.status(401).json({ error: 'Token requerido' })

//     try {
//         const decoded = jwt.verify(token.split(' ')[1], 'secretkey')
//         req.userId = decoded.id
//         next()
//     } catch (error) {
//         res.status(401).json({ error: 'Token inválido' })
//     }
// }

// Funciones genéricas para operaciones CRUD
// function obtenerTodos(tabla) {
//     return new Promise((resolve, reject) => {
//         conexion.query(`SELECT * FROM ${tabla}`, (error, resultados) => {
//             if (error) reject(error)
//             else resolve(resultados)
//         })
//     })
// }

// function obtenerUno(tabla, id) {
//     return new Promise((resolve, reject) => {
//         conexion.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id], (error, resultado) => {
//             if (error) reject(error)
//             else resolve(resultado)
//         })
//     })
// }

// function crear(tabla, data) {
//     return new Promise((resolve, reject) => {
//         conexion.query(`INSERT INTO ${tabla} SET ?`, data, (error, resultado) => {
//             if (error) reject(error)
//             else {
//                 Object.assign(data, { id: resultado.insertId })
//                 resolve(data)
//             }
//         })
//     })
// }

// function actualizar(tabla, id, data) {
//     return new Promise((resolve, reject) => {
//         conexion.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, id], (error, resultado) => {
//             if (error) reject(error)
//             else resolve(resultado)
//         })
//     })
// }

// function eliminar(tabla, id) {
//     return new Promise((resolve, reject) => {
//         conexion.query(`DELETE FROM ${tabla} WHERE id = ?`, [id], (error, resultado) => {
//             if (error) reject(error)
//             else resolve(resultado)
//         })
//     })
// }

// // Funciones específicas para usuarios
// async function crearUsuario(data) {
//     const hash = await bcrypt.hash(data.passwords, 3)
//     data.passwords = hash
//     return new Promise((resolve, reject) => {
//         conexion.query('INSERT INTO usuarios SET ?', data, (error, resultado) => {
//             if (error) reject(error)
//             else {
//                 const { passwords, ...usuarioSinPassword } = data
//                 resolve({ ...usuarioSinPassword, id: resultado.insertId })
//             }
//         })
//     })
// }

// async function actualizarUsuario(id, data) {
//     if (data.passwords) {
//         data.passwords = await bcrypt.hash(data.passwords, 10)
//     }
//     return new Promise((resolve, reject) => {
//         conexion.query('UPDATE usuarios SET ? WHERE id = ?', [data, id], (error, resultado) => {
//             if (error) reject(error)
//             else resolve(resultado)
//         })
//     })
// }

// function obtenerUsuarioPorUsername(usuario) {
//     return new Promise((resolve, reject) => {
//         conexion.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (error, resultado) => {
//             if (error) reject(error)
//             else resolve(resultado)
//         })
//     })
// }

// // Rutas públicas
// app.get('/', (req, res) => {
//     res.send('Ruta INICIO')
// })

// // Rutas de autenticación
// app.post('/api/usuarios', async (req, res) => {
//     try {
//         const resultado = await crearUsuario(req.body)
//         res.send(resultado)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// app.post('/api/login', async (req, res) => {
//     try {
//         const { usuario, passwords } = req.body
//         const [user] = await obtenerUsuarioPorUsername(usuario)
        
//         if (!user) {
//             return res.status(401).json({ error: 'Usuario no encontrado' })
//         }
        
//         const validPassword = await bcrypt.compare(passwords, user.passwords)
//         if (!validPassword) {
//             return res.status(401).json({ error: 'Contraseña incorrecta' })
//         }
        
//         const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' })
//         res.json({ token })
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// // Rutas protegidas
// app.get('/api/usuarios', verificarToken, async (req, res) => {
//     try {
//         const resultados = await obtenerTodos('usuarios')
//         const usuariosSinPassword = resultados.map(({ passwords, ...usuario }) => usuario)
//         res.send(usuariosSinPassword)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// app.put('/api/usuarios/:id', verificarToken, async (req, res) => {
//     try {
//         const resultado = await actualizarUsuario(req.params.id, req.body)
//         res.send(resultado)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// Rutas CRUD genéricas para otras tablas
// app.get('/api/:tabla', verificarToken, async (req, res) => {
//     if (req.params.tabla === 'usuarios') return
//     try {
//         const resultados = await obtenerTodos(req.params.tabla)
//         res.send(resultados)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// app.get('/api/:tabla/:id', verificarToken, async (req, res) => {
//     if (req.params.tabla === 'usuarios') return
//     try {
//         const resultado = await obtenerUno(req.params.tabla, req.params.id)
//         res.send(resultado)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// app.post('/api/:tabla', verificarToken, async (req, res) => {
//     if (req.params.tabla === 'usuarios') return
//     try {
//         const resultado = await crear(req.params.tabla, req.body)
//         res.send(resultado)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// app.put('/api/:tabla/:id', verificarToken, async (req, res) => {
//     if (req.params.tabla === 'usuarios') return
//     try {
//         const resultado = await actualizar(req.params.tabla, req.params.id, req.body)
//         res.send(resultado)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// app.delete('/api/:tabla/:id', verificarToken, async (req, res) => {
//     try {
//         const resultado = await eliminar(req.params.tabla, req.params.id)
//         res.send(resultado)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// const puerto = process.env.PUERTO || 3000
// app.listen(puerto, () => {
//     console.log("Servidor Ok en puerto:" + puerto)
// })
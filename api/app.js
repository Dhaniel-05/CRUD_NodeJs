const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./src/routes/usuariosRoutes');
const clientesRoutes = require('./src/routes/clientesRoutes');

const app = express();

app.use(express.json());
app.use(cors());

// Rutas
app.use('/', usuariosRoutes);
app.use('/', clientesRoutes); 

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});


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

// // Funciones genéricas para operaciones CRUD
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

// // Rutas usando las funciones genéricas
// app.get('/', (req, res) => {
//     res.send('Ruta INICIO')
// })

// // Mostrar todos los registros
// app.get('/api/:tabla', async (req, res) => {
//     try {
//         const resultados = await obtenerTodos(req.params.tabla)
//         res.send(resultados)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// // Mostrar un solo registro
// app.get('/api/:tabla/:id', async (req, res) => {
//     try {
//         const resultado = await obtenerUno(req.params.tabla, req.params.id)
//         res.send(resultado)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// // Crear un registro
// app.post('/api/:tabla', async (req, res) => {
//     try {
//         const resultado = await crear(req.params.tabla, req.body)
//         res.send(resultado)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// // Editar un registro
// app.put('/api/:tabla/:id', async (req, res) => {
//     try {
//         const resultado = await actualizar(req.params.tabla, req.params.id, req.body)
//         res.send(resultado)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// // Eliminar un registro
// app.delete('/api/:tabla/:id', async (req, res) => {
//     try {
//         const resultado = await eliminar(req.params.tabla, req.params.id)
//         res.send(resultado)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })


// //USUARIOS
// // Middleware de autenticación
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

// // Funciones usuarios
// formUsuario.addEventListener('submit', (e) => {
//     e.preventDefault();
    
//     const data = {
//         nombre: nombre.value,
//         usuario: usuario.value,
//         email: email.value
//     };

//     if (password.value) {
//         data.passwords = password.value;
//     }
    
//     // Usar siempre la ruta específica de usuarios para asegurar el hash
//     const endpoint = opcion === 'crear' ? '/api/usuarios' : `/api/usuarios/${idForm}`;
    
//     fetch(endpoint, agregarHeaders({
//         method: opcion === 'crear' ? 'POST' : 'PUT',
//         body: JSON.stringify(data)
//     }))
//     .then(response => response.json())
//     .then(() => {
//         fetch(url, agregarHeaders())
//             .then(response => response.json())
//             .then(data => mostrar(data));
//         modal.style.display = "none";
//     })
//     .catch(error => console.error('Error:', error));
// });
// // async function crearUsuario(data) {
// //     const hash = await bcrypt.hash(data.passwords, 3)
// //     data.passwords = hash
// //     return new Promise((resolve, reject) => {
// //         conexion.query('INSERT INTO usuarios SET ?', data, (error, resultado) => {
// //             if (error) reject(error)
// //             else {
// //                 const { passwords, ...usuarioSinPassword } = data
// //                 resolve({ ...usuarioSinPassword, id: resultado.insertId })
// //             }
// //         })
// //     })
// // }

// function obtenerUsuarioPorUsername(usuario) {
//     return new Promise((resolve, reject) => {
//         conexion.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (error, resultado) => {
//             if (error) reject(error)
//             else resolve(resultado)
//         })
//     })
// }

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
// app.get('/api/:tabla', verificarToken, async (req, res) => {
//     try {
//         const resultados = await obtenerTodos(req.params.tabla)
//         res.send(resultados)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// //Lo último que se debe realizar 
// const puerto = process.env.PUERTO || 3000
// app.listen(puerto, () => {
//     console.log("Servidor Ok en puerto:" + puerto)
// })
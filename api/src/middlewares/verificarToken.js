const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) return res.status(401).json({ error: 'Token requerido' })

    try {
        const decoded = jwt.verify(token.split(' ')[1], 'secretkey')
        req.userId = decoded.id
        next()
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' })
    }
}

module.exports = verificarToken;
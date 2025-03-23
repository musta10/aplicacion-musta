// MIDDLEWARES PROTECT
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ msg: 'No autorizado, token no presente' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token inválido' });
    }
};

// Middleware para verificar el rol de administrador
exports.admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'No tienes permiso para acceder a esta ruta' });
    }
    next();
};

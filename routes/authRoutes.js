const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Registro de usuario
router.post(
    '/register',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Introduce un email válido').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
        check('age', 'La edad es obligatoria y debe ser un número').isInt({ min: 1 }),
        check('country', 'El país es obligatorio').not().isEmpty(),
    ],
    registerUser
);

// Login de usuario
router.post(
    '/login',
    [
        check('email', 'Introduce un email válido').isEmail(),
        check('password', 'La contraseña es obligatoria').exists()
    ],
    loginUser
);

// Ruta solo accesible para administradores
router.get('/admin', protect, admin, (req, res) => {
    res.send('Contenido de administrador');
});

module.exports = router;

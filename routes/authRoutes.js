const express = require('express');
const { check } = require('express-validator');
const { getUsers } = require('../controllers/authController');
const { registerUser, loginUser, uploadProfileImage } = require('../controllers/authController');
const { protect, admin } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const router = express.Router();



// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png)'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },  // Límite de 5MB
    fileFilter: fileFilter
});

// Ruta para subir la foto de perfil
router.post('/uploadProfileImage', protect, upload.single('profileImage'), uploadProfileImage);


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
// Obtener usuarios con paginación (solo admin)
router.get('/users', protect, admin, getUsers);

module.exports = router;

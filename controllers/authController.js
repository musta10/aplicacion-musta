const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generar JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// Registro de Usuario
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, age, country } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        user = new User({ name, email, password, role , age , country });

        await user.save();

        const token = generateToken(user);

        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// Login de Usuario
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Credenciales incorrectas' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales incorrectas' });
        }

        const token = generateToken(user);

        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};
// hay que verificar la ruta de la imagen con POSTMAN
// Subir imagen de perfil
exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Por favor sube una imagen' });
        }

        const user = await User.findById(req.user.id);

        user.profileImage = req.file.path;  // Guardar la ruta de la imagen en el campo profileImage
        await user.save();

        res.json({ msg: 'Imagen subida correctamente', profileImage: user.profileImage });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};


// Obtener todos los usuarios con paginación (solo para administradores)

exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password') // Excluye el password
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments();

        const formattedUsers = users.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            age: user.age,
            country: user.country,
            profileImage: user.profileImage,
            createdAt: user.createdAt ? user.createdAt.toLocaleString('es-ES', { 
                day: '2-digit', month: '2-digit', year: 'numeric', 
                hour: '2-digit', minute: '2-digit', second: '2-digit' 
            }) : 'Fecha no disponible'
        }));

        res.json({
            page,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            users: formattedUsers
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

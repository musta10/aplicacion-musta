const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { createPost, getUserPosts, updatePost, deletePost } = require('../controllers/postController');

const router = express.Router();

// Crear una nueva publicación
router.post('/', protect, createPost);

// Obtener todas las publicaciones del usuario autenticado
router.get('/', protect, getUserPosts);

// Editar una publicación (por ID)
router.put('/:id', protect, updatePost);

// Eliminar una publicación (por ID)
router.delete('/:id', protect, deletePost);

module.exports = router;

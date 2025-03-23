const Post = require('../models/Post');

// Crear una nueva publicación
exports.createPost = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ msg: 'El título es obligatorio' });
        }

        const post = new Post({
            title,
            user: req.user.id
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

// Obtener todas las publicaciones del usuario autenticado
exports.getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id }).sort({ publishedAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

// Editar una publicación (solo el dueño puede hacerlo)
exports.updatePost = async (req, res) => {
    try {
        const { title } = req.body;
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Publicación no encontrada' });
        }

        // Verificar si el usuario es el dueño del post
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        post.title = title || post.title;
        await post.save();

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

// Eliminar una publicación (solo el dueño puede hacerlo)
exports.deletePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Publicación no encontrada' });
        }

        // Verificar si el usuario es el dueño del post
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        await post.remove();
        res.json({ msg: 'Publicación eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

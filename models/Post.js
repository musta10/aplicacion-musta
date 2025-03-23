// modelo de publicacion
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Formatear la fecha al obtener los datos
PostSchema.methods.getFormattedDate = function () {
    return this.publishedAt.toLocaleString('es-ES', { 
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
};

module.exports = mongoose.model('Post', PostSchema);

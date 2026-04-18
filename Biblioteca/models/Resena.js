const db = require('../util/database');

module.exports = class Resena {
    constructor(libroId, usuarioId, calificacion, comentario) {
        this.libroId = libroId;
        this.usuarioId = usuarioId;
        this.calificacion = calificacion;
        this.comentario = comentario;
    }

    save() {
        return db.execute(
            `INSERT INTO resenas (libro_id, usuario_id, calificacion, comentario)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                calificacion = VALUES(calificacion),
                comentario = VALUES(comentario),
                updated_at = CURRENT_TIMESTAMP`,
            [this.libroId, this.usuarioId, this.calificacion, this.comentario]
        );
    }

    static fetchByLibroId(libroId) {
        return db.execute(
            `SELECT
                resenas.*,
                usuarios.username
             FROM resenas
             INNER JOIN usuarios
                ON usuarios.id = resenas.usuario_id
             WHERE resenas.libro_id = ?
             ORDER BY resenas.created_at DESC`,
            [libroId]
        );
    }

    static deleteByIdForLibro(resenaId, libroId) {
        return db.execute(
            'DELETE FROM resenas WHERE id = ? AND libro_id = ?',
            [resenaId, libroId]
        );
    }
};

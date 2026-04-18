const db = require('../util/database');

const statsJoin = `
    LEFT JOIN (
        SELECT
            libro_id,
            ROUND(AVG(calificacion), 1) AS promedio_calificacion,
            COUNT(*) AS total_resenas
        FROM resenas
        GROUP BY libro_id
    ) AS resenas_stats
        ON resenas_stats.libro_id = libros.id
`;

module.exports = class Libro {
    constructor(titulo, autor, genero, anio) {
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero;
        this.anio = anio || null;
    }

    save() {
        return db.execute(
            'INSERT INTO libros (titulo, autor, genero, anio) VALUES (?, ?, ?, ?)',
            [this.titulo, this.autor, this.genero || null, this.anio]
        );
    }

    static fetchAll() {
        return db.execute(
            `SELECT
                libros.*,
                COALESCE(resenas_stats.promedio_calificacion, 0) AS promedio_calificacion,
                COALESCE(resenas_stats.total_resenas, 0) AS total_resenas
             FROM libros
             ${statsJoin}
             ORDER BY libros.titulo`
        );
    }

    static fetchById(id) {
        return db.execute(
            `SELECT
                libros.*,
                COALESCE(resenas_stats.promedio_calificacion, 0) AS promedio_calificacion,
                COALESCE(resenas_stats.total_resenas, 0) AS total_resenas
             FROM libros
             ${statsJoin}
             WHERE libros.id = ?`,
            [id]
        );
    }

    static update(id, titulo, autor, genero, anio) {
        return db.execute(
            'UPDATE libros SET titulo = ?, autor = ?, genero = ?, anio = ? WHERE id = ?',
            [titulo, autor, genero || null, anio || null, id]
        );
    }

    static deleteById(id) {
        return db.execute('DELETE FROM libros WHERE id = ?', [id]);
    }
};

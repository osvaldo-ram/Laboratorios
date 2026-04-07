const db = require('../util/database');

module.exports = class Libro {
    constructor(titulo, autor, genero, anio) {
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero;
        this.anio = anio;
    }

    // INSERCION
    save() {
        return db.execute(
            'INSERT INTO libros (titulo, autor, genero, anio) VALUES (?, ?, ?, ?)',
            [this.titulo, this.autor, this.genero, this.anio]
        );
    }

    // CONSULTA - Todos
    static fetchAll() {
        return db.execute('SELECT * FROM libros ORDER BY titulo');
    }

    // CONSULTA - Uno solo
    static fetchById(id) {
        return db.execute('SELECT * FROM libros WHERE id = ?', [id]);
    }

    // EDICION
    static update(id, titulo, autor, genero, anio) {
        return db.execute(
            'UPDATE libros SET titulo = ?, autor = ?, genero = ?, anio = ? WHERE id = ?',
            [titulo, autor, genero, anio, id]
        );
    }

    // ELIMINAR (extra)
    static deleteById(id) {
        return db.execute('DELETE FROM libros WHERE id = ?', [id]);
    }
};
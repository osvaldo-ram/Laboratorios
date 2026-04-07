const Libro = require('../models/Libro');

// LISTAR TODOS (varios registros)
exports.getLibros = (request, response, next) => {
    Libro.fetchAll()
        .then(([rows, fieldData]) => {
            response.render('list', { libros: rows });
        })
        .catch(err => next(err));
};

// VER DETALLE (1 solo registro)
exports.getDetalle = (request, response, next) => {
    const id = request.params.libro_id;
    Libro.fetchById(id)
        .then(([rows, fieldData]) => {
            if (rows.length > 0) {
                response.render('detail', { libro: rows[0] });
            } else {
                response.redirect('/');
            }
        })
        .catch(err => next(err));
};

// MOSTRAR FORM AGREGAR
exports.getAdd = (request, response, next) => {
    response.render('add');
};

// INSERTAR LIBRO
exports.postAdd = (request, response, next) => {
    const libro = new Libro(
        request.body.titulo,
        request.body.autor,
        request.body.genero,
        request.body.anio
    );
    libro.save()
        .then(() => {
            response.redirect('/');
        })
        .catch(err => next(err));
};

// MOSTRAR FORM EDITAR
exports.getEdit = (request, response, next) => {
    const id = request.params.libro_id;
    Libro.fetchById(id)
        .then(([rows, fieldData]) => {
            if (rows.length > 0) {
                response.render('edit', { libro: rows[0] });
            } else {
                response.redirect('/');
            }
        })
        .catch(err => next(err));
};

// GUARDAR EDICIÓN
exports.postEdit = (request, response, next) => {
    const id = request.params.libro_id;
    const { titulo, autor, genero, anio } = request.body;
    Libro.update(id, titulo, autor, genero, anio)
        .then(() => {
            response.redirect('/');
        })
        .catch(err => next(err));
};

// ELIMINAR
exports.postDelete = (request, response, next) => {
    const id = request.params.libro_id;
    Libro.deleteById(id)
        .then(() => {
            response.redirect('/');
        })
        .catch(err => next(err));
};

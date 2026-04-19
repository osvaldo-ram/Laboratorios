const Libro = require('../models/Libro');
const Resena = require('../models/Resena');

const wantsJson = request => {
    return request.is('application/json') || (request.get('accept') || '').includes('application/json');
};

const getDetalleData = async libroId => {
    const [[libroRows], [resenas]] = await Promise.all([
        Libro.fetchById(libroId),
        Resena.fetchByLibroId(libroId)
    ]);

    return {
        libro: libroRows[0] || null,
        resenas
    };
};

const renderDetalle = async (request, response, next, options = {}) => {
    try {
        const id = request.params.libro_id;
        const { libro, resenas } = await getDetalleData(id);

        if (!libro) {
            return response.redirect('/');
        }

        return response.render('detail', {
            libro,
            resenas,
            reviewErrorMessage: options.reviewErrorMessage || null
        });
    } catch (error) {
        return next(error);
    }
};

exports.getLibros = async (request, response, next) => {
    try {
        const [rows] = await Libro.fetchAll();
        response.render('list', { libros: rows });
    } catch (error) {
        next(error);
    }
};

exports.getDetalle = (request, response, next) => {
    return renderDetalle(request, response, next);
};

exports.getPreguntas = (request, response) => {
    response.render('preguntas');
};

exports.getAdd = (request, response, next) => {
    response.render('add');
};

exports.postAdd = async (request, response, next) => {
    try {
        const titulo = (request.body.titulo || '').trim();
        const autor = (request.body.autor || '').trim();
        const genero = (request.body.genero || '').trim();
        const anio = request.body.anio || null;
        const imagen = request.file ? `uploads/${request.file.filename}` : null;

        if (!titulo || !autor) {
            return response.status(422).render('add', {
                errorMessage: 'Captura titulo y autor.'
            });
        }

        const libro = new Libro(titulo, autor, genero, anio, imagen);
        await libro.save();

        response.redirect('/');
    } catch (error) {
        next(error);
    }
};

exports.getEdit = async (request, response, next) => {
    try {
        const id = request.params.libro_id;
        const [rows] = await Libro.fetchById(id);

        if (rows.length === 0) {
            return response.redirect('/');
        }

        response.render('edit', {
            libro: rows[0],
            errorMessage: null
        });
    } catch (error) {
        next(error);
    }
};

exports.postEdit = async (request, response, next) => {
    try {
        const id = request.params.libro_id;
        const titulo = (request.body.titulo || '').trim();
        const autor = (request.body.autor || '').trim();
        const genero = (request.body.genero || '').trim();
        const anio = request.body.anio || null;
        const [rows] = await Libro.fetchById(id);

        if (rows.length === 0) {
            return response.redirect('/');
        }

        if (!titulo || !autor) {
            return response.status(422).render('edit', {
                libro: rows[0],
                errorMessage: 'Captura titulo y autor.'
            });
        }

        const imagen = request.file ? `uploads/${request.file.filename}` : rows[0].imagen;

        await Libro.update(id, titulo, autor, genero, anio, imagen);
        response.redirect('/');
    } catch (error) {
        next(error);
    }
};

exports.postDelete = async (request, response, next) => {
    try {
        const id = request.params.libro_id;
        await Libro.deleteById(id);
        response.redirect('/');
    } catch (error) {
        next(error);
    }
};

exports.postResena = async (request, response, next) => {
    const jsonResponse = wantsJson(request);
    const calificacion = Number.parseInt(request.body.calificacion, 10);
    const comentario = (request.body.comentario || '').trim();

    if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5 || !comentario) {
        if (jsonResponse) {
            return response.status(422).json({
                message: 'La resena requiere comentario y calificacion entre 1 y 5.'
            });
        }

        return renderDetalle(request, response.status(422), next, {
            reviewErrorMessage: 'La resena requiere comentario y calificacion entre 1 y 5.'
        });
    }

    try {
        const resena = new Resena(
            request.params.libro_id,
            request.session.user.id,
            calificacion,
            comentario
        );

        await resena.save();

        if (jsonResponse) {
            const { libro, resenas } = await getDetalleData(request.params.libro_id);

            if (!libro) {
                return response.status(404).json({
                    message: 'No se encontro el libro solicitado.'
                });
            }

            return response.status(200).json({
                message: 'Resena guardada sin recargar la pagina.',
                libro,
                resenas,
                ajaxComponent: 'Formulario de resenas con fetch, JSON y actualizacion del DOM.'
            });
        }

        response.redirect(`/libro/${request.params.libro_id}`);
    } catch (error) {
        next(error);
    }
};

exports.postDeleteResena = async (request, response, next) => {
    try {
        await Resena.deleteByIdForLibro(
            request.params.resena_id,
            request.params.libro_id
        );

        response.redirect(`/libro/${request.params.libro_id}`);
    } catch (error) {
        next(error);
    }
};

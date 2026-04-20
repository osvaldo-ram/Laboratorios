const Libro = require('../models/Libro');
const Resena = require('../models/Resena');

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';
const OPEN_LIBRARY_API_URL = 'https://openlibrary.org/search.json';

const wantsJson = request => {
    return request.is('application/json') || (request.get('accept') || '').includes('application/json');
};

const parsePublishedYear = publishedDate => {
    const year = Number.parseInt(String(publishedDate || '').slice(0, 4), 10);
    return Number.isInteger(year) ? year : '';
};

const normalizeImageUrl = imageUrl => {
    if (!imageUrl) {
        return '';
    }

    return String(imageUrl).replace(/^http:\/\//i, 'https://');
};

const getHttpUrl = value => {
    try {
        const url = new URL(String(value || '').trim());
        return url.protocol === 'http:' || url.protocol === 'https:' ? normalizeImageUrl(url.toString()) : null;
    } catch (error) {
        return null;
    }
};

const mapGoogleBook = item => {
    const volumeInfo = item.volumeInfo || {};
    const authors = Array.isArray(volumeInfo.authors) ? volumeInfo.authors.join(', ') : '';
    const categories = Array.isArray(volumeInfo.categories) ? volumeInfo.categories.join(', ') : '';
    const imageLinks = volumeInfo.imageLinks || {};

    return {
        id: item.id,
        titulo: volumeInfo.title || '',
        autor: authors,
        genero: categories,
        anio: parsePublishedYear(volumeInfo.publishedDate),
        imagen: normalizeImageUrl(imageLinks.thumbnail || imageLinks.smallThumbnail || ''),
        descripcion: volumeInfo.description || ''
    };
};

const mapOpenLibraryBook = item => {
    const authors = Array.isArray(item.author_name) ? item.author_name.join(', ') : '';
    const subjects = Array.isArray(item.subject) ? item.subject.slice(0, 3).join(', ') : '';
    const isbn = Array.isArray(item.isbn) ? item.isbn[0] : '';
    const image = item.cover_i
        ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
        : isbn
            ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
            : '';

    return {
        id: item.key,
        titulo: item.title || '',
        autor: authors,
        genero: subjects,
        anio: item.first_publish_year || '',
        imagen: image,
        descripcion: ''
    };
};

const fetchWithTimeout = async url => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
        return await fetch(url, {
            headers: {
                Accept: 'application/json',
                'User-Agent': 'Biblioteca-Lab26/1.0'
            },
            signal: controller.signal
        });
    } finally {
        clearTimeout(timeout);
    }
};

const searchOpenLibrary = async query => {
    const url = new URL(OPEN_LIBRARY_API_URL);
    url.searchParams.set('q', query);
    url.searchParams.set('limit', '5');
    url.searchParams.set('fields', 'key,title,author_name,first_publish_year,cover_i,subject,isbn');

    const apiResponse = await fetchWithTimeout(url);

    if (!apiResponse.ok) {
        throw new Error('Open Library no respondio correctamente.');
    }

    const data = await apiResponse.json();

    return (data.docs || [])
        .map(mapOpenLibraryBook)
        .filter(book => book.titulo && book.autor);
};

const respondWithOpenLibraryFallback = async (query, response) => {
    const books = await searchOpenLibrary(query);

    return response.json({
        books,
        source: 'Open Library',
        fallback: true,
        message: 'Google Books alcanzo su cuota publica; se muestran resultados de Open Library.'
    });
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

exports.searchGoogleBooks = async (request, response) => {
    const query = (request.query.q || '').trim();

    if (query.length < 2) {
        return response.status(422).json({
            message: 'Escribe al menos 2 caracteres para buscar libros.'
        });
    }

    const url = new URL(GOOGLE_BOOKS_API_URL);
    url.searchParams.set('q', query);
    url.searchParams.set('maxResults', '5');
    url.searchParams.set('printType', 'books');
    url.searchParams.set('projection', 'lite');

    if (process.env.GOOGLE_BOOKS_API_KEY) {
        url.searchParams.set('key', process.env.GOOGLE_BOOKS_API_KEY);
    }

    try {
        const apiResponse = await fetchWithTimeout(url);

        if (apiResponse.status === 429) {
            return respondWithOpenLibraryFallback(query, response);
        }

        if (!apiResponse.ok) {
            return respondWithOpenLibraryFallback(query, response);
        }

        const data = await apiResponse.json();
        const books = (data.items || [])
            .map(mapGoogleBook)
            .filter(book => book.titulo && book.autor);

        return response.json({
            books,
            source: 'Google Books'
        });
    } catch (error) {
        try {
            return await respondWithOpenLibraryFallback(query, response);
        } catch (fallbackError) {
            const status = error.name === 'AbortError' ? 504 : 500;
            return response.status(status).json({
                message: 'No se pudo consultar Google Books ni Open Library en este momento.'
            });
        }
    }
};

exports.postAdd = async (request, response, next) => {
    try {
        const titulo = (request.body.titulo || '').trim();
        const autor = (request.body.autor || '').trim();
        const genero = (request.body.genero || '').trim();
        const anio = request.body.anio || null;
        const imagenExterna = getHttpUrl(request.body.imagenExterna);
        const imagen = request.file ? `uploads/${request.file.filename}` : imagenExterna;

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

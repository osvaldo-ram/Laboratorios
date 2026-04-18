const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

exports.getLogin = (request, response, next) => {
    if (request.session.isLoggedIn) {
        return response.redirect('/');
    }

    response.render('login', {
        errorMessage: null,
        successMessage: request.query.registered
            ? 'Usuario registrado. Ya puedes iniciar sesion.'
            : request.query.loggedOut
                ? 'Sesion cerrada correctamente.'
                : null,
        oldInput: {
            username: ''
        }
    });
};

exports.postLogin = async (request, response, next) => {
    try {
        const username = (request.body.username || '').trim();
        const password = request.body.password || '';

        if (!username || !password) {
            return response.status(422).render('login', {
                errorMessage: 'Captura usuario y password.',
                successMessage: null,
                oldInput: { username }
            });
        }

        const [rows] = await Usuario.findByUsername(username);
        if (rows.length === 0) {
            return response.status(422).render('login', {
                errorMessage: 'Usuario o password incorrecto.',
                successMessage: null,
                oldInput: { username }
            });
        }

        const usuario = rows[0];
        const doMatch = await bcrypt.compare(password, usuario.password);

        if (!doMatch) {
            return response.status(422).render('login', {
                errorMessage: 'Usuario o password incorrecto.',
                successMessage: null,
                oldInput: { username }
            });
        }

        let access = await Usuario.getAccess(usuario.id);

        if (access.roles.length === 0) {
            await Usuario.assignDefaultRole(usuario.id);
            access = await Usuario.getAccess(usuario.id);
        }

        request.session.regenerate(error => {
            if (error) {
                return next(error);
            }

            request.session.isLoggedIn = true;
            request.session.user = {
                id: usuario.id,
                username: usuario.username,
                roles: access.roles,
                permissions: access.permissions
            };

            request.session.save(saveError => {
                if (saveError) {
                    return next(saveError);
                }

                response.redirect('/');
            });
        });
    } catch (error) {
        next(error);
    }
};

exports.getSignup = (request, response, next) => {
    if (request.session.isLoggedIn) {
        return response.redirect('/');
    }

    response.render('signup', {
        errorMessage: null,
        successMessage: null,
        oldInput: {
            username: ''
        }
    });
};

exports.postSignup = async (request, response, next) => {
    try {
        const username = (request.body.username || '').trim();
        const password = request.body.password || '';
        const confirmPassword = request.body.confirmPassword || '';

        if (!username || !password || !confirmPassword) {
            return response.status(422).render('signup', {
                errorMessage: 'Completa todos los campos.',
                successMessage: null,
                oldInput: { username }
            });
        }

        if (password.length < 6) {
            return response.status(422).render('signup', {
                errorMessage: 'El password debe tener al menos 6 caracteres.',
                successMessage: null,
                oldInput: { username }
            });
        }

        if (password !== confirmPassword) {
            return response.status(422).render('signup', {
                errorMessage: 'Los passwords no coinciden.',
                successMessage: null,
                oldInput: { username }
            });
        }

        const [existingUsers] = await Usuario.findByUsername(username);
        if (existingUsers.length > 0) {
            return response.status(422).render('signup', {
                errorMessage: 'Ese usuario ya existe.',
                successMessage: null,
                oldInput: { username }
            });
        }

        const usuario = new Usuario(username, password);
        await usuario.save();

        response.redirect('/login?registered=1');
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return response.status(422).render('signup', {
                errorMessage: 'Ese usuario ya existe.',
                successMessage: null,
                oldInput: {
                    username: (request.body.username || '').trim()
                }
            });
        }

        next(error);
    }
};

exports.postLogout = (request, response, next) => {
    request.session.destroy(error => {
        if (error) {
            return next(error);
        }

        response.redirect('/login?loggedOut=1');
    });
};

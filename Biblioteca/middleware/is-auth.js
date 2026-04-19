module.exports = (request, response, next) => {
    if (!request.session.isLoggedIn || !request.session.user) {
        if (request.is('application/json') || (request.get('accept') || '').includes('application/json')) {
            return response.status(401).json({
                message: 'Inicia sesion para continuar.'
            });
        }

        return response.redirect('/login');
    }

    next();
};

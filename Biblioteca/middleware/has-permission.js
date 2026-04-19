module.exports = requiredPermission => {
    return (request, response, next) => {
        const user = request.session.user;
        const permissions = user && Array.isArray(user.permissions)
            ? user.permissions
            : [];

        if (permissions.includes(requiredPermission)) {
            return next();
        }

        if (request.is('application/json') || (request.get('accept') || '').includes('application/json')) {
            return response.status(403).json({
                message: 'No tienes permiso para realizar esta accion.'
            });
        }

        return response.status(403).send('No tienes permiso para realizar esta accion.');
    };
};

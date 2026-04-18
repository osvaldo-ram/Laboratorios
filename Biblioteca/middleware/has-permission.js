module.exports = requiredPermission => {
    return (request, response, next) => {
        const user = request.session.user;
        const permissions = user && Array.isArray(user.permissions)
            ? user.permissions
            : [];

        if (permissions.includes(requiredPermission)) {
            return next();
        }

        return response.status(403).send('No tienes permiso para realizar esta accion.');
    };
};

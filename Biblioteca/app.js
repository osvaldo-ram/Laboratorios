const express = require('express');
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');

const app = express();
const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET || 'biblioteca-lab-18-secret';
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax'
    }
}));
app.use(csrfProtection);
app.use((request, response, next) => {
    const user = request.session.user || null;
    const permissions = user && Array.isArray(user.permissions) ? user.permissions : [];

    response.locals.isAuthenticated = !!request.session.isLoggedIn;
    response.locals.currentUser = user;
    response.locals.currentRoles = user && Array.isArray(user.roles) ? user.roles : [];
    response.locals.currentPermissions = permissions;
    response.locals.hasPermission = permission => permissions.includes(permission);
    response.locals.csrfToken = request.csrfToken();
    next();
});

const authRoutes = require('./routes/auth');
const librosRoutes = require('./routes/libros');

app.use(authRoutes);
app.use('/', librosRoutes);

app.use((error, request, response, next) => {
    if (error.code === 'EBADCSRFTOKEN') {
        return response.status(403).send('Token CSRF invalido o expirado. Recarga la pagina e intenta de nuevo.');
    }

    console.error(error);
    response.status(500).send(
        'Error interno. Revisa la conexion a MySQL, el esquema RBAC y las variables DB_HOST, DB_USER, DB_PASSWORD, DB_NAME y SESSION_SECRET.'
    );
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});

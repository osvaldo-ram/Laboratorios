const express = require('express');
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET || 'biblioteca-lab-18-secret';
const csrfProtection = csrf();
const uploadsPath = path.join(__dirname, 'uploads');

const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, uploadsPath);
    },
    filename: (request, file, callback) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        callback(null, `${Date.now()}-${safeName}`);
    }
});

const fileFilter = (request, file, callback) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        return callback(null, true);
    }

    return callback(null, false);
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(multer({
    storage: fileStorage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
}).single('archivo'));
app.use('/uploads', express.static(uploadsPath));
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

    if (error.code === 'LIMIT_FILE_SIZE') {
        return response.status(413).send('El archivo es demasiado grande. Sube una imagen de maximo 2 MB.');
    }

    console.error(error);
    response.status(500).send(
        'Error interno. Revisa la conexion a MySQL, el esquema RBAC y las variables DB_HOST, DB_USER, DB_PASSWORD, DB_NAME y SESSION_SECRET.'
    );
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});

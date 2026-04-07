const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));

const librosRoutes = require('./routes/libros');
app.use('/', librosRoutes);

app.use((error, request, response, next) => {
    console.error(error);
    response.status(500).send(
        'Error interno. Revisa la conexion a MySQL y las variables DB_HOST, DB_USER, DB_PASSWORD y DB_NAME.'
    );
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});

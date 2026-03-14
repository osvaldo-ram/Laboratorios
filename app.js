const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const pagesRoutes = require('./routes/pages');
const contactosRoutes = require('./routes/contactos');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(pagesRoutes);
app.use('/contactos', contactosRoutes);

app.use((request, response) => {
  response.status(404).render('404', {
    pageTitle: '404 - Pagina no encontrada',
    currentPath: request.path,
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

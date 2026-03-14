const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const pagesRoutes = require('./routes/pages');
const contactosRoutes = require('./routes/contactos');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'laboratorio-14-sesiones-y-cookies-con-un-secreto-largo-y-seguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 30,
  },
}));
app.use((request, response, next) => {
  response.locals.flash = request.session.flash || null;
  response.locals.sessionVisitCount = request.session.visitCount || 0;
  response.locals.hasActiveSession = Boolean(
    response.locals.sessionVisitCount
    || (request.session.recentContacts && request.session.recentContacts.length)
  );

  delete request.session.flash;
  next();
});

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

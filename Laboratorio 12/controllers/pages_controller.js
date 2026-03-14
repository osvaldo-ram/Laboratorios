const Contacto = require('../models/contacto');
const { parseCookies } = require('../helpers/cookies');

exports.getInicio = (request, response) => {
  request.session.visitCount = (request.session.visitCount || 0) + 1;

  const stats = Contacto.getStats();
  const cookies = parseCookies(request.get('Cookie'));
  const preferredView = cookies.contactos_vista === 'favoritos' ? 'Favoritos' : 'Todos';
  const recentContacts = Contacto.findByIds(request.session.recentContacts || []);

  response.render('inicio', {
    pageTitle: 'Inicio',
    currentPath: '/',
    totalContactos: stats.total,
    totalFavoritos: stats.favorites,
    preferredView,
    lastViewedContact: cookies.ultimo_contacto || 'Sin visitas recientes en cookie.',
    recentContacts,
    visitCount: request.session.visitCount,
  });
};

exports.getAcerca = (request, response) => {
  response.render('acerca', {
    pageTitle: 'Acerca de',
    currentPath: '/acerca-de',
  });
};

exports.postCerrarSesion = (request, response) => {
  request.session.destroy(() => {
    response.clearCookie('connect.sid');
    response.redirect('/');
  });
};

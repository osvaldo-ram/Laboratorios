const Contacto = require('../models/contacto');

exports.getInicio = (request, response) => {
  const stats = Contacto.getStats();

  response.render('inicio', {
    pageTitle: 'Inicio',
    currentPath: '/',
    totalContactos: stats.total,
    totalFavoritos: stats.favorites,
  });
};

exports.getAcerca = (request, response) => {
  response.render('acerca', {
    pageTitle: 'Acerca de',
    currentPath: '/acerca-de',
  });
};

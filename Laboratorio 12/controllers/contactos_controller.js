const Contacto = require('../models/contacto');

exports.getLista = (request, response) => {
  const onlyFavorites = request.query.favoritos === '1';
  const contactos = Contacto.fetchAll({ favoritosOnly: onlyFavorites });

  response.render('contactos/lista', {
    pageTitle: onlyFavorites ? 'Contactos favoritos' : 'Lista de contactos',
    currentPath: '/contactos',
    contactos,
    onlyFavorites,
  });
};

exports.getAgregar = (request, response) => {
  response.render('contactos/agregar', {
    pageTitle: 'Agregar contacto',
    currentPath: '/contactos/agregar',
  });
};

exports.postAgregar = (request, response) => {
  const contacto = new Contacto({
    nombre: request.body.nombre,
    telefono: request.body.telefono,
    correo: request.body.correo,
    ciudad: request.body.ciudad,
    notas: request.body.notas,
    favorito: request.body.favorito === 'on',
  });

  contacto.save();
  response.redirect('/contactos');
};

exports.getDetalle = (request, response) => {
  const contacto = Contacto.findById(request.params.contactoId);

  if (!contacto) {
    return response.status(404).render('404', {
      pageTitle: 'Contacto no encontrado',
      currentPath: request.path,
    });
  }

  response.render('contactos/detalle', {
    pageTitle: 'Detalle de contacto',
    currentPath: '/contactos',
    contacto,
  });
};

exports.postFavorito = (request, response) => {
  const contacto = Contacto.toggleFavorite(request.params.contactoId);

  if (!contacto) {
    return response.status(404).render('404', {
      pageTitle: 'Contacto no encontrado',
      currentPath: request.path,
    });
  }

  const redirectTo = request.body.redirectTo === 'detalle'
    ? `/contactos/${request.params.contactoId}`
    : '/contactos';

  response.redirect(redirectTo);
};

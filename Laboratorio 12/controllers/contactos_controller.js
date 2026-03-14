const Contacto = require('../models/contacto');
const { appendCookie, parseCookies } = require('../helpers/cookies');

function setFlash(request, type, message) {
  request.session.flash = { type, message };
}

function getFormData(request) {
  const formData = request.session.formData || {
    nombre: '',
    telefono: '',
    correo: '',
    ciudad: '',
    notas: '',
    favorito: false,
  };

  delete request.session.formData;
  return formData;
}

function rememberRecentContact(request, contactId) {
  const currentIds = request.session.recentContacts || [];
  const withoutCurrent = currentIds.filter((id) => id !== contactId);

  request.session.recentContacts = [contactId, ...withoutCurrent].slice(0, 3);
}

exports.getLista = (request, response) => {
  const cookies = parseCookies(request.get('Cookie'));
  const requestedView = request.query.favoritos === '1'
    ? 'favoritos'
    : request.query.favoritos === '0'
      ? 'todos'
    : cookies.contactos_vista === 'favoritos'
      ? 'favoritos'
      : 'todos';
  const onlyFavorites = requestedView === 'favoritos';
  const contactos = Contacto.fetchAll({ favoritosOnly: onlyFavorites });

  appendCookie(response, 'contactos_vista', requestedView, {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'Lax',
    httpOnly: true,
  });

  response.render('contactos/lista', {
    pageTitle: onlyFavorites ? 'Contactos favoritos' : 'Lista de contactos',
    currentPath: '/contactos',
    contactos,
    onlyFavorites,
    preferredViewLabel: onlyFavorites ? 'solo favoritos' : 'todos los contactos',
  });
};

exports.getAgregar = (request, response) => {
  response.render('contactos/agregar', {
    pageTitle: 'Agregar contacto',
    currentPath: '/contactos/agregar',
    formData: getFormData(request),
  });
};

exports.postAgregar = (request, response) => {
  const formData = {
    nombre: request.body.nombre ? request.body.nombre.trim() : '',
    telefono: request.body.telefono ? request.body.telefono.trim() : '',
    correo: request.body.correo ? request.body.correo.trim() : '',
    ciudad: request.body.ciudad ? request.body.ciudad.trim() : '',
    notas: request.body.notas ? request.body.notas.trim() : '',
    favorito: request.body.favorito === 'on',
  };

  if (!formData.nombre || !formData.telefono || !formData.correo || !formData.ciudad) {
    request.session.formData = formData;
    setFlash(request, 'error', 'Completa nombre, telefono, correo y ciudad antes de guardar.');
    return response.redirect('/contactos/agregar');
  }

  const contacto = new Contacto({
    nombre: formData.nombre,
    telefono: formData.telefono,
    correo: formData.correo,
    ciudad: formData.ciudad,
    notas: formData.notas,
    favorito: formData.favorito,
  });

  contacto.save();
  setFlash(request, 'success', `Se agrego a ${contacto.nombre} correctamente.`);
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

  rememberRecentContact(request, contacto.id);
  appendCookie(response, 'ultimo_contacto', contacto.nombre, {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'Lax',
    httpOnly: true,
  });

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

  setFlash(
    request,
    'success',
    contacto.favorito
      ? `${contacto.nombre} ahora forma parte de tus favoritos.`
      : `${contacto.nombre} ya no aparece como favorito.`
  );

  response.redirect(redirectTo);
};

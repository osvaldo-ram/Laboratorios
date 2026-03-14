const express = require('express');

const Contacto = require('../models/contacto');

const router = express.Router();

router.get('/', (request, response) => {
  const contactos = Contacto.getAll();

  response.render('contactos/lista', {
    pageTitle: 'Lista de contactos',
    currentPath: '/contactos',
    contactos,
  });
});

router.get('/agregar', (request, response) => {
  response.render('contactos/agregar', {
    pageTitle: 'Agregar contacto',
    currentPath: '/contactos/agregar',
  });
});

router.post('/agregar', (request, response) => {
  Contacto.create({
    nombre: request.body.nombre,
    telefono: request.body.telefono,
    correo: request.body.correo,
    ciudad: request.body.ciudad,
    notas: request.body.notas,
  });

  response.redirect('/contactos');
});

router.get('/:contactoId', (request, response) => {
  const contacto = Contacto.getById(request.params.contactoId);

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
});

module.exports = router;

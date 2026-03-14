const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
  response.render('inicio', {
    pageTitle: 'Inicio',
    currentPath: '/',
  });
});

router.get('/acerca-de', (request, response) => {
  response.render('acerca', {
    pageTitle: 'Acerca de',
    currentPath: '/acerca-de',
  });
});

module.exports = router;

const express = require('express');
const contactosController = require('../controllers/contactos_controller');

const router = express.Router();

router.get('/', contactosController.getLista);
router.get('/agregar', contactosController.getAgregar);
router.post('/agregar', contactosController.postAgregar);
router.post('/:contactoId/favorito', contactosController.postFavorito);
router.get('/:contactoId', contactosController.getDetalle);

module.exports = router;

const express = require('express');
const router = express.Router();
const librosController = require('../controllers/librosController');

router.get('/', librosController.getLibros);
router.get('/add', librosController.getAdd);
router.post('/add', librosController.postAdd);
router.get('/libro/:libro_id', librosController.getDetalle);
router.get('/edit/:libro_id', librosController.getEdit);
router.post('/edit/:libro_id', librosController.postEdit);
router.post('/delete/:libro_id', librosController.postDelete);

module.exports = router;
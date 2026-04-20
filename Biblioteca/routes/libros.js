const express = require('express');
const router = express.Router();
const librosController = require('../controllers/librosController');
const isAuth = require('../middleware/is-auth');
const hasPermission = require('../middleware/has-permission');

router.use(isAuth);

router.get('/', hasPermission('libros:read'), librosController.getLibros);
router.get('/preguntas', hasPermission('libros:read'), librosController.getPreguntas);
router.get('/api/google-books', hasPermission('libros:create'), librosController.searchGoogleBooks);
router.get('/add', hasPermission('libros:create'), librosController.getAdd);
router.post('/add', hasPermission('libros:create'), librosController.postAdd);
router.get('/libro/:libro_id', hasPermission('libros:read'), librosController.getDetalle);
router.post('/libro/:libro_id/resenas', hasPermission('resenas:create'), librosController.postResena);
router.post('/libro/:libro_id/resenas/:resena_id/delete', hasPermission('resenas:delete'), librosController.postDeleteResena);
router.get('/edit/:libro_id', hasPermission('libros:update'), librosController.getEdit);
router.post('/edit/:libro_id', hasPermission('libros:update'), librosController.postEdit);
router.post('/delete/:libro_id', hasPermission('libros:delete'), librosController.postDelete);

module.exports = router;

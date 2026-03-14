const express = require('express');
const pagesController = require('../controllers/pages_controller');

const router = express.Router();

router.get('/', pagesController.getInicio);
router.get('/acerca-de', pagesController.getAcerca);

module.exports = router;

const express = require('express');
const router = express.Router();

const cardapioController = require('../controllers/cardapioController');

router.get('/', cardapioController.getHomePage);

module.exports = router;
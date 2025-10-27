const express = require('express');
const router = express.Router();

const cardapioRoutes = require('./cardapioRoutes');
const apiRoutes = require('./apiRoutes');

router.use('/', cardapioRoutes);  
router.use('/api', apiRoutes);     

module.exports = router;
const express = require('express');
const router = express.Router();

const cardapioRoutes = require('./cardapioRoutes');
const apiRoutes = require('./apiRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/', cardapioRoutes);  
router.use('/api', apiRoutes);
router.use('/admin', adminRoutes);     

module.exports = router;
const express = require('express');
const router = express.Router();

const apiController = require('../controllers/apiController');

router.post('/like/:id', apiController.likePrato);

router.post('/dislike/:id', apiController.dislikePrato);

router.post('/comment', apiController.addComment);

router.get('/chart-data', apiController.getChartData);

module.exports = router;
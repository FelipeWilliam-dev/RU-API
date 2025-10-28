const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { checkAdmin } = require('../middleware/authMiddleware');

router.get('/login', adminController.getLoginPage);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.getLogout);

router.use(checkAdmin);

router.get('/dashboard', adminController.getDashboard);
router.get('/cardapio', adminController.getCardapioPage);
router.post('/cardapio', adminController.postCardapio);
router.get('/comentarios', adminController.getComentariosPage);
router.post('/comentarios/aprovar/:id', adminController.postAprovarComentario);
router.post('/comentarios/excluir/:id', adminController.postExcluirComentario);


module.exports = router;
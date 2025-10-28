const Cardapio = require('../models/cardapio')

const getLoginPage = (req, res) => {
    res.render('admin/login', { layout: 'layouts/main', title: 'Login Admin' });
};

const postLogin = (req, res) => {
    const { password } = req.body;

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (password === adminPassword) {

        req.session.isAdmin = true;
        res.redirect('/admin/dashboard');
    } else {

        res.render('admin/login', {
            layout: 'layouts/main',
            title: 'Login Admin',
            error: 'Senha incorreta. Tente novamente.',
            isAdminPage: true
        });
    }
};

const getLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/admin/dashboard');
        }
        res.redirect('/');
    });
};

const getDashboard = (req, res) => {

    res.render('admin/dashboard', { 
        layout: 'layouts/main', 
        title: 'Dashboard',
        isAdminPage: true 
    });
};

const getCardapioPage = async (req, res) => {
    try {
        const todosOsPratos = await Cardapio.getAllPratos();
        const cardapioSemana = await Cardapio.getCardapioSemana();

        res.render('admin/gerenciar-cardapio', {
            layout: 'layouts/main',
            title: 'Gerenciar Cardápio',
            todosOsPratos,
            cardapioSemana,
            isAdminPage: true
        });
    } catch (error) {
        console.error("Erro ao carregar página de gerenciamento de cardápio:", error);
        res.status(500).send("Erro ao carregar a página.");
    }
};

const postCardapio = async (req, res) => {
    try {
        const { data, dia_semana, id_prato_principal } = req.body;
        
        if (!data || !dia_semana) {
            return res.status(400).send("Data e Dia da Semana são obrigatórios.");
        }

        await Cardapio.createOrUpdateCardapio(data, dia_semana, id_prato_principal);

        res.redirect('/admin/cardapio');

    } catch (error) {
        console.error("Erro ao salvar o cardápio:", error);
        res.status(500).send("Erro ao salvar o cardápio.");
    }
};

const getComentariosPage = (req, res) => { res.send('Página para Moderar Comentários'); };
const postAprovarComentario = (req, res) => { res.send('Comentário Aprovado!'); };
const postExcluirComentario = (req, res) => { res.send('Comentário Excluído!'); };


module.exports = {
    getLoginPage,
    postLogin,
    getLogout,
    getDashboard,
    getCardapioPage,
    postCardapio,
    getComentariosPage,
    postAprovarComentario,
    postExcluirComentario
};
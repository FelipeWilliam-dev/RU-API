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
            error: 'Senha incorreta. Tente novamente.'
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

    res.render('admin/dashboard', { layout: 'layouts/main', title: 'Dashboard' });
};

const getCardapioPage = (req, res) => { res.send('Página para Gerenciar Cardápio'); };
const postCardapio = (req, res) => { res.send('Cardápio salvo!'); };
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
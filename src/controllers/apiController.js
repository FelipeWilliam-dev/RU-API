const Cardapio = require('../models/cardapio');

const likePrato = async (req, res) => {
    try {
        const { id } = req.params;
        await Cardapio.addInteracao(id, 'like');
        const counts = await Cardapio.getInteractionCounts(id);
        res.status(200).json({ success: true, novasCurtidas: counts.like });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const dislikePrato = async (req, res) => {
    try {
        const { id } = req.params;
        await Cardapio.addInteracao(id, 'dislike');
        const counts = await Cardapio.getInteractionCounts(id);
        res.status(200).json({ success: true, novasNaoCurtidas: counts.dislike });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { pratoId, comentario } = req.body;
        const novoComentario = await Cardapio.createComment(pratoId, comentario);
        res.status(201).json({ success: true, novoComentario });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getChartData = async (req, res) => {
    try {
        const chartData = await Cardapio.getChartData();
        const labels = chartData.map(item => item.nome);
        const data = chartData.map(item => item.curtidas);
        res.status(200).json({ labels, data });
    } catch (error) {
        res.status(500).json({ labels: [], data: [], message: error.message });
    }
};

module.exports = { likePrato, dislikePrato, addComment, getChartData };
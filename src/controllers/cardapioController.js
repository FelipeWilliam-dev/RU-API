const Cardapio = require('../models/cardapio');

const getHomePage = async (req, res) => {
    try {
        const cardapioHoje = await Cardapio.getCardapioHoje();
        const cardapioSemana = await Cardapio.getCardapioSemana();
        
        let pratoDoDia = null;
        
        if (cardapioHoje) {
            pratoDoDia = {
                id_prato: cardapioHoje.prato_principal_id,
                nome: cardapioHoje.prato_principal_nome,
                descricao: cardapioHoje.prato_principal_descricao,
                receita: cardapioHoje.prato_principal_receita,
                foto_url: cardapioHoje.prato_principal_foto
            };

            const comentarios = await Cardapio.getComentarios(pratoDoDia.id_prato);
            const counts = await Cardapio.getInteractionCounts(pratoDoDia.id_prato);

            pratoDoDia.comentarios = comentarios;
            pratoDoDia.curtidas = counts.like;
            pratoDoDia.naocurtidas = counts.dislike;
        }

        res.render('index', {
            layout: 'layouts/main',
            title: 'Cardápio Semanal - RU ICET',
            pratoDoDia,
            cardapioSemana
        });
        
    } catch (error) {
        console.error("Erro ao carregar a página principal:", error);
        res.status(500).send("Erro ao carregar as informações do cardápio.");
    }
};

module.exports = { getHomePage };
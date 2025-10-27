const getHomePage = (req, res) => {
    const mockData = {
        pratoDoDia: { nome: 'Feijoada (Exemplo)' },
        cardapioSemana: [
            { dia: 'Segunda', prato: 'Frango Assado' }
        ]
    };

    res.render('index', {
        layout: 'main', 
        title: 'Cardápio RU',
        ...mockData // passa todos os dados do objeto mockData
    });
};

module.exports = {
    getHomePage
};
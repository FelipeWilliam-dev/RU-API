const db = require('../config/database');

class Prato {
    
    static async getAllPratos() {
        const sql = 'SELECT id_prato, nome FROM pratos ORDER BY nome ASC';
        const [rows] = await db.execute(sql);
        return rows;
    }

    
    static async getPopularPratosChartData() {
        const sql = `
            SELECT p.nome, COUNT(i.id_interacao) AS curtidas
            FROM pratos p
            LEFT JOIN interacoes i ON p.id_prato = i.id_prato AND i.tipo = 'like'
            GROUP BY p.id_prato, p.nome
            ORDER BY curtidas DESC LIMIT 7;
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }
}

module.exports = Prato;
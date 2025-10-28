const db = require('../config/database');

class Cardapio {

    static async createOrUpdateCardapio(data, dia_semana, id_prato_principal) {
        const checkSql = 'SELECT id_cardapio FROM cardapio_semana WHERE data = ?';
        const [existing] = await db.execute(checkSql, [data]);

        if (existing.length > 0) {
            const id_cardapio = existing[0].id_cardapio;
            const updateSql = 'UPDATE cardapio_semana SET dia_semana = ?, id_prato_principal = ? WHERE id_cardapio = ?';
            await db.execute(updateSql, [dia_semana, id_prato_principal || null, id_cardapio]);
            return { id: id_cardapio, updated: true };
        } else {
            const insertSql = 'INSERT INTO cardapio_semana (data, dia_semana, id_prato_principal) VALUES (?, ?, ?)';
            const [result] = await db.execute(insertSql, [data, dia_semana, id_prato_principal || null]);
            return { id: result.insertId, created: true };
        }
    }

    static async getCardapioHoje() {
        const sql = `
            SELECT 
                cs.data, pp.id_prato AS prato_principal_id, pp.nome AS prato_principal_nome,
                pp.descricao AS prato_principal_descricao, pp.receita AS prato_principal_receita,
                pp.foto_url AS prato_principal_foto
            FROM cardapio_semana cs
            LEFT JOIN pratos pp ON cs.id_prato_principal = pp.id_prato
            WHERE cs.data = CURDATE()
            LIMIT 1;
        `;
        const [rows] = await db.execute(sql);
        return rows[0];
    }

    static async getCardapioSemana() {
        const sql = `
            SELECT DATE_FORMAT(cs.data, '%d/%m') AS data_formatada, cs.dia_semana, pp.nome AS prato_principal_nome
            FROM cardapio_semana cs
            LEFT JOIN pratos pp ON cs.id_prato_principal = pp.id_prato
            WHERE cs.data >= CURDATE()
            ORDER BY cs.data ASC
            LIMIT 5;
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }
}

module.exports = Cardapio;
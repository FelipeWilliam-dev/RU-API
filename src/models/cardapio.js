const db = require('../config/database');

const mapInteractionCounts = (rows) => {
    const counts = { like: 0, dislike: 0 };
    for (const row of rows) {
        if (row.tipo === 'like') counts.like = row.total;
        else if (row.tipo === 'dislike') counts.dislike = row.total;
    }
    return counts;
};

class Cardapio {

    static async getCardapioHoje() {
        const sql = `
            SELECT 
                cs.data,
                pp.id_prato    AS prato_principal_id,
                pp.nome        AS prato_principal_nome,
                pp.descricao   AS prato_principal_descricao,
                pp.receita     AS prato_principal_receita,
                pp.foto_url    AS prato_principal_foto
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
            SELECT 
                DATE_FORMAT(cs.data, '%d/%m') AS data_formatada,
                cs.dia_semana,
                pp.nome AS prato_principal_nome
            FROM cardapio_semana cs
            LEFT JOIN pratos pp ON cs.id_prato_principal = pp.id_prato
            WHERE cs.data >= CURDATE()
            ORDER BY cs.data ASC
            LIMIT 5;
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }
    
    static async getComentarios(pratoId) {
        const sql = 'SELECT autor_nome, texto FROM comentarios WHERE id_prato = ? AND aprovado = 1 ORDER BY data_hora DESC';
        const [rows] = await db.execute(sql, [pratoId]);
        return rows;
    }

    static async addInteracao(pratoId, tipo) {
        const sql = 'INSERT INTO interacoes (id_prato, tipo) VALUES (?, ?)';
        await db.execute(sql, [pratoId, tipo]);
    }

    static async getInteractionCounts(pratoId) {
        const sql = 'SELECT tipo, COUNT(*) as total FROM interacoes WHERE id_prato = ? GROUP BY tipo';
        const [rows] = await db.execute(sql, [pratoId]);
        return mapInteractionCounts(rows);
    }

    static async createComment(pratoId, texto, usuario = 'Anônimo') {
        const sql = 'INSERT INTO comentarios (id_prato, texto, autor_nome) VALUES (?, ?, ?)';
        const [result] = await db.execute(sql, [pratoId, texto, usuario]);
        return { id: result.insertId, autor_nome: usuario, texto };
    }

    static async getChartData() {
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

module.exports = Cardapio;
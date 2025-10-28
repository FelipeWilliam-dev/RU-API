const db = require('../config/database');

const mapInteractionCounts = (rows) => {
    const counts = { like: 0, dislike: 0 };
    for (const row of rows) {
        if (row.tipo === 'like') counts.like = row.total;
        else if (row.tipo === 'dislike') counts.dislike = row.total;
    }
    return counts;
};

class Comentario {

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

    static async getComentariosPendentes() {
        const sql = `
            SELECT c.id_comentario, c.texto, c.autor_nome, p.nome AS nome_prato
            FROM comentarios c
            JOIN pratos p ON c.id_prato = p.id_prato
            WHERE c.aprovado = 0 
            ORDER BY c.data_hora ASC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async aprovarComentario(id_comentario) {
        const sql = 'UPDATE comentarios SET aprovado = 1 WHERE id_comentario = ?';
        await db.execute(sql, [id_comentario]);
    }

    static async excluirComentario(id_comentario) {
        const sql = 'DELETE FROM comentarios WHERE id_comentario = ?';
        await db.execute(sql, [id_comentario]);
    }
}

module.exports = Comentario;
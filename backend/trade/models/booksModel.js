const db = require("../config/db");

const Books = {

    async list() {
        const [rows] = await db.query(`
            SELECT *
            FROM books
            ORDER BY book_id DESC
        `);

        return rows;
    },

    async view(id) {
        const [rows] = await db.query(
            `SELECT * FROM books WHERE book_id = ?`,
            [id]
        );

        return rows[0];
    },

};

module.exports = Books;
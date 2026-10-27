const db = require("../config/db");

const Counterparties = {

    async list() {
        const [rows] = await db.query(`
            SELECT *
            FROM counterparties
            ORDER BY counterparty_id DESC
        `);

        return rows;
    },

    async view(id) {
        const [rows] = await db.query(
            `SELECT * FROM counterparties WHERE counterparty_id = ?`,
            [id]
        );

        return rows[0];
    },


};

module.exports = Counterparties;
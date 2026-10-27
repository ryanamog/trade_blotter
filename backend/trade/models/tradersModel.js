const db = require("../config/db");

const Traders = {

    async list() {
        const [rows] = await db.query(`
            SELECT *
            FROM traders
            ORDER BY trader_id ASC
        `);

        return rows;
    },

    async view(id) {
        const [rows] = await db.query(
            `SELECT * FROM traders WHERE trader_id = ?`,
            [id]
        );

        return rows[0];
    },

};

module.exports = Traders;
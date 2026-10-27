const db = require("../config/db");

const Instruments = {

    async list() {
        const [rows] = await db.query(`
            SELECT *
            FROM instruments
            ORDER BY symbol ASC
        `);

        return rows;
    },

    async view(id) {
        const [rows] = await db.query(
            `SELECT * FROM instruments WHERE symbol = ?`,
            [id]
        );

        return rows[0];
    },

};

module.exports = Instruments;
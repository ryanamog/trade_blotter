const db = require("../config/db");

const Trades = {

    async list() {
        const [rows] = await db.query(`
            SELECT 
                t.trade_id AS tradeId,
                t.symbol,
                i.company_name,
                t.side,
                t.quantity,
                t.price,
                t.notional_value AS notionalValue,
                tr.username AS trader,
                b.book_name AS book,
                c.name AS counterparty,
                -- Formats the date back to standard ISO 8601 UTC string format
                DATE_FORMAT(t.trade_timestamp, '%Y-%m-%dT%H:%i:%sZ') AS tradeTimestamp,
                t.status
            FROM trades t
            JOIN traders tr ON t.trader_id = tr.trader_id
            JOIN instruments i ON t.symbol = i.symbol
            JOIN books b ON t.book_id = b.book_id
            JOIN counterparties c ON t.counterparty_id = c.counterparty_id;
        `);

        return rows;
    },

    async view(id) {
        const [rows] = await db.query(
            `SELECT 
                t.trade_id AS tradeId,
                t.symbol,
                t.side,
                t.quantity,
                t.price,
                t.notional_value AS notionalValue,
                tr.username AS trader,
                b.book_name AS book,
                c.name AS counterparty,
                -- Formats the date back to standard ISO 8601 UTC string format
                DATE_FORMAT(t.trade_timestamp, '%Y-%m-%dT%H:%i:%sZ') AS tradeTimestamp,
                t.status
            FROM trades t
            JOIN traders tr ON t.trader_id = tr.trader_id
            JOIN books b ON t.book_id = b.book_id
            JOIN counterparties c ON t.counterparty_id = c.counterparty_id
            WHERE t.trade_id = ?;`,
            [id]
        );

        return rows[0];
    },

    async create(data) {

        const sql = `
            INSERT INTO trades
            (
                trade_id,
                symbol,
                trader_id,
                book_id,
                counterparty_id,
                side,
                quantity,
                price,
                trade_timestamp,
                status
            )
            VALUES
            (?,?,(SELECT trader_id FROM traders WHERE username = ?),(SELECT book_id FROM books WHERE book_name = ?),(SELECT counterparty_id FROM counterparties WHERE name = ?),?,?,?,?,?)
        `;

        console.log(sql);

        const [result] = await db.query(sql, [
            data.trade_id,
            data.symbol,
            data.trader,
            data.book,
            data.counterparty,
            data.side,
            data.quantity,
            data.price,
            data.timestamp,
            data.status
        ]);

        return result;
    },

    async amend(id, data) {

        const sql = `
            UPDATE trades
            SET
                trader_id=?,
                book_id=?,
                counterparty_id=?,
                quantity=?,
                price=?,
                status=?
            WHERE trade_id=?
        `;

        const [result] = await db.query(sql, [
            data.trader,
            data.book,
            data.counterparty,
            data.quantity,
            data.price,
            'AMENDED',
            id
        ]);

        return result;
    },

    async cancelled(id) {

        const sql = `
            UPDATE trades
            SET
                status=?
            WHERE trade_id=?
        `;

        const [result] = await db.query(sql, [
            'CANCELLED',
            id
        ]);

        return result;
    },

};

module.exports = Trades;
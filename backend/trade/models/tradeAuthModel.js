const db = require("../config/db");

const Trade = {

    async validateUsername(username) {
        const [rows] = await db.query(
            `SELECT * FROM trade_users WHERE username = ?`,
            [username]
        );

        return rows[0];
    },

    async failedAttempts(failed_cnt, user_id) {

         const sql = `
                    UPDATE trade_users
                        SET failed_attempts = ?
                        WHERE tuser_id = ?
                `;
        
        const [result] = await db.query(sql, [
            failed_cnt,
            user_id        
           ]); 

        return result;
    },

    async failedAttemptsLock(failed_cnt, lock_min, user_id) {

         const sql = `
                    UPDATE trade_users
                    SET
                        failed_attempts = ?,
                        locked_until =
                        DATE_ADD(
                            NOW(),
                            INTERVAL ? MINUTE
                        )
                    WHERE tuser_id = ?
                `;
        
        const [result] = await db.query(sql, [
            failed_cnt,
            lock_min,
            user_id        
           ]); 

        return result;
    },

    async createLog(uid, username, status, remarks) {
        const sql = `
            INSERT INTO trade_login_history
            (
                user_id,
                username,
                login_status,
                remarks
            )
            VALUES
            (
                ?,?,?,?
            )
        `;

        const [result] = await db.query(sql, [
            uid,
            username,
            status,
            remarks
        ]);

        return result;
    },

    async createOtp(email, opt_hash, expire) {
        const sql = `
            INSERT INTO trade_otp_codes
            (
                email, 
                otp_hash, 
                expires_at
            )
            VALUES (
                ?, ?, ?
            )
        `;

        const [result] = await db.query(sql, [
            email,
            opt_hash,
            expire
        ]);

        return result;
    },

    async validateOtp(email) {
        const [rows] = await db.query(
             `
            SELECT *
            FROM trade_otp_codes
            WHERE email = ?
            AND verified = 0
            ORDER BY id DESC
            LIMIT 1
            `,
            [email]
        );

        return rows[0];
    },

    async updateOtp(id) {
        await db.query(
            `
            UPDATE trade_otp_codes
            SET verified = 1
            WHERE id = ?
            `,
            [id]
        );

        return;
    },
};

module.exports = Trade;
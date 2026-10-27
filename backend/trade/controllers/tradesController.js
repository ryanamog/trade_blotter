const Trades = require("../models/tradesModel");

exports.list = async (req, res) => {

    try {

        const data = await Trades.list();

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.view = async (req, res) => {

    try {

        const data = await Trades.view(
            req.params.id
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Trade ID not found"
            });
        }

        res.json({
            success: true,
            data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.create = async (req, res) => {

    try {

        const result =
            await Trades.create(req.body);

        res.status(201).json({
            success: true,
            trade_id: result.insertId
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.amend = async (req, res) => {

    try {

        const result =
            await Trades.amend(req.params.id, req.body);

        res.status(201).json({
            success: true,
            message: result
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.cancelled = async (req, res) => {

    try {

        const result =
            await Trades.cancelled(req.params.id);

        res.status(201).json({
            success: true,
            message: result
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Used AI
exports.live = async (req, res) => {
    // 1. Establish mandatory SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Recommended if your production app sits behind an Nginx proxy
    res.setHeader('X-Accel-Buffering', 'no'); 

    // 2. Define the interval logic using an async callback
    const intervalId = setInterval(async () => {
        try {
            // Fetch the updated trades list from your Model
            const data = await Trades.list();

            const payload = {
                success: true,
                count: data.length,
                data
            };

            // 3. Format strictly for SSE: "data: <stringified_json>\n\n"
            // Use res.write() so the HTTP pipeline stays wide open
            res.write(`data: ${JSON.stringify(payload)}\n\n`);

        } catch (err) {
            // NEVER use res.status or res.json inside the interval loop.
            // Stream the error object to the client instead so they can handle it.
            const errorPayload = {
                success: false,
                message: err.message
            };
            res.write(`data: ${JSON.stringify(errorPayload)}\n\n`);
        }
    }, 5000);

    // 4. Tear down the timer when the client navigates away or disconnects
    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
};
const Instruments = require("../models/instrumentsModel");

exports.list = async (req, res) => {

    try {

        const data = await Instruments.list();

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

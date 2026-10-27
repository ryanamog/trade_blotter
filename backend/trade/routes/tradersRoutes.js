const express = require("express");
const router = express.Router();

const tradersController =
    require("../controllers/tradersController");

router.get(
    "/traders",
    tradersController.list
);

module.exports = router;
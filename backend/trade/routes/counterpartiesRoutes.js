const express = require("express");
const router = express.Router();

const counterpartiesController =
    require("../controllers/counterpartiesController");

router.get(
    "/counterparties",
    counterpartiesController.list
);

module.exports = router;
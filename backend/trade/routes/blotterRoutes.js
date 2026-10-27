const express = require("express");

const router = express.Router();

const blotterController =
    require("../../controllers/blotterController");

router.get(
    "/blotters",
    blotterController.list
);

router.post(
    "/blotters",
    blottersController.create
);

router.get(
    "/blotters/:id",
    blotterController.view
);

module.exports = router;
const express = require("express");
const router = express.Router();

const tradesController =
    require("../controllers/tradesController");

router.get(
    "/trades",
    tradesController.list
);

router.post(
    "/trades",
    tradesController.create
);

router.get("/trades/live-stream",
    tradesController.live
);

router.patch(
    "/trades/amend/:id",
    tradesController.amend
);

router.patch(
    "/trades/cancelled/:id",
    tradesController.cancelled
);


module.exports = router;
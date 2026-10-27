const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/auth');

const tradeAuthController =
    require("../controllers/tradeAuthController");

router.post("/trade/login", tradeAuthController.login);

router.post("/trade/validate_otp", tradeAuthController.validateOtp);

router.use(verifyToken);

router.get("/trade/validate_token", tradeAuthController.validateToken);

module.exports = router;
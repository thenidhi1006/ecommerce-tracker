const express = require("express");
const router = express.Router();
const { applyBestCoupon } = require("../controllers/couponController");
const auth = require("../middleware/authMiddleware");

router.post("/apply-best-coupon", auth, applyBestCoupon);

module.exports = router;


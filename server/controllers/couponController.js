const Coupon = require("../models/Coupon");

// POST /api/coupon/apply-best-coupon
exports.applyBestCoupon = async (req, res) => {
  try {
    const { platform, cart } = req.body;
    const userId = req.user.userId;


    // 1️⃣ Calculate total cart value
    let totalAmount = 0;
    cart.forEach(item => {
      totalAmount += Number(item.price) * Number(item.quantity);
    });

    // 2️⃣ Get all coupons for the platform
    const coupons = await Coupon.find({ platform });

    let bestCoupon = null;
    let maxDiscount = 0;

    // 3️⃣ Check each coupon
    coupons.forEach(coupon => {
      // Minimum order check
      if (totalAmount < coupon.minOrderValue) return;

      // Expiry check
      if (new Date(coupon.expiryDate) < new Date()) return;

      let discount = 0;

      // Percentage discount
      if (coupon.discountType === "percentage") {
        discount = (coupon.discountValue / 100) * totalAmount;
      }

      // Flat discount
      if (coupon.discountType === "flat") {
        discount = coupon.discountValue;
      }

      // Pick best coupon
      if (discount > maxDiscount) {
        maxDiscount = discount;
        bestCoupon = coupon;
      }
    });

    // 4️⃣ If no coupon found
    if (!bestCoupon) {
      return res.json({
        message: "No applicable coupon found",
        finalPrice: totalAmount
      });
    }

    // 5️⃣ Send result
    res.json({
      bestCoupon: bestCoupon.code,
      discount: Math.round(maxDiscount),
      finalPrice: Math.round(totalAmount - maxDiscount)
    });

  } catch (error) {
    console.error("Coupon error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


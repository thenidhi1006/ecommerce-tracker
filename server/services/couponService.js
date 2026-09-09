const coupons = require("../data/couponsData");

function findBestCoupon(cart) {
  let totalAmount = 0;
  let categories = new Set();

  cart.forEach(item => {
    totalAmount += item.price * item.quantity;
    categories.add(item.category);
  });

  let bestCoupon = null;
  let maxSavings = 0;
  const today = new Date();

  coupons.forEach(coupon => {
    const expiryDate = new Date(coupon.expiry);

    if (totalAmount < coupon.minPurchase) return;
    if (expiryDate < today) return;
    if (coupon.category !== "all" && !categories.has(coupon.category)) return;

    let savings = coupon.type === "percentage"
      ? (coupon.value / 100) * totalAmount
      : coupon.value;

    if (savings > maxSavings) {
      maxSavings = savings;
      bestCoupon = coupon;
    }
  });

  return {
    totalAmount,
    bestCoupon: bestCoupon ? bestCoupon.code : "No Coupon",
    savings: maxSavings,
    finalAmount: totalAmount - maxSavings
  };
}

module.exports = { findBestCoupon };

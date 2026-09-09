const coupons = [
  {
    code: "SAVE20",
    type: "percentage",
    value: 20,
    minPurchase: 1000,
    category: "electronics",
    expiry: "2026-02-01"
  },
  {
    code: "FLAT500",
    type: "flat",
    value: 500,
    minPurchase: 2000,
    category: "all",
    expiry: "2026-02-01"
  }
];

module.exports = coupons;

const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  discountType: {
    type: String, // percentage or flat
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  minOrderValue: {
    type: Number,
    required: true
  },
  category: {
    type: String, // stationery, electronics, all
    default: "all"
  },
  expiryDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Coupon", couponSchema);

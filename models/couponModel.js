const mongoose = require("mongoose");

const coupon = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    couponType: {
      type: String,
    },
    usersUsed: {
      type: [String],
    },
    minPurchase: {
      type: Number,
    },
    maxDiscount: {
      type: Number,
    },
    product: {
      type: String,
    },
    category: {
      type: String,
    },
  },
  { timestamp: true }
);
module.exports = mongoose.model("Coupon", coupon);

/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const coupon = mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  percent: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'Active',
  },
  coupontype: {
    type: String,
  },
  userId: {
    type: [String],
  },
  minimum: {
    type: Number,
  },
  maximum: {
    type: Number,
  },
  product: {
    type: String,
  },
  category: {
    type: String,
  },
}, { timestamp: true });
module.exports = mongoose.model('coupon', coupon);

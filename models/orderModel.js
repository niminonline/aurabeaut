/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: 'User',
    },
    name: {
      type: String,
    },
    product: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        image: { type: String },
        total: { type: Number },
        description: { type: String },
      },
    ],
    address: {
      type: String,
    },
    total: {
      type: Number,
    },
    paymentMethod: {
      type: String,
    },
    status: {
      type: String,
    },
    coupon: {
      type: String,
    },
    date: {
      type: String,
    },
    returndate: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', orderSchema);

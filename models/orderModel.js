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
        quantity: { type: Number},
        image: { type: String },
        total: { type: Number },
      },
    ],
    address: {
      type: String,
      
    },
    mobile:{
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    paymentMethod: {
      type: String,
    },
    status: {
      type: String,
      default: 'Pending',
    enum: ['Pending','Confirmed', 'Shipped','Delivered','Returned'],
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
    notes:{
      type:String,
      
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', orderSchema);

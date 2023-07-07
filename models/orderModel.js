const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type:mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    invoiceNumber:{
      type:String,
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
    address:{
      name: {
        type: String,
        required: false,
      },
    
      mobile: {
        type: String,
        required: false,
      },
    
      address: {
        type: String,
        required: false,
      },
    
      city: {
        type: String,
        required: false,
      },
    
      state: {
        type: String,
        required: false,
      },
    
      pincode: {
        type: String,
        required: false,
      },
      landmark: {
        type: String,
        required: false,
      },
  },
  subTotal: {
    type: Number,
  },
  discount: {
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
    enum: ['Pending','Confirmed', 'Shipped','Delivered','Returned','Cancelled'],
    },
    coupon: {
      type: String,
    },
    date: {
      type: Date,
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

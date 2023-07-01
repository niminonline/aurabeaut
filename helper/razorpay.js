
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.razorPayId,
  key_secret: process.env.razorPaySecret
});


module.exports= razorpay
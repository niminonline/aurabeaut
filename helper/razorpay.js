
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_test_9zHydJZu7xq9lh',
  key_secret: 'jkKc4IRr3DMm1bcaAyPpCv23'
});
// const razorpay = new Razorpay({
//   key_id: process.env.razorPayId,
//   key_secret: process.env.razorPaySecret
// });


module.exports= razorpay
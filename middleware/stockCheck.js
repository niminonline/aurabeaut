const Product = require("../models/productModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");

const stockCheck = async (req, res,next) => {
    try {
        console.log("Entered stock");
      
      const userData = await User.findOne({ _id: req.session.user_id })
        .populate("cart.product")
        .lean();
     
      let stockOut=0;
       userData.cart.map(item => 
        {
          // console.log("stock, quantity",item.product.stock,"---",item.quantity)
          if(item.product.stock>=item.quantity)
          {
           
      }
      else{
        stockOut=1;
        // console.log(" stock else block");
      }
     });
     if(stockOut!=0){
        // console.log(" stock redirect");
        res.json("noStock")
    //  res.redirect( `/order-failure?error=out of stock`);

     }
     else{
        console.log(" stock next");

        next();
     }
    }
    catch(err){
        console.log(errr)
    }
}
module.exports={stockCheck}
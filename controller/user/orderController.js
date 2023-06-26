const Order = require("../../models/orderModel");


//=================Load Checkout Page================================

const loadCheckout = (req, res) => {
    try {
      res.render("checkout");
    } 
    catch (error) {
      console.log(error.message);
    }
  };
  


module.exports = {loadCheckout};

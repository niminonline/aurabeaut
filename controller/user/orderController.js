const Product = require("../../models/productModel");
const User = require("../../models/userModel");
const Order = require("../../models/orderModel");
const { ObjectId } = require("mongodb");
const { generateInvoicePDF } = require("../../helper/html-pdf");
const path = require("path");
const fs = require("fs");
const { createInvoiceHtml } = require("../../helper/invoiceFormat");
const razorpay = require("../../helper/razorpay");
const crypto = require("../../helper/crypto");
const {
  validatePaymentVerification,
  validateWebhookSignature,
} = require("../../node_modules/razorpay/dist/utils/razorpay-utils.js");

//=================Load Checkout Page================================

const loadCheckout = async (req, res) => {
  try {
    const id = new ObjectId(req.session.user_id);
    const userData = await User.findOne({ _id: req.session.user_id })
      .populate("cart.product")
      .lean();
    const productData = await Product.find();

    let sum = 0;
    const subTotal = userData.cart.map((item) => {
      sum += item.product.price * item.quantity;
      return sum;
    });

    if (userData.cart.length > 0) {
      res.render("checkout", {
        userData: userData,
        subTotal: sum,
      });
    } else {
      res.render("cart", {
        userData: userData,
        subTotal: sum,
        errorMessage: "Your cart is empty",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//=================Place Order================================

const placeOrder = async (req, res) => {
  try {
    const { notes, paymentMode, addressIndex, totalAmount } = req.body;
    const userData = await User.findOne({ _id: req.session.user_id })
      .populate("cart.product")
      .lean();
    const lastOrder= await  Order.find().sort({_id:-1}).limit(1);
    const invoiceNumber=  parseInt(lastOrder[0].invoiceNumber.match(/\d+/)[0]) + 1

    const cartProducts = userData.cart.map(item => 
         ({
    id: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    image: item.product.imageUrl[0],
    total: item.product.price * item.quantity
      }));
      
    const selectedAddress = userData.address[addressIndex];

    const order = new Order({
      userId: new ObjectId(req.session.user_id),
      invoiceNumber: invoiceNumber,
      name: userData.name,
      product: cartProducts,
      mobile: userData.address[addressIndex].mobile,
      address: selectedAddress,
      totalAmount: totalAmount,
      paymentMethod: paymentMode,
      date: new Date().toISOString().split("T")[0],
      notes: notes,
    });



    const saveOrder = await order.save();

    if (saveOrder) {
      const userData = await User.findOne({ _id: req.session.user_id });
      userData.cart = [];
      await userData.save();

      console.log("Data added successfully");
      const orderData= await Order.findOne({invoiceNumber:invoiceNumber});
        res.json(orderData);
    } else {
      console.log("Failed to add data");
    }
    
  } catch (error) {
    console.log(error.message);
  }
};

//=================Orders Load================================

const ordersLoad = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.session.user_id });
    const orderData = await Order.find({ userId: req.session.user_id });
    res.render("orders", { orderData: orderData, userData: userData });
  } catch (error) {
    console.log(error.message);
  }
};

//=================Order Details Load================================

const orderDetailsLoad = async (req, res) => {
  try {
    const { _id } = req.query;
    const userData = await User.findOne({ _id: req.session.user_id });
    const orderData = await Order.findById({ _id });
    res.render("orderDetails", { orderData: orderData, userData: userData });
  } catch (error) {
    console.log(error.message);
  }
};
//=================Download Invoice================================

const downloadInvoice = async (req, res) => {
  try {
    const { _id } = req.query;
    const orderData = await Order.findById(_id);
    const invoiceHtml = createInvoiceHtml({
      invoiceNumber: orderData.invoiceNumber,
      date: orderData.date,
      recipient: orderData.address.name,
      addressLine1: orderData.address.address,
      addressLine2:orderData.address.city+", "+orderData.address.state+" - "+orderData.address.pincode,
      mobile: orderData.address.mobile,
      paymentMethod: orderData.paymentMethod,
      items: orderData.product,
      total: orderData.totalAmount,
    });

    const outputFilePath = path.join(__dirname, "invoice001.pdf");
    await generateInvoicePDF(invoiceHtml, outputFilePath);

    res.download(outputFilePath, "invoice.pdf", (downloadError) => {
      if (downloadError) {
        console.error("Error downloading invoice PDF:", downloadError);
        res.status(500).send("Error downloading invoice PDF");
      }
      fs.unlinkSync(outputFilePath);
    });
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    res.status(500).send("Error generating invoice PDF");
  }
};

//===============================Payment Gateway==========================
const paymentGateway = async (req, res) => {
  try {
    const { notes, paymentMode, addressIndex } = req.body;
    const totalAmount = req.body.totalAmount * 100;
    const userData = await User.findById(req.session.user_id);

    const payment = await razorpay.orders.create(
      {
        amount: totalAmount,
        currency: "INR",
        receipt: "receipt_id",
        payment_capture: 1,
      },
      function (error, order) {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Failed to create Razorpay order" });
        } else {
          order.userName = userData.name;
          order.userEmail = userData.email;
          order.userMobile = userData.mobile;
          res.json(order);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Payment creation failed");
  }
};

//===============================PG order==========================
const pgOrder = async (req, res) => {
  try {
    const { order_id } = req.body;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body.response;

console.log("orderid",order_id,"rpp id",razorpay_payment_id," rporid,",razorpay_order_id," rp sign-",razorpay_signature);

    const generated_signature = await crypto.generateHmacSha256(
      order_id + "|" + razorpay_payment_id,
      process.env.razorPaySecret
    );
    console.log("gen signature",generated_signature);
    if (generated_signature == razorpay_signature) {
      console.log("payment is successful");

      const validate = validatePaymentVerification(
        { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
        razorpay_signature,
        process.env.razorPaySecret
      );
      if (validate) {
        console.log("validation- success.....");
        res.sendStatus(200);

      } else {
        console.log("Payment validation failed");
        res.sendStatus(500);
      }
    } else {
      console.log("Payment failed");
      res.sendStatus(500);
    }
  } catch (error) {
    console.log(error.message);
  }
};

//=============================== order Success ==========================
const orderSuccess = async (req, res) => {
  try {
    const {invoiceNumber,orderId} =req.query;
    const userData= await User.findById(req.session.user_id)
   
   res.render("orderSuccess",{invoiceNumber:invoiceNumber,orderId:orderId,userData:userData});
  } catch (error) {
    console.log(error.message);
  }
}

//=============================== order Failure ==========================
const orderFailure = async (req, res) => {
  try {
    const userData= User.findOneById(req.session.user_id)
   
   res.render("orderFailure",{userData:userData});
  } catch (error) {
    console.log(error.message);
  }
}




module.exports = {
  loadCheckout,
  orderDetailsLoad,
  ordersLoad,
  downloadInvoice,
  placeOrder,
  paymentGateway,
  pgOrder,
  orderSuccess,
  orderFailure
};
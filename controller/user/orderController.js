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
const {  validatePaymentVerification,validateWebhookSignature,} = require("../../node_modules/razorpay/dist/utils/razorpay-utils.js");

//=================Load Checkout Page================================

const loadCheckout = async (req, res) => {
  try {
    const id = new ObjectId(req.session.user_id);
    const userData = await User.findOne({ _id: req.session.user_id })
      .populate("cart.product")
      .lean();
    // const userData = await User.aggregate([{
    //       $match: { _id: id}
    //     },
    //   {
    //     $lookup: {
    //       from: 'products',
    //       localField: 'cart.product',
    //       foreignField: '_id',
    //       as: 'product'
    //     }
    //   }
    // ])
    const productData = await Product.find();

    let sum = 0;
    //totalAmount = 0;
    const subTotal = userData.cart.map((item) => {
      sum += item.product.price * item.quantity;
      // totalAmount += sum;
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

//=================cod Order================================

const codOrder = async (req, res) => {
  try {
    const { notes, paymentMode, addressIndex, totalAmount } = req.body;
    const userData = await User.findOne({ _id: req.session.user_id })
      .populate("cart.product")
      .lean();

    const cartProducts = userData.cart.map((item) => ({
      id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.imageUrl[0],
      total: item.product.price * item.quantity,
    }));

    const selectedAddress = userData.address[addressIndex];
    const address =
      selectedAddress.address +
      ", " +
      selectedAddress.city +
      ", " +
      selectedAddress.state +
      ", Pincode: " +
      selectedAddress.pincode +
      ", " +
      selectedAddress.landmark;

    const order = new Order({
      userId: new ObjectId(req.session.user_id),
      name: userData.address[addressIndex].name,
      product: cartProducts,
      mobile: userData.address[addressIndex].mobile,
      address: address,
      totalAmount: totalAmount,
      paymentMethod: paymentMode,
      date: new Date().toISOString().split("T")[0],
      notes: notes,
    });

    console.log("Cart prducts", cartProducts);

    cartProducts.map((item) => {});

    //////////////////////

    const saveOrder = await order.save();

    if (saveOrder) {
      const userData = await User.findOne({ _id: req.session.user_id });
      userData.cart = [];
      await userData.save();

      console.log("Data added successfully");

      res.status(200).json({ message: "Order placed successfully!" });
    } else {
      console.log("Failed to add data");
    }

    // const userDataSave = user.save();
    // console.log("New order=========",order);
    // console.log("Address=========",order.address);
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
      invoiceNumber: orderData._id,
      date: orderData.date,
      recipient: orderData.name,
      address: orderData.address,
      mobile: orderData.mobile,
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
    console.log("pg-body", req.body);
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
    const { order_id } = req.query;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    const generated_signature = await crypto.generateHmacSha256(
      order_id + "|" + razorpay_payment_id,
      process.env.razorPaySecret
    );
    console.log("gen sign", generated_signature);
    console.log("rp sign", razorpay_signature);
    if (generated_signature == razorpay_signature) {
      console.log("payment is successful");

      
      validatePaymentVerification(
        { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
        razorpay_signature,
        process.env.razorPaySecret
      );
      console.log("Val payment verifivcation=",validatePaymentVerification);
    } else {
      console.log("Payment failed");
    }

  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadCheckout,
  orderDetailsLoad,
  ordersLoad,
  downloadInvoice,
  codOrder,
  paymentGateway,
  pgOrder,
};

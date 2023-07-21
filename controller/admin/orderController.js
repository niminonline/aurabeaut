const Order = require("../../models/orderModel");
const Product = require("../../models/productModel");
const User = require("../../models/userModel");

// =============================================Orders Main Load==============================
const ordersLoad = async (req, res) => {
  try {
    const status= req.query.status||"";
    const search= req.query.search||"";
    const query={};
    if(status!==""){
      query.status=status;
    }
    if(search!==""){
      query.$or = [
          {invoiceNumber:{$regex:".*"+search+".*",$options:"i"}},
          {'address.name':{$regex:".*"+search+".*",$options:"i"}},
          {'address.mobile':{$regex:".*"+search+".*",$options:"i"}},
          {'status':{$regex:".*"+search+".*",$options:"i"}},
          {paymentMethod:{$regex:".*"+search+".*",$options:"i"}},
      ]
    }
    const orderData = await Order.find(query).sort({ _id: -1 });

    res.render("orders", { orderData: orderData });
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404");
  }
};

// =============================================Orders Details Load=============================
const orderDetailsLoad = async (req, res) => {
  try {
    const { _id } = req.query;
    const statusData = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Returned",
      "Return_Pending",
      "Return_Rejected"
    ];
    const orderData = await Order.findById({ _id });

    res.render("orderDetails", {
      orderData: orderData,
      statusData: statusData,
    });
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404");
  }
};

// =============================================Update order=============================
const updateOrder = async (req, res) => {
  try {
    const { _id, status } = req.body;
    console.log(req.body);
    const statusUpdate = await Order.findByIdAndUpdate(
      { _id: _id },
      { $set: { status: status } }
    );
    if (statusUpdate) {
      res.redirect("/admin/orders");
    } else {
      console.log("Updation failed");
    }
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404");
  }
};

//=============================== Return Request Load ==========================
const returnrequestLoad = async (req, res) => {
  try {
    const orderData = await Order.find({ status: "Return_Pending" });
    res.render("returnRequests", { orderData });
  } catch (error) {
    console.log(error.message);
    res.status(404).render("404");
  }
};

//=============================== Accept Return ==========================
const acceptReturn = async (req, res) => {
  try {
    const { _id } = req.query;
    const orderData = await Order.findById(_id);
    // console.log(order);

    const stockupdate = orderData.product.map(async (item) => {
      const updateStock = await Product.findByIdAndUpdate(item.id, {
        $inc: { stock: item.quantity },
      });
      // console.log(stockupdate);
    });
    if (orderData.paymentMethod !== "Cash on Delivery") {
      const userData = await User.findById(orderData.userId);
      userData.wallet.balance += orderData.totalAmount;
      console.log("wallet bal", userData.wallet.balance)
      const updateData = {
        amount: orderData.totalAmount,
        details: "Refund for returned order #" + orderData.invoiceNumber,
      };

      userData.wallet.transaction.push(updateData);
      await userData.save();
    }
    await Order.findByIdAndUpdate(_id, { $set: { status: "Returned" } });
    // res.json(200);

    res.redirect("/admin/return-requests");
  } catch (error) {
    console.log(error.message);
    res.status(404).render("404");
  }
};
//=============================== Reject Return ==========================
const rejectReturn = async (req, res) => {
  try {
    const { _id } = req.query;
    await Order.findByIdAndUpdate(_id,{$set:{status:"Return_Rejected"}});
    res.redirect("/admin/return-requests");
  } catch (error) {
    console.log(error.message);
    res.status(404).render("404");
  }
};

module.exports = {
  ordersLoad,
  orderDetailsLoad,
  updateOrder,
  returnrequestLoad,
  acceptReturn,
  rejectReturn,
};

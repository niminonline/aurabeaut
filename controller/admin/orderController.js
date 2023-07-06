const Order = require("../../models/orderModel");

// =============================================Orders Main Load==============================
const ordersLoad = async (req, res) => {
  try {
    const orderData = await Order.find({}).sort({_id:-1});

    res.render("orders", { orderData: orderData });
  } catch (err) {
    console.log(err.message);
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
    ];
    const orderData = await Order.findById({ _id });

    res.render("orderDetails", {
      orderData: orderData,
      statusData: statusData,
    });
  } catch (err) {
    console.log(err.message);
  }
};

// =============================================Update order=============================
const updateOrder = async (req, res) => {
  try {
    const { _id, status } = req.body;
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
  }
};

module.exports = { ordersLoad, orderDetailsLoad, updateOrder };

const Order = require("../../models/orderModel");

//===================================Get payment modes Chart ==========================

const getPaymentModes = async (req, res) => {
  try {
    const orderData = await Order.find({});
    // console.log(orderData);
    let codCount = 0,
      razorpayCount = 0,
      walletCount = 0;
    let paymentValues = [];
    orderData.map((item) => {
      if (item.paymentMethod == "Razorpay") razorpayCount++;
      else if (item.paymentMethod == "Wallet") walletCount++;
      else if (item.paymentMethod == "Cash on Delivery") codCount++;
    });
    // console.log({'Cash on delivery':codCount, "Razorpay": razorpayCount,"Wallet": walletCount})
    res.json({
      "Cash on delivery": codCount,
      Razorpay: razorpayCount,
      Wallet: walletCount,
    });
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404", { errorMessage: err.message });
  }
};

//===================================Daily Sales Chart ==========================

const dailySalesChart = async (req, res) => {
  try {
    // const options= {_id:{ "$date"},
    // totalPrice: { $sum: "$totalAmount" }}
    const orderData = await Order.aggregate([
        {
          $group: {
            _id: {
                $dateToString: { format: "%d-%m-%Y", date: "$date" }
            },
            totalPrice: { $sum: "$totalAmount" }
          }
        },
        {
            $sort: {
                _id: 1
            }
        },
      ]);

    // console.log(orderData);
    res.json(orderData);
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404", { errorMessage: err.message });
  }
};


//===================================Daily Order Chart ==========================

const dailyOrderChart = async (req, res) => {
    try {
      // const options= {_id:{ "$date"},
      // totalPrice: { $sum: "$totalAmount" }}
      const orderData = await Order.aggregate([
          {
            $group: {
              _id: {
                  $dateToString: { format: "%d-%m-%Y", date: "$date" }
              },
              count: { $sum: 1 }
            }
          },
          {
              $sort: {
                  _id: 1
              }
          },
        ]);
  
      // console.log(orderData);
      res.json(orderData);
    } catch (err) {
      console.log(err.message);
      res.status(404).render("404", { errorMessage: err.message });
    }
  };

module.exports = { getPaymentModes, dailySalesChart,dailyOrderChart};

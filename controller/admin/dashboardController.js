const Order = require("../../models/orderModel");
const { generateInvoicePDF } = require("../../helper/html-pdf");
const { createInvoiceHtml } = require("../../helper/salesReportFormat");
const path = require("path");
const fs = require("fs");
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
            $dateToString: { format: "%d-%m-%Y", date: "$date" },
          },
          totalPrice: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
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
            $dateToString: { format: "%d-%m-%Y", date: "$date" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.json(orderData);
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404", { errorMessage: err.message });
  }
};

// =========================Generate Sales Report=============
const generateSalesReportPDF = async (req, res) => {
  try {
    let { startDate, endDate } = req.body;

    startDate = startDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    endDateDate = endDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const orderData = await Order.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    // console.log(orderData);


  // =============================
  
 
  const invoiceHtml = createInvoiceHtml(orderData);

  const outputFilePath = path.join(__dirname, `SalesReport ${startDate} to ${endDate}.pdf`);
  await generateInvoicePDF(invoiceHtml, outputFilePath).then(res.status(200));

  res.download(outputFilePath,`SalesReport ${startDate} to ${endDate}.pdf`, (downloadError) => {
    if (downloadError) {
      console.error("Error downloading SalesReport PDF:", downloadError);
      res.status(500).send("Error downloading SalesReport PDF");
    }
    // fs.unlinkSync(outputFilePath);
  });
  
  
  
  
  
  // =============================

    // res.json(orderData);

  } catch (err) {
    console.log(err.message);
    res.status(404).render("404", { errorMessage: err.message });
  }
};




// =========================Download Sales Report=============
const downloadSalesReport = async (req, res) => {
  try {
   







  } catch (err) {
    console.log(err.message);
    res.status(404).render("404", { errorMessage: err.message });
  }
};


module.exports = {
  getPaymentModes,
  dailySalesChart,
  dailyOrderChart,
  generateSalesReportPDF,
  downloadSalesReport
};

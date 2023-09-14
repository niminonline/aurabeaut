const User = require("../../models/userModel");
const Order = require("../../models/orderModel");
const Product = require("../../models/productModel");
const { ObjectId } = require("mongodb");
// const { render } = require("../../routes/adminRoute");

//==================Load Admin Login Page==================
const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.error(err.message);
    res.status(404).render("404");
  }
};
//============================Admin login=======================
const adminLogin = async (req, res) => {
  try {
    if (
      req.body.email == process.env.adminEmail &&
      req.body.pass == process.env.adminPassword
    ) {
      req.session.admin_id = req.body.email;
      res.redirect("/admin/home");
    } else {
      res.render("login", { message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(404).render("404");
  }
};
//===============================Dashboard Load====================
const dashboardLoad = async (req, res) => {
  try {
    const orderData = await Order.find();
    // console.log(orderData);
    let totalRevenue = 0;
    orderData.map((item) => {
      if (item.status == "Delivered") {
        totalRevenue += item.totalAmount;
      }
    });

    const pcount = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    let PendingCount = 0;
    pcount.map((item) => {
      if (item._id == "Return_Pending") {
        PendingCount = item.count;
      }
    });

    const orderTd = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%d/%m/%Y", date: "$date" },
          },
          count: { $sum: 1 },
        },
      },
    ]);
    const today = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    let orderToday = 0;
    orderTd.map((item) => {
      if (item._id == today) {
        orderToday = item.count;
      }
    });

    const salesTd = await Order.aggregate([
      { $match: { status: "Delivered" } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%d/%m/%Y", date: "$date" },
          },
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);
    let salesToday = 0;
    salesTd.map((item) => {
      if (item._id == today) {
        salesToday = item.totalSales;
      }
    });

    res.render("home", { orderToday, PendingCount, salesToday, totalRevenue });
  } catch (err) {
    console.error(err.message);
    res.status(404).render("404");
  }
};

//===============================Users Load====================
const usersLoad = async (req, res) => {
  try {
    const userData = await User.find({});

    // let search='';
    // if(req.query.search){
    //     search= req.query.search;

    // }
    // const userData= await User.find({
    //     isAdmin:0,
    //     $or:[
    //         {name:{$regex:".*"+search+".*",$options:"i"}},
    //         {email:{$regex:".*"+search+".*",$options:"i"}},
    //         {mobile:{$regex:".*"+search+".*",$options:"i"}},
    //     ]
    // });
    res.render("users", { userData: userData });
  } catch (err) {
    console.error(err.message);
    res.status(404).render("404");
  }
};

//===============================Orders Load====================
const ordersLoad = async (req, res) => {
  try {
    res.render("products");
  } catch (err) {
    console.error(err.message);
    res.status(404).render("404");
  }
};
//=====================================Admin Logout================
const adminLogout = async (req, res) => {
  try {
    delete req.session.admin_id;
    // req.session.destroy();
    res.redirect("/admin/");
  } catch (err) {
    console.error(err.message);
    res.status(404).render("404");
  }
};

// =========================User Block/Unblock=============
const userBlockUnblock = async (req, res) => {
  try {
    const { id } = req.body;

    const userData = await User.findOne({ _id: id });
    // console.log(userData);
    if (userData.isBlocked == true) {
      await User.findByIdAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { isBlocked: false } }
      );
    } else {
      await User.findByIdAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { isBlocked: true } }
      )
        .then((response) => {
          delete req.session.user_id;

          // res.json(response);
        })
        .catch((err) => {
          console.error(err.message);
          res.status(404).render("404");
        });
    }
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err.message);
    res.status(404).render("404");
  }
};

// =========================Sales Load=============
const salesLoad = async (req, res) => {
  try {
    res.render("sales");
  } catch (err) {
    console.error(err.message);
    res.status(404).render("404");
  }
};

module.exports = {
  loginLoad,
  adminLogin,
  dashboardLoad,
  usersLoad,
  ordersLoad,
  adminLogout,
  userBlockUnblock,
  salesLoad,
};

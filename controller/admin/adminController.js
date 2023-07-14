const User = require("../../models/userModel");
const Order = require("../../models/orderModel");
const Product = require("../../models/productModel");
const { ObjectId } = require("mongodb");


//==================Load Admin Login Page==================
const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(err.message);
res.status(404).render("404",{errorMessage:err.message});
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
    console.log(err.message);
res.status(404).render("404",{errorMessage:err.message});
  }
};
//===============================Dashboard Load====================
const dashboardLoad = async (req, res) => {
  try {
    const orderData = await Order.find();
    // console.log(orderData);
    let totalRevenue=0;
    orderData.map(item=>{
      totalRevenue+=item.totalAmount;
    })

    
    const pcount = await Order.aggregate([{$group:{_id:"$status",count:{$sum:1}}}])
    let PendingCount=0;
    pcount.map(item=>{
      if(item._id=='Pending'){
        PendingCount= item.count;
      }
    })

    const orderTd = await Order.aggregate([{$group:{
      _id:{
        $dateToString: { format: "%d/%m/%Y", date: "$date" }
      },
      count:{$sum:1}}}])
    // console.log(orderTd, "----",)
    const today=  new Date().toLocaleString('en-IN',{ day: '2-digit', month: '2-digit', year: 'numeric' });
    let orderToday=0;
    orderTd.map(item=>{
      if(item._id==today){
        orderToday= item.count;
      }
    })
    // console.log("order2day",orderToday);


    const salesTd = await Order.aggregate([{$group:{
      _id:{
        $dateToString: { format: "%d/%m/%Y", date: "$date" }
      },
      totalSales:{$sum:"$totalAmount"}}}])
    // console.log(salesTd, "----",)
    // const today=  new Date().toLocaleString('en-IN',{ day: '2-digit', month: '2-digit', year: 'numeric' });
    // console.log(today)
    let salesToday=0;
    salesTd.map(item=>{
      if(item._id==today){
        salesToday= item.totalSales;
      }
    })

  



    res.render("home",{orderToday,PendingCount,salesToday,totalRevenue});
  } catch (err) {
    console.log(err.message);
res.status(404).render("404",{errorMessage:err.message});
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
    console.log(err.message);
res.status(404).render("404",{errorMessage:err.message});
  }
};

//===============================Orders Load====================
const ordersLoad = async (req, res) => {
  try {
    res.render("products");
  } catch (err) {
    console.log(err.message);
res.status(404).render("404",{errorMessage:err.message});
  }
};
//=====================================Admin Logout================
const adminLogout = async (req, res) => {
  try {
    delete req.session.admin_id;
    // req.session.destroy();
    res.redirect("/admin/");
  } catch (err) {
    console.log(err.message);
res.status(404).render("404",{errorMessage:err.message});
  }
};

// =========================User Block/Unblock=============
const userBlockUnblock = async (req, res) => {
  try {
    const {id} = req.body;
    
    const userData= await User.findOne({_id:id});
    // console.log(userData);
    if(userData.isBlocked == true){
      await User.findByIdAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { isBlocked: false } }
      )
      

    }
    else {
      await User.findByIdAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { isBlocked: true } }
      ) 
      .then((response) => {
        
          delete req.session.user_id ;
        
        // res.json(response);
        
      })
      .catch((err) => {
        console.log(err.message);
res.status(404).render("404",{errorMessage:err.message});
      });

    }
    res.redirect("/admin/users");
    // User.findByIdAndUpdate(
    //   { _id: new ObjectId(id) },
    //   { $set: { isBlocked: true ? false : true } }
    // )


    // User.findByIdAndUpdate(
    //   { _id: new ObjectId(id) },
    //   { $set: { isBlocked: type === "block" ? true : false } }
    // )
      // .then((response) => {
      //   if (type === "block") {
      //     req.session.user_id = false;
      //   }
      //   // res.json(response);
      //   res.redirect("/admin/users");
      // })
      // .catch((err) => {
      //   console.log(err.message);
res.status(404).render("404",{errorMessage:err.message});
      // });
  } catch (err) {
    console.log(err.message);
res.status(404).render("404",{errorMessage:err.message});
  }
};




// =========================Generate Sales Report=============
const generateSalesReport = async (req, res) => {
  try {
        
    let {startDate,endDate}= req.body;
    console.log("datee----",startDate, endDate);

    startDate=  startDate.toLocaleString('en-IN',{ day: '2-digit', month: '2-digit', year: 'numeric' });
    endDateDate=  endDate.toLocaleString('en-IN',{ day: '2-digit', month: '2-digit', year: 'numeric' });




    const orderData = await Order.aggregate([{$group:{
      _id:{
        $dateToString: { format: "%d/%m/%Y", date: "$date" }
      },
      totalSales:{$sum:"$totalAmount"}}}])
  
    let salesToday=0;
    salesTd.map(item=>{
      if(item._id==today){
        salesToday= item.totalSales;
      }
    })













      
  } catch (err) {
    console.log(err.message);
res.status(404).render("404",{errorMessage:err.message});
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
  generateSalesReport
};

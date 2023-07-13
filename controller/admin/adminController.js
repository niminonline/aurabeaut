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

    res.render("home");
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

module.exports = {
  loginLoad,
  adminLogin,
  dashboardLoad,
  usersLoad,
  ordersLoad,
  adminLogout,
  userBlockUnblock,
};

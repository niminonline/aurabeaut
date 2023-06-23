const { ObjectId } = require("mongodb");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");



//==================Load Admin Login Page==================
const loginLoad = async(req,res)=>{
  try{
      res.render("login");

  }
  catch(err){
      console.log(err.message);
  }
}
//============================Admin login=======================
const adminLogin = async(req,res)=>{
  try{
     
      if((req.body.email==process.env.adminEmail)&&(req.body.pass==process.env.adminPassword)){
          req.session.admin_id= req.body.email;
      res.redirect("/admin/home");
      }
  
      else{
      res.render("login",{message:"Invalid credentials"});
      }

  }
  catch(err){
      console.log(err.message);
  }
}
//===============================Dashboard Load====================
const dashboardLoad = async(req,res)=>{
  try{
      
      res.render("home");

  }
  catch(err){
      console.log(err.message);
  }
}

//===============================Users Load====================
const usersLoad = async(req,res)=>{
  try{

     const userData= await User.find({});
     console.log(userData);
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
          res.render("users",{userData:userData});
          
      }
  catch(err){
      console.log(err.message);
  }
}

//===============================Orders Load====================
const ordersLoad = async(req,res)=>{
  try{
      res.render("products");

  }
  catch(err){
      console.log(err.message);
  }
}



module.exports = {
 
};

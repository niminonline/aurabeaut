const express = require("express");
const userRoute= express();
const bodyParser= require("body-parser")
const path= require("path");


userRoute.use(express.static("public"));
userRoute.set("view engine","ejs");
userRoute.set("views","views/user/");

userRoute.use(bodyParser.urlencoded({extended:true}))

// const userController = require("../controllers/userController");
const { model } = require("mongoose");
// const session = require("express-session");
// userRoute.use(session({secret:config.sessionSecret,resave:false,saveUninitialized:false}));
// const auth= require("../middleware/auth");
// const validator = require("../middleware/validator")
// const {noCache} = require("../middleware/routingMW")


//========================User Route=============================

userRoute.get("/",(req,res)=>{ 
    res.render("home")})
userRoute.get("/allproducts",(req,res)=>{
    res.render("allProducts")
})

userRoute.get("/product",(req,res)=>{
    res.render("product")
})
userRoute.get("/login",(req,res)=>{
    res.render("login")
})
userRoute.get("/signup",(req,res)=>{
    res.render("signup")
})
userRoute.get("/forgetpassword",(req,res)=>{
    res.render("forgetPassword")
})
userRoute.get("/verifyotp",(req,res)=>{
    res.render("verifyotp")
})
userRoute.get("/resetpassword",(req,res)=>{
    res.render("resetPassword")
})
userRoute.get("/passwordresetotp",(req,res)=>{
    res.render("passwordResetOtp")
})

module.exports= userRoute;



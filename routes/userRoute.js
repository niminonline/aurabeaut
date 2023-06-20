const express = require("express");
const userRoute= express();
const bodyParser= require("body-parser")
const path= require("path");
const config= require("../config/config");

userRoute.use(express.static("public"));
userRoute.set("view engine","ejs");
userRoute.set("views","views/user/");

userRoute.use(bodyParser.urlencoded({extended:true}))
const userController = require("../controller/user/userController");

// const userController = require("../controllers/userController");
const { model } = require("mongoose");
const session = require("express-session");
userRoute.use(session({secret:config.sessionSecret,resave:false,saveUninitialized:false}));
// const auth= require("../middleware/auth");
// const validator = require("../middleware/validator")
// const {noCache} = require("../middleware/routingMW")



//========================User Route=============================
userRoute.get('/', userController.loadHome);
userRoute.get('/home', userController.loadHome);
userRoute.get('/signup', userController.loadSignUp);
userRoute.post('/signup',userController.storeSignUpDetails);
userRoute.get("/login",userController.loginLoad);
userRoute.post("/login", userController.verifyLogin);
userRoute.get("/forgetpassword",userController.forgetPasswordLoad)
userRoute.post("/forgetpassword",userController.sendOTP)
userRoute.get("/verifyotp",userController.verifyOTPLoad)
userRoute.post("/verifyotp",userController.submitOTP)
userRoute.get("/resetpassword",userController.resetPasswordLoad)
userRoute.post("/resetpassword",userController.resetPassword)
userRoute.get("/verifyemailotp",userController.loadEmailOtp)
userRoute.post("/verifyemailotp",userController.insertUser)

// userRoute.get("/",auth.isLogin,noCache,userController.loginLoad);
userRoute.get("/home", userController.loadHome);
// userRoute.get("/logout",auth.isLogout, userController.userLogout);
// userRoute.get("/edit",auth.isLogout, userController.editProfile);
// userRoute.post("/edit",upload.single("image"), userController.update);
// userRoute.get("/changepassword",auth.isLogout, userController.loadChangePassword);
// userRoute.post("/changepassword",userController.changePassword);

//===================Shop Routes================
userRoute.get('/allproducts', userController.loadAllProducts);
userRoute.get('/product', userController.loadProduct);





module.exports= userRoute;



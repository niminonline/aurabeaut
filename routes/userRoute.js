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
const pageLoadController= require("../controller/user/pageLoadController")

// const userController = require("../controllers/userController");
const { model } = require("mongoose");
const session = require("express-session");
userRoute.use(session({secret:config.sessionSecret,resave:false,saveUninitialized:false}));
// const auth= require("../middleware/auth");
// const validator = require("../middleware/validator")
// const {noCache} = require("../middleware/routingMW")



//========================User Route=============================
userRoute.get('/', pageLoadController.loadHome);
userRoute.get('/home', pageLoadController.loadHome);
userRoute.get('/signup', pageLoadController.loadSignUp);
userRoute.get("/login",pageLoadController.loginLoad);
userRoute.get("/forgetpassword",pageLoadController.forgetPasswordLoad)
userRoute.get("/verifyResetPassOtp",pageLoadController.verifyRPOtpLoad)
userRoute.get("/resetpassword",pageLoadController.resetPasswordLoad)
userRoute.get("/verifySignUpOtp",pageLoadController.loadSignUpOtp)
userRoute.get('/allproducts', pageLoadController.loadAllProducts);
userRoute.get('/product', pageLoadController.loadProduct);



userRoute.post('/signup',userController.storeSignUpDetails);
userRoute.post("/login", userController.verifyLogin);
userRoute.post("/forgetpassword",userController.sendOTP)
userRoute.post("/verifyResetPassOtp",userController.submitOTP)
userRoute.post("/resetpassword",userController.resetPassword)
userRoute.post("/verifySignUpOtp",userController.insertUser)

// userRoute.get("/",auth.isLogin,noCache,userController.loginLoad);
// userRoute.get("/home", userController.loadHome);
// userRoute.get("/logout",auth.isLogout, userController.userLogout);
// userRoute.get("/edit",auth.isLogout, userController.editProfile);
// userRoute.post("/edit",upload.single("image"), userController.update);
// userRoute.get("/changepassword",auth.isLogout, userController.loadChangePassword);
// userRoute.post("/changepassword",userController.changePassword);

//===================Shop Routes================






module.exports= userRoute;



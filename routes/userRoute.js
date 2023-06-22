// ==============================Import====================================
const express = require("express");
const userRoute = express();
const bodyParser = require("body-parser");
const path = require("path");
const { model } = require("mongoose");
const session = require("express-session");

userRoute.use(
  session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);
userRoute.use(express.static("public"));
userRoute.use(bodyParser.urlencoded({ extended: true }));

// ========================View Engine================
userRoute.set("view engine", "ejs");
userRoute.set("views", "views/user/");

// =========================Controllers======================
const userController = require("../controller/user/userController");
const pageLoadController = require("../controller/user/pageLoadController");
const userShopContrller = require("../controller/user/userShopController");

//==========================Middlewares==============================
const { noCache } = require("../middleware/routingMW");
const userAuth = require("../middleware/userAuth");

//========================User Route=============================
userRoute.get("/", noCache, pageLoadController.loadHome);
userRoute.get("/home", noCache, pageLoadController.loadHome);
userRoute.get("/signup", pageLoadController.loadSignUp);
userRoute.get("/login", noCache, pageLoadController.loginLoad);
userRoute.get("/forgetpassword", pageLoadController.forgetPasswordLoad);
userRoute.get("/verifyResetPassOtp", pageLoadController.verifyRPOtpLoad);
userRoute.get("/resetpassword", pageLoadController.resetPasswordLoad);
userRoute.get("/verifySignUpOtp", pageLoadController.loadSignUpOtp);
userRoute.get("/allproducts", pageLoadController.loadAllProducts);
userRoute.get("/product", pageLoadController.loadProduct);
userRoute.get("/logout", userController.logout);

userRoute.post("/signup", userController.storeSignUpDetails);
userRoute.post("/login", userController.verifyLogin);
userRoute.post("/forgetpassword", userController.sendOTP);
userRoute.post("/verifyResetPassOtp", userController.submitOTP);
userRoute.post("/resetpassword", userController.resetPassword);
userRoute.post("/verifySignUpOtp", userController.insertUser);


//===================Shop Routes================
// userRoute.get("/allProducts", userController.getCategory);



module.exports = userRoute;

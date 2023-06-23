// ==============================Import====================================
const express = require("express");
const userRoute = express();
// const bodyParser = require("body-parser");
// userRoute.use(bodyParser.urlencoded({ extended: true }));



// //============================Set
// userRoute.use(express.static("public"));

// ========================View Engine Directory================
userRoute.set("views", "views/user/");

// =========================Controllers======================
const userController = require("../controller/user/userController");
const productController = require("../controller/user/productController");
const orderController = require("../controller/user/orderController");

//==========================Middlewares======================================
const { isUserLogin, isUserLogout } = require("../middleware/auth");
const upload = require("../middleware/multer");
const { noCache } = require("../middleware/routingMW");

//========================Get Routes=============================
userRoute.get("/", noCache, userController.loadHome);
userRoute.get("/home", noCache, userController.loadHome);
userRoute.get("/signup", userController.loadSignUp);
userRoute.get("/login", noCache,isUserLogin,  userController.loginLoad);
userRoute.get("/forgetpassword", isUserLogin,userController.forgetPasswordLoad);
userRoute.get("/verifyResetPassOtp",isUserLogin, userController.verifyRPOtpLoad);
userRoute.get("/resetpassword", isUserLogin,userController.resetPasswordLoad);
userRoute.get("/verifySignUpOtp",isUserLogin,userController.loadSignUpOtp);
userRoute.get("/allproducts", productController.loadAllProducts);
userRoute.get("/product", productController.loadProduct);
userRoute.get("/logout", userController.logout);


// ============================Post Routes====================
userRoute.post("/signup", userController.storeSignUpDetails);
userRoute.post("/login", userController.verifyLogin);
userRoute.post("/forgetpassword", userController.sendOTP);
userRoute.post("/verifyResetPassOtp", userController.submitOTP);
userRoute.post("/resetpassword", userController.resetPassword);
userRoute.post("/verifySignUpOtp", userController.insertUser);



module.exports = userRoute;

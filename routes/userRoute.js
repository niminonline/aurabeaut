// ==============================Import====================================
const express = require("express");
const userRoute = express();
// const bodyParser = require("body-parser");
// userRoute.use(bodyParser.urlencoded({ extended: true }));



// //============================Set public directory=============
// userRoute.use(express.static("public"));

// ========================View Engine Directory================
userRoute.set("views", "views/user/");

// =========================Controllers======================
const userController = require("../controller/user/userController");
const productController = require("../controller/user/productController");
const orderController = require("../controller/user/orderController");
const couponController = require("../controller/user/couponController");

//==========================Middlewares======================================
const { isUserLogin, isUserLogout,isUserSession } = require("../middleware/auth");
const upload = require("../middleware/multer");
const { noCache } = require("../middleware/routingMW");
const { stockCheck } = require("../middleware/stockCheck");

//========================Get Routes=============================
userRoute.get("/", noCache, userController.loadHome);
userRoute.get("/home", noCache, userController.loadHome);
userRoute.get("/signup", userController.loadSignUp);
userRoute.get("/login", noCache,isUserLogin,  userController.loginLoad);
userRoute.get("/forgetpassword", isUserLogin,userController.forgetPasswordLoad);
userRoute.get("/verifyResetPassOtp",isUserLogin, userController.verifyRPOtpLoad);
userRoute.get("/resetpassword", isUserLogin,userController.resetPasswordLoad);
userRoute.get("/verifySignUpOtp",isUserLogin,userController.loadSignUpOtp);
userRoute.get("/all-products", productController.loadAllProducts);
userRoute.get("/product", productController.loadProduct);
userRoute.get("/logout", userController.logout);
userRoute.get("/cart", isUserSession,userController.loadCart);
userRoute.get("/wishlist",isUserSession, userController.loadWishlist);
userRoute.get("/checkout",isUserSession, orderController.loadCheckout);
userRoute.get("/user-dashboard",isUserSession, userController.loadUserDashboard);
userRoute.get("/add-to-cart",isUserSession, userController.addToCart);
userRoute.get("/add-to-wishlist",isUserSession, userController.addToWishlist);
userRoute.get("/remove-wishlist-item",isUserSession, userController.removeWishlistItem);
userRoute.get("/add-address",isUserSession, userController.addAddressLoad);
userRoute.get("/orders",isUserSession, orderController.ordersLoad);
userRoute.get("/order-details",isUserSession, orderController.orderDetailsLoad);
userRoute.get("/remove-cart-item",isUserSession, userController.removeCartItem);
userRoute.get("/download-invoice",isUserSession, orderController.downloadInvoice);
userRoute.get("/order-failure",isUserSession, orderController.orderFailure);
userRoute.get("/order-success",isUserSession, orderController.orderSuccess);
userRoute.get("/delete-address",isUserSession, userController.deleteAddress);
userRoute.get("/return-order",isUserSession, orderController.returnOrder);
userRoute.get("/cancel-order",isUserSession, orderController.cancelOrder);
userRoute.get("/404", userController.pageNotFound);



// ============================Post Routes====================
userRoute.post("/signup", userController.storeSignUpDetails);
userRoute.post("/login", userController.verifyLogin);
userRoute.post("/forgetpassword", userController.sendOTP);
userRoute.post("/verifyResetPassOtp", userController.submitOTP);
userRoute.post("/resetpassword", userController.resetPassword);
userRoute.post("/verifySignUpOtp", userController.insertUser);
userRoute.post("/add-address",isUserSession, userController.addAddress);
userRoute.post("/update-address",isUserSession, userController.updateAddress);
userRoute.post("/quantity-update",isUserSession, userController.quantityUpdate);
userRoute.post("/place-order",isUserSession, orderController.placeOrder);
userRoute.post("/payment-gateway",isUserSession,stockCheck, orderController.paymentGateway);
userRoute.post("/pg-order",isUserSession,stockCheck, orderController.pgOrder);
userRoute.post("/apply-coupon", couponController.applyCoupon);
userRoute.post("/wallet-balance-check", orderController.walletBalanceCheck);
userRoute.post("/add-review", productController.addReview);



module.exports = userRoute;

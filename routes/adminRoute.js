const express = require("express");
const adminRoute = express();





// const bodyParser = require("body-parser");
// adminRoute.use(bodyParser.urlencoded({ extended: true }));
// adminRoute.use(express.static("public"));

// ==============================Controllers===================================
const admincontroller = require("../controller/admin/adminController");
const carouselController = require("../controller/admin/carouselController");
const categoryController = require("../controller/admin/categoryController");
const couponController = require("../controller/admin/couponController");
const dashboardController = require("../controller/admin/dashboardController");
const offerController = require("../controller/admin/offerController");
const orderController = require("../controller/admin/orderController");
const productController = require("../controller/admin/productController");

//==========================Middlewares======================================
const { isAdminLogin, isAdminLogout } = require("../middleware/auth");
const upload = require("../middleware/multer");
const path = require("path");
const { noCache } = require("../middleware/routingMW");

//===============================Set View Engine directory========================
adminRoute.set("views", "views/admin/");

//======================= Get Routes====================================================

adminRoute.get("/", isAdminLogin, noCache, admincontroller.loginLoad);
adminRoute.get("/login",isAdminLogin, noCache, admincontroller.loginLoad);
adminRoute.get("/home",isAdminLogout,noCache,admincontroller.dashboardLoad);
adminRoute.get("/users", isAdminLogout, admincontroller.usersLoad);
adminRoute.get("/orders", isAdminLogout, orderController.ordersLoad);
adminRoute.get("/category",isAdminLogout,categoryController.categoryLoad);
adminRoute.get("/products",isAdminLogout,productController.productsLoad);
adminRoute.get("/carousel",isAdminLogout,carouselController.carouselLoad);
adminRoute.get("/editproduct",isAdminLogout,productController.editProductLoad);
adminRoute.get("/addproduct",isAdminLogout,productController.addProductLoad);
adminRoute.get("/editcategory",isAdminLogout,categoryController.editCategoryLoad);
adminRoute.get("/editcarousel",isAdminLogout,carouselController.editCarouselLoad);
adminRoute.get("/delete-product-image", isAdminLogout,productController.deleteProductImage);
adminRoute.get("/order-details",isAdminLogout, orderController.orderDetailsLoad);
adminRoute.get("/set-product-main-image",isAdminLogout, productController.setProductMainImage);
adminRoute.get("/coupons", isAdminLogout, couponController.couponsLoad);
adminRoute.get("/delete-coupon", isAdminLogout, couponController.deleteCoupon);


// =================== Admin Log in/log out=========================================
adminRoute.post("/login", admincontroller.adminLogin);
adminRoute.get("/logout",admincontroller.adminLogout );

// ================================Post Routes===================================
adminRoute.post("/category",upload.single("image"),categoryController.addCategory);
adminRoute.post("/editcategory",upload.single("image"),categoryController.editCategory);
adminRoute.post("/addproduct", upload.array("image", 3),productController.addProduct);
adminRoute.post("/editproduct",upload.array("image", 3),productController.editProduct);
adminRoute.post("/blockunblockuser", admincontroller.userBlockUnblock);
adminRoute.post("/listunlistcategory", categoryController.listUnlistCategory);
adminRoute.post("/productlistunlist", productController.productListUnlist);
// adminRoute.get("/deleteproduct", shopController.deleteproduct);
adminRoute.post("/order-details", orderController.updateOrder);
adminRoute.post("/coupons", couponController.createCoupon);
adminRoute.post("/coupon-actions", couponController.couponActions);



module.exports = adminRoute;

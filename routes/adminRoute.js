const express = require("express");
const adminRoute = express();
const session = require("express-session");
// const bodyParser = require("body-parser");
// adminRoute.use(bodyParser.urlencoded({ extended: true }));
adminRoute.use(
  session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);
// adminRoute.use(express.static("public"));

// ==============================Controllers===================================
const admincontroller = require("../controller/adminController");
const carouselController = require("../controller/carouselController");
const categoryController = require("../controller/categoryController");
const couponController = require("../controller/couponController");
const offerController = require("../controller/offerController");
const oderController = require("../controller/orderController");
const productController = require("../controller/productController");
const userController = require("../controller/userController");

//==========================Middlewares======================================
const {isAdminLogin,isAdminLogout} = require("../middleware/auth");
const upload = require("../middleware/multer");
const path = require("path");
const { noCache } = require("../middleware/routingMW");

//===============================Set View Engine directory========================
adminRoute.set("views", "views/admin/");

//=======================Routing====================================================


adminRoute.get("/", isAdminLogin, noCache, admincontroller.adminLoginLoad);
adminRoute.get("/login",adminAuth.isLogin,noCache,admincontroller.adminLoginLoad);
adminRoute.get("/home",adminAuth.isLogout,noCache,admincontroller.dashboardLoad);
adminRoute.get("/users", isAdminLogout, admincontroller.adminUsersLoad);
adminRoute.get("/orders", isAdminLogout, oderController.adminOrderLoad);
adminRoute.get(
  "/category",
  adminAuth.isLogout,
  pageLoadController.categoryLoad
);
adminRoute.get(
  "/products",
  adminAuth.isLogout,
  pageLoadController.productsLoad
);
adminRoute.get(
  "/carousel",
  adminAuth.isLogout,
  pageLoadController.carouselLoad
);
adminRoute.get("/coupons", adminAuth.isLogout, pageLoadController.couponsLoad);
adminRoute.get("/wallets", adminAuth.isLogout, pageLoadController.walletsLoad);
adminRoute.get(
  "/editproduct",
  adminAuth.isLogout,
  pageLoadController.editProductLoad
);
adminRoute.get(
  "/addProduct",
  adminAuth.isLogout,
  pageLoadController.addProductLoad
);
adminRoute.get(
  "/editcategory",
  adminAuth.isLogout,
  pageLoadController.editCategoryLoad
);
adminRoute.get(
  "/editcarousel",
  adminAuth.isLogout,
  pageLoadController.editCarouselLoad
);

// ===================Log in/log out=========================================
adminRoute.post("/login", pageLoadController.adminLogin);
adminRoute.get("/logout", admincontroller.adminLogout);

// ================================Post Routes===================================
adminRoute.post(
  "/category",
  upload.single("image"),
  shopController.addCategory
);

adminRoute.post(
  "/editcategory",
  upload.single("image"),
  shopController.editCategory
);
adminRoute.post(
  "/addproduct",
  upload.array("image", 3),
  shopController.addProduct
);
adminRoute.post(
  "/editproduct",
  upload.array("image", 3),
  shopController.editProduct
);
adminRoute.post("/blockUnblockUser", userController.userBlockUnblock);
adminRoute.post("/listunlistcategory", shopController.listUnlistCategory);
adminRoute.post("/productListUnlist", shopController.productListUnlist);
adminRoute.get("/deleteproduct", shopController.deleteproduct);

// adminRoute.post("/addProduct", shopController.addProduct)

module.exports = adminRoute;

const express = require("express");
const adminRoute = express();
const session = require("express-session");
const bodyParser = require("body-parser");
adminRoute.use(bodyParser.urlencoded({ extended: true }));
adminRoute.use(
  session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);
adminRoute.use(express.static("public"));

// ==============================Controllers===================================
const pageLoadController = require("../controller/admin/pageLoadController");
const shopController = require("../controller/admin/shopController");
const userController = require("../controller/admin/userController");
const admincontroller = require("../controller/admin/adminController");

//==========================Middlewares======================================
const adminAuth = require("../middleware/adminAuth");
const upload = require("../middleware/multer");
const path = require("path");
const { noCache } = require("../middleware/routingMW");

// ======================View Engine=================
adminRoute.set("view engine", "ejs");
adminRoute.set("views", "views/admin/");

//=======================Routing====================================================

//=============================Page Loads==========================
adminRoute.get("/", adminAuth.isLogin, noCache, pageLoadController.loginLoad);
adminRoute.get(
  "/login",
  adminAuth.isLogin,
  noCache,
  pageLoadController.loginLoad
);
adminRoute.get(
  "/home",
  adminAuth.isLogout,
  noCache,
  pageLoadController.dashboardLoad
);
adminRoute.get("/users", adminAuth.isLogout, pageLoadController.usersLoad);
adminRoute.get("/orders", adminAuth.isLogout, pageLoadController.ordersLoad);
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
adminRoute.post("/listunlistcategory", shopController.listUnlistCategory)

// adminRoute.post("/addProduct", shopController.addProduct)

module.exports = adminRoute;

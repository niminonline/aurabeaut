const express = require('express');
const adminRoute= express();
const session =require("express-session");
const config= require("../config/config");
const bodyParser=require("body-parser")
const pageLoadController= require("../controller/admin/pageLoadController")
// const auth= require("../middleware/auth");
// const {body,validationResult}= require("express-validator");
const path= require("path");    
// const validator= require("../middleware/validator")
// const {noCache} = require("../middleware/routingMW")



adminRoute.use(express.static("public"));
adminRoute.set("view engine","ejs");
adminRoute.set("views","views/admin/");


adminRoute.use(bodyParser.urlencoded({extended:true}));
adminRoute.use(session({secret:config.sessionSecret,resave:false,saveUninitialized:false}));



//=======================Routing====================================================

//=============================Page Loads==========================
adminRoute.get("/", pageLoadController.loginLoad)
adminRoute.get("/login", pageLoadController.loginLoad)
adminRoute.post("/login",pageLoadController.adminLogin)
adminRoute.get("/home", pageLoadController.dashboardLoad)
adminRoute.get("/users", pageLoadController.usersLoad)
adminRoute.get("/orders", pageLoadController.ordersLoad)
adminRoute.get("/category", pageLoadController.categoryLoad)
adminRoute.get("/products", pageLoadController.productsLoad)
adminRoute.get("/carousel", pageLoadController.carouselLoad)
adminRoute.get("/coupons", pageLoadController.couponsLoad)
adminRoute.get("/wallets", pageLoadController.walletsLoad)
adminRoute.get("/editproduct", pageLoadController.editProduct)
adminRoute.get("/addProduct", pageLoadController.addProduct)
adminRoute.get("/editcategory", pageLoadController.editCategoryLoad)
adminRoute.get("/editcarousel", pageLoadController.editCarouselLoad)
// adminRoute.get("/logout",pageLoadController.logout)


   
module.exports= adminRoute;


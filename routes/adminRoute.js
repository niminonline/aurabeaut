const express = require('express');
const adminRoute= express();
// const session =require("express-session");
// const config= require("../config/config");
const bodyParser=require("body-parser")
// const adminController= require("../controllers/adminController")
// const auth= require("../middleware/auth");
// const {body,validationResult}= require("express-validator");
const path= require("path");    
// const validator= require("../middleware/validator")
// const {noCache} = require("../middleware/routingMW")



adminRoute.use(express.static("public"));
adminRoute.set("view engine","ejs");
adminRoute.set("views","views/admin/");


adminRoute.use(bodyParser.urlencoded({extended:true}));
// adminRoute.use(session({secret:config.sessionSecret,resave:false,saveUninitialized:false}));




//=======================Routing====================================================

adminRoute.get("/",(req,res)=>{ 
    res.render("home")})
    adminRoute.get("/login",(req,res)=>{ 
        res.render("login")})


module.exports= adminRoute;


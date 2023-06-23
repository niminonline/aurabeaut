
const User= require("../../models/userModel");
const Category= require("../../models/categoryModel");
const Product= require("../../models/productModel");
const bcrypt= require("bcrypt");
const fs= require("fs");


//===============================Coupons Load====================
const couponsLoad = async(req,res)=>{
    try{
        res.render("products");

    }
    catch(err){
        console.log(err.message);
    }
}



module.exports={couponsLoad}
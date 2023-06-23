const User= require("../../models/userModel");
const Category= require("../../models/categoryModel");
const Product= require("../../models/productModel");
const bcrypt= require("bcrypt");
const fs= require("fs");




//===============================Carousel Load====================
const carouselLoad = async(req,res)=>{
    try{
        res.render("carousel");

    }
    catch(err){
        console.log(err.message);
    }
}


//===================================Edit Carousel Load==========================

const editCarouselLoad = async(req,res)=>{
    try{
        res.render("editCarousel");

    }
    catch(err){
        console.log(err.message);
    }
}


module.exports={carouselLoad,editCarouselLoad}
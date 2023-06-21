const User= require("../../models/userModel");
const Category= require("../../models/categoryModel");
const Product= require("../../models/productModel");
const bcrypt= require("bcrypt");
const fs= require("fs");



//==================Load Admin Login Page==================
const loginLoad = async(req,res)=>{
    try{
        res.render("login");

    }
    catch(err){
        console.log(err.message);
    }
}
//============================Admin login=======================
const adminLogin = async(req,res)=>{
    try{
        
        res.redirect("/admin/home");
        // res.render("temp");

    }
    catch(err){
        console.log(err.message);
    }
}
//===============================Dashboard Load====================
const dashboardLoad = async(req,res)=>{
    try{
        res.render("home");

    }
    catch(err){
        console.log(err.message);
    }
}

//===============================Users Load====================
const usersLoad = async(req,res)=>{
    try{

       const userData= await User.find({});
       console.log(userData);
            // let search='';
            // if(req.query.search){
            //     search= req.query.search;
    
            // }
            // const userData= await User.find({
            //     isAdmin:0,
            //     $or:[
            //         {name:{$regex:".*"+search+".*",$options:"i"}},
            //         {email:{$regex:".*"+search+".*",$options:"i"}},
            //         {mobile:{$regex:".*"+search+".*",$options:"i"}},
            //     ]
            // });
            res.render("users",{userData:userData});
            
        }
    catch(err){
        console.log(err.message);
    }
}

//===============================Orders Load====================
const ordersLoad = async(req,res)=>{
    try{
        res.render("products");

    }
    catch(err){
        console.log(err.message);
    }
}



//===============================Category Load====================
const categoryLoad = async(req,res)=>{
    try{

        const categoryData= await Category.find();
        if (categoryData){
            res.render("category",{categoryData:categoryData})
        }
        else
        res.render("category",{errorMessage:"No categories found"})
        
        

    }
    catch(err){
        console.log(err.message);
    }
}

//===============================Carousel Load====================
const carouselLoad = async(req,res)=>{
    try{
        res.render("carousel");

    }
    catch(err){
        console.log(err.message);
    }
}

//===============================Products Load====================
const productsLoad = async(req,res)=>{
    try{
        const productData= await Product.find({});
        console.log(productData);
       
        res.render("products",{productData:productData});

    }
    catch(err){
        console.log(err.message);
    }
}

//===============================Wallets Load====================
const walletsLoad = async(req,res)=>{
    try{
        res.render("products");

    }
    catch(err){
        console.log(err.message);
    }
}
//===============================Coupons Load====================
const couponsLoad = async(req,res)=>{
    try{
        res.render("products");

    }
    catch(err){
        console.log(err.message);
    }
}
//===================================Edit Product Load==========================

const editProductLoad = async(req,res)=>{
    try{
        res.render("editProduct");

    }
    catch(err){
        console.log(err.message);
    }
}
//===================================Add Product Load==========================

const addProductLoad = async(req,res)=>{
    try{
        const categoryData= await Category.find();
        const categories= categoryData.map((item)=>item.category);
        console.log(categories);
        
        res.render("addProduct",{categories:categories});

    }
    catch(err){
        console.log(err.message);
    }
}

//===================================Edit Category Load==========================

const editCategoryLoad = async(req,res)=>{
    try{
        const id= req.query._id;
        const categoryData= await Category.findById({_id:id});
        if(categoryData){
            res.render("editCategory",{categoryData:categoryData})
        }
        else
        {
            res.render("editCategory",{errorMessage:"Category no longer exist"})
        }
        res.render("editCategory");

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



module.exports={ loginLoad,adminLogin,dashboardLoad,usersLoad,categoryLoad,productsLoad,
                carouselLoad,couponsLoad,walletsLoad,ordersLoad,editProductLoad,addProductLoad,
                editCategoryLoad,editCarouselLoad}

const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");
const bcrypt= require("bcrypt");

//=================Load Login Page================================
const loginLoad= async (req,res)=>{

    try{
        
        res.render("login");

    }
    catch(err){
        console.log(err.message);
    }
}

//================ Load ForgetPassword Page=========================

const forgetPasswordLoad=(req,res)=>{
    try{
        res.render("forgetPassword")
    }
    catch(err){
        console.log(err.message);
    }
}
//==============Load Send OTP Page==================

const verifyRPOtpLoad=(req,res)=>{
    try{
        res.render("verifyResetPassOtp")
    }
    catch(err){
        console.log(err.message);
    }
}

//==============Load Reset Password Page==================

const resetPasswordLoad=(req,res)=>{
    try{
        res.render("resetPassword")
    }
    catch(err){
        console.log(err.message);
    }
}


//=====================Load User Home Page===================

const loadHome= async (req,res)=>{
    try{

        // const productData = await Product.aggregate([
        //     {
        //         $lookup: {
        //           from: "categories",
        //           localField: "category",
        //           foreignField: "_id",
        //           as: "categoryDetails",
        //         },
        //       },
        //       {
        //         $unwind: "$categoryDetails",
        //       },
        //   ]);
        const categoryData = await Category.find({isUnList:false});

        if(req.session.user_id){
       
        const userData= await User.findOne({_id: req.session.user_id});

        res.render("home",{userData:userData,categoryData:categoryData});
        }
        else
        {
            res.render("home",{categoryData:categoryData});
        }
    }
    catch(err){
        console.log(err.message);
    }
   
}


//=====================Signup page Load=======================
const loadSignUp =(req,res)=>{
    try{
        res.render("signup",{message:""});
    }
    catch(error){
        console.log(error.message)
    }
}

// ==============================Load email OTP====================
const loadSignUpOtp =(req,res)=>{
    try{
        res.render("verifySignUpOtp");
    }
    catch(error){
        console.log(error.message)
    }
}
    //===============================Load All Products==================================

    const loadAllProducts = async(req,res)=>{

        try{
            const categoryId= req.query._id;
            const productData = await Product.find({
                category: categoryId,
                isProductUnlist: false,
                isCategoryUnlist: false
              });
                          res.render("allProducts",{productData:productData});


        }
        catch(error){
            console.log(error.message)
        }
    }

    //===============================Load Single Product Page==================================
    
    const loadProduct = async(req,res)=>{
        try{
            const id= req.query._id;
            
            const productData= await Product.findById(id);
            res.render("product",{productData:productData})

            // console.log(productData);
            // if (productData){
            //     res.render("product",{productData:productData});
            // }
            // else
            // {
            //     res.render("product",{Errormessage:"Product not found",productData:undefined});
            // }
            
        }
        catch(error){
            console.log(error.message)
        }
    }

    module.exports={loadSignUp,loginLoad,loadHome,forgetPasswordLoad,verifyRPOtpLoad,
        resetPasswordLoad,loadSignUpOtp
    ,loadAllProducts,loadProduct}

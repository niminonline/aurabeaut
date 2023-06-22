const User= require("../../models/userModel");
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

        if(req.session.user_id){
       
        const userData= await User.findOne({_id: req.session.user_id});

        res.render("home",{userData:userData});
        }
        else
        {
            res.render("home");
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

    const loadAllProducts =(req,res)=>{
        try{
            res.render("allProducts");
        }
        catch(error){
            console.log(error.message)
        }
    }

    //===============================Load Product Page==================================
    
    const loadProduct =(req,res)=>{
        try{
            res.render("product");
        }
        catch(error){
            console.log(error.message)
        }
    }

    module.exports={loadSignUp,loginLoad,loadHome,forgetPasswordLoad,verifyRPOtpLoad,
        resetPasswordLoad,loadSignUpOtp
    ,loadAllProducts,loadProduct}

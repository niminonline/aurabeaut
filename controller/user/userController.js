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

//===============Verify Login===================

const verifyLogin = async(req,res)=>{
    // try{
        
    //    const email= req.body.email;
    //    const password= req.body.password;
    //    const userData= await User.findOne({email:email});
    //    if(userData){
    //    const passwordMatch= await bcrypt.compare(password,userData.password);

    //    if(passwordMatch){
    //     req.session.user_id= userData._id;
    //     console.log("SessionID2:"+req.session.user_id);
        res.redirect("/home");


    //    }
    //    else{
    //     res.render("login",{message:"Incorrect Password"});
    //    }

    //    }
    //    else{
    //     res.render("login",{message:"User not found"});
    //    }

    // }
    // catch(err){
    //     console.log(err.message);
    // }
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

const verifyOTPLoad=(req,res)=>{
    try{
        res.render("verifyotp")
    }
    catch(err){
        console.log(err.message);
    }
}

//=========================Send OTP========================

const sendOTP=(req,res)=>{
    try{
        res.redirect("verifyotp")
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

// =======================Reset Password=====================

const resetPassword=(req,res)=>{
    try{
        res.redirect("login")
    }
    catch(err){
        console.log(err.message);
    }
}


//=====================User Home Page===================

const loadHome= async (req,res)=>{
    // const userData= await User.findOne({_id: req.session.user_id});
            
    // try{
    //     res.render("home",{userDetails:userData});
    // }
    // catch(err){
    //     console.log(err.message);
    // }
    res.render("home")
}


//=====================Signup page Load=======================
const loadSignUp =(req,res)=>{
    try{
        res.render("signup");
    }
    catch(error){
        console.log(error.message)
    }
}

// ==============================Load email OTP====================
const loadEmailOtp =(req,res)=>{
    try{
        res.render("verifyEmailOtp");
    }
    catch(error){
        console.log(error.message)
    }
}

//==============================Submit OTP==========================


const submitOTP =(req,res)=>{
    try{
        res.redirect("resetPassword");
    }
    catch(error){
        console.log(error.message)
    }
}
//===============================Store signup details==================


const storeSignUpDetails =(req,res)=>{
    try{
        res.redirect("verifyEmailOtp");
    }
    catch(error){
        console.log(error.message)
    }
}



//==========================Signup User=====================
const securePassword= async(password)=>{
    try{
        const passwordHash= await bcrypt.hash(password,10);
       return  await bcrypt.hash(password,10);
    }
    catch(error){
        console.log(error.message)
    }
}

                    //====Insert User=========
const insertUser= async(req,res)=>{
    try{
        
        const spassword= await securePassword(req.body.password);
        const user=  new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password:spassword,
            
        });
        const userData= await user.save();
        if(userData){
            res.render("signup", {message:"Registration Successfull"});
        }
        else{
            res.render("signup", {message:"Registration Failed"});
        }
    }
    
    catch(err){
        console.log(err);

    }}

    //========================================================================================================
    //===================================================Store Controls======================================
    //========================================================================================================


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

    




    module.exports={loadSignUp,insertUser,loginLoad,loadHome,verifyLogin,forgetPasswordLoad,verifyOTPLoad,
        resetPasswordLoad,sendOTP,resetPassword,loadEmailOtp,submitOTP,storeSignUpDetails
    ,loadAllProducts,loadProduct}

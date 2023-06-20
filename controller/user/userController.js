const User= require("../../models/userModel");
const bcrypt= require("bcrypt");
const helper = require("../../helper/helper");
const session = require("express-session");
const nodemailer= require("nodemailer")

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


//=========================Send OTP========================

const sendOTP=(req,res)=>{
    try{
        res.redirect("verifyotp")
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


const storeSignUpDetails = async(req,res)=>{
    try{

        const {name,email,mobile,password}=req.body;

        const userexist = await User.findOne({ $or: [{email }, { mobile }] });
        if (!userexist){
        console.log(req.body);
        const spassword= await securePassword(password);
        
          req.session.tempUserData= req.body;
          req.session.tempUserData.password=spassword;
          const otp= helper.generateOtp();
        helper.verifyEmail(req.session.tempUserData.email,otp);
        req.session.otp=otp;
    
          
      
        res.redirect("/verifysignupotp");
    }
    else{
        res.render("signup",{message:"User already exists"})

    }}
    catch(error){
        console.log(error.message)
    }}


const securePassword= async(password)=>{
    try{
        const passwordHash= await bcrypt.hash(password,10);
       return  await bcrypt.hash(password,10);
    }
    catch(error){
        console.log(error.message)
    }
}

//==========================Signup User=====================


                    //====Insert User=========
const insertUser= async(req,res)=>{
    try{
        
        
       console.log("New ==> "+ req.session.tempUserData);

       if(req.body.otp== req.session.otp){

           const user= new User({
            name: req.session.tempUserData.name,
            email: req.session.tempUserData.email,
            mobile: req.session.tempUserData.mobile,
            password:req.session.tempUserData.password,
            isVerified:true,
            isBlocked:false
        });
        const userData= user.save();
        if(userData){
            delete req.session.tempUserData;
            res.redirect("login")
        }
        else
        res.render("verifyEmailOtp",{message:"Invalid OTP"})

       }

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




    module.exports={insertUser,verifyLogin,
        sendOTP,resetPassword,submitOTP,storeSignUpDetails
    }

const { ObjectId } = require("mongodb");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");
const bcrypt = require("bcrypt");

// =========================User Block/Unblock=============
const userBlockUnblock = (req, res) => {
  try {
    const id = req.body.id;
    const type = req.body.type;
    User.findByIdAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isBlocked: type === "block" ? true : false } }
    )
      .then((response) => {
        if (type === "block") {
          req.session.user = false;
        }
        res.json(response);
        res.redirect("/admin/users");
      })
      .catch((err) => {
        console.log(err.message);
      });
  } catch (err) {
    console.log(err.message);
  }
};
//=================Load Login Page================================
const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(err.message);
  }
};
//================ Load ForgetPassword Page=========================

const forgetPasswordLoad = (req, res) => {
  try {
    res.render("forgetPassword");
  } catch (err) {
    console.log(err.message);
  }
};

//==============Load Send OTP Page==================

const verifyRPOtpLoad = (req, res) => {
  try {
    res.render("verifyResetPassOtp");
  } catch (err) {
    console.log(err.message);
  }
};

//==============Load Reset Password Page==================

const resetPasswordLoad = (req, res) => {
  try {
    res.render("resetPassword");
  } catch (err) {
    console.log(err.message);
  }
};
//=====================Signup page Load=======================
const loadSignUp = (req, res) => {
  try {
    res.render("signup", { message: "" });
  } catch (error) {
    console.log(error.message);
  }
};

//=====================Load User Home Page===================

const loadHome = async (req, res) => {
  try {
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
    const categoryData = await Category.find({ isUnList: false });

    if (req.session.user_id) {
      const userData = await User.findOne({ _id: req.session.user_id });

      res.render("home", { userData: userData, categoryData: categoryData });
    } else {
      res.render("home", { categoryData: categoryData });
    }
  } catch (err) {
    console.log(err.message);
  }
};

// ==============================Load email OTP====================
const loadSignUpOtp = (req, res) => {
  try {
    res.render("verifySignUpOtp");
  } catch (error) {
    console.log(error.message);
  }
};

//===============Verify Login===================

const verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email: email });
    if (userData) {
      if (userData.isBlocked == false) {
        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (passwordMatch) {
          req.session.user_id = userData._id;
          res.redirect("/home");
        } else {
          res.render("login", { message: "Incorrect Password" });
        }
      } else {
        res.render("login", { message: "User is Blocked" });
      }
    } else {
      res.render("login", { message: "User not found" });
    }
  } catch (err) {
    console.log(err.message);
  }
};

//=========================Send OTP========================

const sendOTP = (req, res) => {
  try {
    res.redirect("verifyotp");
  } catch (err) {
    console.log(err.message);
  }
};
// =======================Reset Password=====================

const resetPassword = (req, res) => {
  try {
    res.redirect("login");
  } catch (err) {
    console.log(err.message);
  }
};

//==============================Submit OTP==========================

const submitOTP = (req, res) => {
  try {
    res.redirect("resetPassword");
  } catch (error) {
    console.log(error.message);
  }
};

//===============================Store signup details==================

const storeSignUpDetails = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const userexist = await User.findOne({ $or: [{ email }, { mobile }] });
    if (!userexist) {
      const spassword = await securePassword(password);

      req.session.tempUserData = req.body;
      req.session.tempUserData.password = spassword;
      const otp = helper.generateOtp();
      helper.verifyEmail(req.session.tempUserData.email, otp);
      req.session.otp = otp;

      res.redirect("/verifysignupotp");
    } else {
      res.render("signup", { message: "User already exists" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//====Insert User=========
const insertUser = async (req, res) => {
  try {
    if (req.body.otp == req.session.otp) {
      const user = new User({
        name: req.session.tempUserData.name,
        email: req.session.tempUserData.email,
        mobile: req.session.tempUserData.mobile,
        password: req.session.tempUserData.password,
        isVerified: true,
        isBlocked: false,
      });
      const userData = user.save();
      if (userData) {
        delete req.session.tempUserData;

        res.redirect("login");
      } else res.render("verifyEmailOtp", { message: "Invalid OTP" });
    }

    const userData = await user.save();
    if (userData) {
      res.render("signup", { message: "Registration Successfull" });
    } else {
      res.render("signup", { message: "Registration Failed" });
    }
  } catch (err) {
    console.log(err);
  }
};

//==================================Log out=============================
const logout = async (req, res) => {
  try {
    delete req.session.user_id;
    // req.session.destroy();
    res.redirect("/login");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  userBlockUnblock,
  loginLoad,
  forgetPasswordLoad,
  verifyRPOtpLoad,
  resetPasswordLoad,
  loadHome,
  loadSignUp,
  loadSignUpOtp,
  verifyLogin,
  sendOTP,
  resetPassword,
  submitOTP,
  storeSignUpDetails,
  insertUser,
  logout,
};

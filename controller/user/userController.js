const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const Carousel= require("../../models/carouselModel");
const User = require("../../models/userModel");
const Category = require("../../models/categoryModel");
const bcrypt = require("bcrypt");
const helper = require("../../helper/helper");
const nodemailer = require("nodemailer");
const { ObjectId } = require("mongodb");


//=================Load Login Page================================
const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404");
  }
};

//================ Load ForgetPassword Page=========================

const forgetPasswordLoad = (req, res) => {
  try {
    res.render("forgetPassword");
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404");
  }
};

//==============Load Send OTP Page==================

const verifyRPOtpLoad = (req, res) => {
  try {
    res.render("verifyResetPassOtp");
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404");
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
          req.session.user_name = userData.name;
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
    res.status(404).render("404");
  }
};

//=========================Send forget email OTP========================

const sendOTP = async(req, res) => {
  try {
    console.log(req.body);
    const {email} = req.body;
    const userData = await User.findOne({email: email});
    if(userData){
        req.session.passwordResetEmail= email;

        const otp = helper.generateOtp();
      helper.verifyEmail(email, otp);
      req.session.otp = otp;
        res.redirect("/verifyResetPassOtp");
    }
    else{
      res.render("forgetPassword",{errorMessage:"Email id not registered"})
    }

  } catch (err) {
    console.log(err.message);
    res.status(404).render("404");
  }
};

//==============Load Reset Password Page==================

const resetPasswordLoad = (req, res) => {
  try {
    res.render("resetPassword");
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404");
  }
};
// =======================Reset Password=====================

const resetPassword = async (req, res) => {
  try {
    const {password}= req.body;
    const securePassword = await helper.hashPassword(password);
    console.log(securePassword);
    const passwordReset= await User.findOneAndUpdate({email:req.session.passwordResetEmail},{$set:{password: securePassword}})
    if(passwordReset){
      res.render("login",{message:"Password reset successfully. Please login"});
    }
   
  } catch (err) {
    console.error(err.message);
    res.status(404).render("404");
  }
};

//==============================Submit OTP==========================

const submitOTP = (req, res) => {
  try {
    res.redirect("resetPassword");
  } catch (error) {
    console.error(error.message);
res.status(404).render("404");  }
};
//===============================Store signup details==================

const storeSignUpDetails = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const userexist = await User.findOne({ $or: [{ email }, { mobile }] });
    if (!userexist) {
      const securePassword = await helper.hashPassword(password);

      req.session.tempUserData = req.body;
      req.session.tempUserData.password = securePassword;
      const otp = helper.generateOtp();
      helper.verifyEmail(req.session.tempUserData.email, otp);
      req.session.otp = otp;

      res.redirect("/verifysignupotp");
    } else {
      res.render("signup", { message: "User already exists" });
    }
  } catch (error) {
    console.error(error.message);
res.status(404).render("404");  }
};

//==========================Signup User=====================

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
      const userData = await user.save();
      const getUserData = await User.findOne({
        email: req.session.tempUserData.email,
      });
      if (userData) {
        req.session.user_id = getUserData._id;
        delete req.session.tempUserData;

        res.redirect("/home");
      } else res.render("verifyEmailOtp", { message: "Invalid OTP" });
    }

    // const userData = await user.save();
    // if (userData) {
    //   res.render("signup", { message: "Registration Successfull" });
    // } else {
    //   res.render("signup", { message: "Registration Failed" });
    // }
  } catch (err) {
    console.error(err);
  }
};

//==================================Log out=============================
const logout = async (req, res) => {
  try {
    delete req.session.user_id;
    // req.session.destroy();
    res.redirect("/login");
  } catch (err) {
    console.error(err.message);
    res.status(404).render("404");
  }
};

//=====================Signup page Load=======================
const loadSignUp = (req, res) => {
  try {
    res.render("signup", { message: "" });
  } catch (error) {
    console.error(error.message);
res.status(404).render("404");  }
};

// ==============================Load email OTP====================
const loadSignUpOtp = (req, res) => {
  try {
    res.render("verifySignUpOtp");
  } catch (error) {
    console.log(error.message);
res.status(404).render("404");  }
};

//=====================Load User Home Page===================

const loadHome = async (req, res) => {
  try {
 
     const carouselData =await Carousel.find({});
    const categoryData = await Category.find({ isUnList: false });
    if (req.session.user_id) {
      const userData = await User.findOne({ _id: req.session.user_id });

      res.render("home", { userData: userData, categoryData: categoryData ,carouselData});
    } else {
      res.render("home", { categoryData: categoryData,carouselData });
    }
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404");
  }
};

//=================Load Cart Page================================

const loadCart = async (req, res) => {
  try {
    const id = new ObjectId(req.session.user_id);
    const userData = await User.findOne({ _id: req.session.user_id })
      .populate("cart.product")
      .lean();


    let subTotal = 0;
    const sum = userData.cart.map((item) => {
      subTotal += item.product.price * item.quantity;
      return subTotal;
    });
    res.render("cart", { userData: userData, subTotal: subTotal });
  } catch (error) {
    console.log(error.message);
res.status(404).render("404");  }
};

//=================Load Wishlist Page================================

const loadWishlist = async (req, res) => {
  try {
    const user = req.session.user_id;
    const userData = await User.aggregate([
      { $match: { _id: new ObjectId(user) } },
      {
        $lookup: {
          from: "products",
          localField: "wishlist",
          foreignField: "_id",
          as: "productData",
        },
      },
    ]);
    // console.log(userData);

    res.render("wishlist", { userData: userData });
  } catch (error) {
    console.log(error.message);
res.status(404).render("404");  }
};

//=================Load User Dashboard================================

const loadUserDashboard = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const orderData = await Order.find({ userId: user_id });
    // console.log(orderData);

    const userData = await User.findOne({ _id: req.session.user_id });
    res.render("userDashboard", { userData: userData, orderData: orderData });
  } catch (error) {
    console.log(error.message);
res.status(404).render("404");  }
};

//===============================Add to Cart==========================
const addToCart = async (req, res) => {
  try {
    const { _id } = req.query;

    const user_id = req.session.user_id;
    const userData = await User.findById(user_id);
    // if(req.query.wishlist){}
    if (req.query.quantity) {
      const quantity = req.query.quantity;
      const addCartData = await User.findOneAndUpdate(
        { _id: new ObjectId(user_id) },
        { $push: { cart: { product: new ObjectId(_id), quantity: quantity } } },
        { new: true }
      );
    } else {
      const productInCart = await User.findOne({
        _id: req.session.user_id,
        "cart.product": { $in: [new ObjectId(_id)] },
      });
      if (productInCart) {
        const addCartData = await User.findOneAndUpdate(
          { _id: new ObjectId(user_id), "cart.product": new ObjectId(_id) },
          { $inc: { "cart.$.quantity": 1 } }
        );
      } else {
        const addCartData = await User.findOneAndUpdate(
          { _id: new ObjectId(user_id) },
          { $push: { cart: { product: new ObjectId(_id) } } },
          { new: true }
        );
      }
     
      res.json("Success");
      
      // res.redirect(req.headers.referer);
    }
  } catch (error) {
    console.log(error.message);
res.status(404).render("404");  }
};

//===============================Add to Wishlist==========================
const addToWishlist = async (req, res) => {
  try {
    const productId = req.query._id;
    const userId = req.session.user_id;
    const existed = await User.findOne({ _id: userId, wishlist: productId });
    if (existed) {
      await User.findByIdAndUpdate(
        { _id: userId },
        { $pull: { wishlist: productId } },
        { new: true }
      );
      res.json("Remove");
    } else {
      await User.findByIdAndUpdate(
        { _id: userId },
        { $addToSet: { wishlist: productId } },
        { new: true }
      );

      res.json("Success");
      // res.redirect(req.headers.referer);
    }

    // const {_id}= req.query;
    // const user_id= req.session.user_id;
    //   const userData= await User.findById(user_id);
    //   await User.findOneAndUpdate({ _id: new ObjectId(user_id)},{ $push: { wishlist: new ObjectId(_id) } },
    //     { new: true });

    // res.redirect(req.headers.referer);
  } catch (error) {
    console.log(error.message);
res.status(404).render("404");  }
};

//===============================Add Address Load==========================
const addAddressLoad = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const userData = await User.findOne({ _id: req.session.user_id });

    res.render("addAddress", { userData: userData });
  } catch (error) {
    console.log(error.message);
res.status(404).render("404");  }
};

//===============================Add Address==========================
const addAddress = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const { location } = req.query;

    const addressDetails = {
      name: req.body.name,
      mobile: req.body.mobile,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      landmark: req.body.landmark,
    };
    User.findById(user_id)
      .then((user) => {
        if (user) {
          user.address.push(addressDetails);
          return user.save();
        } else {
          throw new Error("User not found");
        }
      })
      .then((updatedUser) => {
        res.redirect(location);
      })
      .catch((error) => {
        console.error(error);
      });

    // const userData= await User.findOneAndUpdate({_id:req.session.user_id},{});

    // res.render("addAddress",{userData:userData});
  } catch (error) {
    console.log(error.message);
res.status(404).render("404");  }
};

//===============================Remove cart Item==========================
const removeCartItem = async (req, res) => {
  try {
    const id = req.query._id;

    // const userData= await User.findOne({_id:req.session.user_id}).populate('cart.product').lean();

    await User.findByIdAndUpdate(
      { _id: req.session.user_id },
      { $pull: { cart: { product: id } } }
    ).then(res.json(200));
  } catch (error) {
    console.log(error.message);
res.status(404).render("404");  }
};

//===============================Quantity update==========================
const quantityUpdate = async (req, res) => {
  try {
    const { prodId, method } = req.body;
    const userId = req.session.user_id;
    const productStock = await Product.findById(prodId);

    const CartProductStock = await User.findOne({
      "cart.product": prodId,
      _id: userId,
    });

    const cartlist = CartProductStock.cart;

    function findquantity(prodId) {
      for (const item of cartlist) {
        if (item.product.toString() === prodId.toString()) {
          return item.quantity;
        }
      }
    }
    let cartquantity = findquantity(prodId);
    if (method !== "increment") {
      cartquantity -= 1;
    }
    if (cartquantity < productStock.stock) {
      if (method === "increment") {
        await User.findOneAndUpdate(
          { _id: userId, "cart.product": prodId },
          { $inc: { "cart.$.quantity": 1 } },
          { new: true }
        );
      } else {
        await User.findOneAndUpdate(
          { _id: userId, "cart.product": prodId },
          { $inc: { "cart.$.quantity": -1 } },
          { new: true }
        );
      }
      const quant = await User.findOne(
        { _id: userId, "cart.product": prodId },
        { "cart.$": 1 }
      );
      const user = await User.findOne({ _id: userId })
        .populate("cart.product")
        .lean();
      const { cart } = user;
      let subTotal = 0;
      cart.forEach((val) => {
        val.total = val.product.price * val.quantity;
        subTotal += val.total;
      });

      const totalQuantity = quant.cart[0].quantity;
      if (totalQuantity < 1) {
        await User.updateOne(
          { _id: userId },
          { $pull: { cart: { product: prodId } } }
        );
        res.json("success");
      } else {
        // console.log("------",quant.cart, subTotal);
        res.json({
          quantity: quant.cart,
          subTotal,
        });
      }
    } else {
      res.json({ stocklimit: "stocklimit" });
    }
  } catch (error) {
    console.log(error.message);
res.status(404).render("404");  }
};

//===============================Update address==========================
const updateAddress = async (req, res) => {
  try {
    const { name, mobile, address, pincode, city, state, landmark, index } =
      req.body;
    const userData = await User.findByIdAndUpdate(req.session.user_id, {
      $set: {
        [`address.${index}`]: {
          name: name,
          mobile: mobile,
          address: address,
          pincode: pincode,
          city: city,
          state: state,
          landmark: landmark,
        },
      },
    });
    res.redirect(req.headers.referer);
  } catch (error) {
    console.log(error.message);
res.status(404).render("404");  }
};

// =========================Delete Address=============
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.query;
    await User.updateOne(
      { _id: req.session.user_id },
      { $pull: { address: { _id: id } } }
    ),
      res.redirect(req.headers.referer);
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404");
  }
};

// =========================Remove Wishlist Item=============
const removeWishlistItem = async (req, res) => {
  try {
    const { id } = req.query;
    await User.findByIdAndUpdate(new ObjectId(req.session.user_id), {
      $pull: { wishlist: new ObjectId(id) },
    }).then(res.json(200));
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404");
  }
};
// =========================Page not found=============
const pageNotFound = async (req, res) => {
  try {
    res.render("404");
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404");
  }
};

module.exports = {
  loginLoad,
  forgetPasswordLoad,
  insertUser,
  verifyLogin,
  sendOTP,
  verifyRPOtpLoad,
  resetPasswordLoad,
  resetPassword,
  submitOTP,
  storeSignUpDetails,
  logout,
  loadHome,
  loadSignUp,
  loadSignUpOtp,
  loadCart,
  loadWishlist,
  loadUserDashboard,
  addToCart,
  addToWishlist,
  addAddress,
  addAddressLoad,
  removeCartItem,
  quantityUpdate,
  updateAddress,
  deleteAddress,
  removeWishlistItem,
  pageNotFound,
};

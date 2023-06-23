const User = require("../../models/userModel");
const Category = require("../../models/categoryModel");
const Product = require("../../models/productModel");
const bcrypt = require("bcrypt");
const fs = require("fs");

//===============================Wallets Load====================
const walletLoad = async (req, res) => {
  try {
    res.render("products");
  } catch (err) {
    console.log(err.message);
  }
};

//===============================Wallets Load====================
const adminOrderLoad = async (req, res) => {
  try {
    res.render("order");
  } catch (err) {
    console.log(err.message);
  }
};




module.exports = { walletLoad,adminOrderLoad };

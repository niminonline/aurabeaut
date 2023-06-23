const User = require("../../models/userModel");
const Category = require("../../models/categoryModel");
const Product = require("../../models/productModel");
const bcrypt = require("bcrypt");
const fs = require("fs");
//===============================Offers Load====================
const offerLoad = async (req, res) => {
  try {
    res.render("offers");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { offerLoad };

const Product = require("../../models/productModel");
const User = require("../../models/userModel");
const Category = require("../../models/categoryModel");
const { ObjectId } = require("mongodb");

//===============================Load All Products==================================

const loadAllProducts = async (req, res) => {
  try {
    const categoryDetails = await Category.find({});

    const categoryId = req.query.cat;
    
    if(categoryId){
    const productData = await Product.find({
      category: categoryId,
      isProductUnlist: false,
      isCategoryUnlist: false,
    });
    if (req.session.user_id) {
      const userData = await User.findOne({ _id: req.session.user_id });
     

      res.render("allProducts", { userData: userData, productData: productData,categoryDetails:categoryDetails });
    } else {
      res.render("allProducts", { productData: productData,categoryDetails:categoryDetails });
    }
  }
    else{
      const categoryData = await Category.find({});
      const productData = await Product.find({
        isProductUnlist: false,
        isCategoryUnlist: false,
      });

      if (req.session.user_id) {
        const userData = await User.findOne({ _id: req.session.user_id });
  
        res.render("allProducts", { userData: userData, productData: productData ,categoryDetails,categoryDetails});
      } else {
        res.render("allProducts", { productData: productData,categoryDetails,categoryDetails});
      }
    }
  }
   catch (error) {
    console.log(error.message);
  }
};

//===============================Load Single Product Page==================================

const loadProduct = async (req, res) => {
  try {
    const id = req.query._id;
    const productData = await Product.findById(id);

    if (req.session.user_id) {
      const userData = await User.findOne({ _id: req.session.user_id });

      res.render("product", { userData: userData, productData: productData });
    } else {
      res.render("product", { productData: productData });
    }

    
  } catch (error) {
    console.log(error.message);
  }
};



module.exports = { loadAllProducts, loadProduct };

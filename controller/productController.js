const User = require("../../models/userModel");
const Category = require("../../models/categoryModel");
const Product = require("../../models/productModel");
const bcrypt = require("bcrypt");
const fs = require("fs");

//===============================Products Load====================
const adminProductsLoad = async (req, res) => {
  try {
    const productData = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },
    ]);

    res.render("products", { productData: productData });
  } catch (err) {
    console.log(err.message);
  }
};
//===================================Edit Product Load==========================

const adminEditProductLoad = async (req, res) => {
  try {
    const id = req.query._id;
    const categoryDetails = await Category.find();

    const productData = await Product.findById({ _id: id });

    if (productData) {
      res.render("editProduct", {
        productData: productData,
        categoryDetails: categoryDetails,
      });
    } else {
      res.render("editProduct", {
        errorMessage: "This Product no longer exists",
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};
//===================================Add Product Load==========================

const adminAddProductLoad = async (req, res) => {
  try {
    const categorydata = await Category.find();

    res.render("addProduct", { categorydata: categorydata });
  } catch (err) {
    console.log(err.message);
  }
};

//===============================Load All Products==================================

const loadAllProducts = async (req, res) => {
  try {
    const categoryId = req.query._id;
    const productData = await Product.find({
      category: categoryId,
      isProductUnlist: false,
      isCategoryUnlist: false,
    });
    res.render("allProducts", { productData: productData });
  } catch (error) {
    console.log(error.message);
  }
};

//===============================Load Single Product Page==================================
const loadProduct = async (req, res) => {
  try {
    const id = req.query._id;

    const productData = await Product.findById(id);
    res.render("product", { productData: productData });

    // console.log(productData);
    // if (productData){
    //     res.render("product",{productData:productData});
    // }
    // else
    // {
    //     res.render("product",{Errormessage:"Product not found",productData:undefined});
    // }
  } catch (error) {
    console.log(error.message);
  }
};
// ===============================Add Product==========================

const adminAddProduct = async (req, res) => {
  try {
    const categoryData = await Category.find();

    const name = req.body.name.toUpperCase();
    const isProductExist = await Product.findOne({ name: name });
    if (!isProductExist) {
      const images = req.files.map((file) => file.filename);
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        imageUrl: images,
        brand: req.body.brand,
        stock: req.body.stock,
        is_blocked: false,
      });
      await product.save().then((response) => {
        res.redirect("/admin/products");
      });
    } else {
      res.render("addproduct", {
        categoryData: categoryData,
        errorMessage: "Product already exists",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//=================================Edit Product===============================

const adminEditProduct = async (req, res) => {
  try {
    const productName = req.body.category.toUpperCase();
    const id = req.body._id;
    console.log(req.body);
    const isProductExist = await Product.findOne({ name: productName });
    if (!isProductExist || isProductExist._id == id) {
      if (req.files) {
        const images = req.files.map((file) => file.filename);
        const productData = await Product.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              name: req.body.name,
              price: req.body.price,
              description: req.body.description,
              category: req.body.category,
              imageUrl: images,
              brand: req.body.brand,
              stock: req.body.stock,
            },
          }
        );
      } else {
        const productData = await Product.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              name: req.body.name,
              price: req.body.price,
              description: req.body.description,
              category: req.body.category,
              brand: req.body.brand,
              stock: req.body.stock,
            },
          }
        );
      }
      res.redirect("/admin/products");
    } else {
      res.render("editProduct", { errorMessage: "Product already exist" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//=========================Prduct List/Unlist======================
const productListUnlist = async (req, res) => {
  try {
    const id = req.body.id;
    const type = req.body.type;

    await Product.findByIdAndUpdate(new ObjectId(id), {
      $set: { isProductUnlist: type === "unlist" ? true : false },
    });
    res.json("Success");
    // res.redirect("/admin/category");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  adminProductsLoad,
  adminEditProductLoad,
  adminAddProductLoad,
  loadAllProducts,
  loadProduct,
  adminAddProduct,
  adminEditProduct,
};

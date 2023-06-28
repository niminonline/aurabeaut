const Category = require("../../models/categoryModel");
const Product = require("../../models/productModel");
const { ObjectId } = require("mongodb");
const cloudinary = require("../../helper/cloudinary");

//===============================Category Load====================
const categoryLoad = async (req, res) => {
  try {
    const categoryData = await Category.find();
    if (categoryData) {
      res.render("category", { categoryData: categoryData });
    } else res.render("category", { errorMessage: "No categories found" });
  } catch (err) {
    console.log(err.message);
  }
};

//===================================Edit Category Load==========================

const editCategoryLoad = async (req, res) => {
  try {
    const id = req.query._id;
    const categoryData = await Category.findById({ _id: id });
    if (categoryData) {
      res.render("editCategory", { categoryData: categoryData });
    } else {
      res.render("editCategory", { errorMessage: "Category no longer exist" });
    }
    res.render("editCategory");
  } catch (err) {
    console.log(err.message);
  }
};

// =============================================Add Category==============================
const addCategory = async (req, res) => {
  try {
    const categoryName = req.body.category.toUpperCase();
    const image = req.file;

    const isCategoryExist = await Category.findOne({ category: categoryName });
    if (!isCategoryExist) {

      //-----Start Cloudinary Upload-----
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "image_uploads",
      });
      //-----End Cloudinary Upload-----
      // console.log("msg cloudinary",result);
      if (result) {
        const category = new Category({
          category: categoryName,
          imageUrl: result.secure_url,
        });
        await category.save().then((response) => {
          res.redirect("/admin/category");
        });
      } else {
        res.render("category", { errorMessage: "Category already exist" });
      }
    } else {
      console.log("cloudinary upload failed");
    }

  } catch (err) {
    console.log(err.message);
  }
};

// ===================================Edit Category======================================
const editCategory = async (req, res) => {
  try {
    const categoryName = req.body.category.toUpperCase();
    const id = req.body._id;

    const isCategoryExist = await Category.findOne({ category: categoryName });
    if (!isCategoryExist || isCategoryExist._id == id) {
      if (req.file) {
        const image = req.file.path;

    //-----Start Cloudinary Upload-----
    const result = await cloudinary.uploader.upload(image, {
      folder: "image_uploads",
    });
    //-----End Cloudinary Upload-----

      if(result){
        const categoryData = await Category.findByIdAndUpdate(
          { _id: id },
          { $set: { category: categoryName, imageUrl: result.secure_url } }
        );}
        else{
          console.log("Error Uploading image to cloudinary");
        }
      } else {
        const categoryData = await Category.findByIdAndUpdate(
          { _id: id },
          { $set: { category: categoryName } }
        );
      }
      res.redirect("/admin/category");
    } else {
      res.render("editCategory", { errorMessage: "Category already exist" });
    }
  } catch (err) {
    console.log(err.message);
  }
};

//=======================================List Unlist category=============================

const listUnlistCategory = async (req, res) => {
  try {
    const id = req.body.id;
    const type = req.body.type;

    await Category.findByIdAndUpdate(new ObjectId(id), {
      $set: { isUnList: type === "unlist" ? true : false },
    });
    await Product.updateMany(
      { category: new ObjectId(id) },
      { $set: { isCategoryUnlist: type === "unlist" ? true : false } }
    );
    res.json("Success");
    // res.redirect("/admin/category");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  categoryLoad,
  editCategoryLoad,
  addCategory,
  editCategory,
  listUnlistCategory,
};

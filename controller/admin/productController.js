const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");

//===============================Products Load====================
const productsLoad = async (req, res) => {
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

const editProductLoad = async (req, res) => {
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

const addProductLoad = async (req, res) => {
  try {
    const categorydata = await Category.find();

    res.render("addProduct", { categorydata: categorydata });
  } catch (err) {
    console.log(err.message);
  }
};

// ===============================Add Product==========================

const addProduct = async (req, res) => {
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

const editProduct = async (req, res) => {
  try {
    const productName = req.body.category.toUpperCase();
    const id = req.body._id;
    // console.log(req.body);
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

// const deleteproduct = async (req, res) => {
//   try {
//     const id = req.query._id;
//     await Product.deleteOne({ _id: id });

//     res.redirect("/admin/products");
//   } catch (err) {
//     console.log(err.message);
//   }
//};

module.exports = {
  productsLoad,
  editProductLoad,
  addProductLoad,
  addProduct,
  editProduct,
  productListUnlist
  
};

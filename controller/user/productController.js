const Product = require("../../models/productModel");
const User = require("../../models/userModel");
const Category = require("../../models/categoryModel");
const { ObjectId } = require("mongodb");

//===============================Load All Products==================================

const loadAllProducts = async (req, res) => {
  try {
    const categoryDetails = await Category.find({});
    const search = req.query.search || "";
    const categoryId = req.query.cat || "";
    const sort = req.query.sort || "";
    const query = { isProductUnlist: false, isCategoryUnlist: false };

    if (categoryId !== "") {
      query.category = categoryId;
    }
    let sortQuery = "";
    if (sort !== "") {
      if (sort == "price-l-h") {
        sortQuery = { price: 1 };
      } else if (sort == "price-h-l") {
        sortQuery = { price: -1 };
      } else if (sort == "new") {
        sortQuery = { _id: -1 };
      }
    }

    if (search !== "") {
      // query.name =  search;
      query.name = { $regex: ".*" + search + ".*", $options: "i" };
      console.log("ifff");
    }

    const page = req.query.page || 1;

    const limit = 4;
    const totalPages = Math.ceil((await Product.countDocuments(query)) / limit);

    // if(page>totalPages){
    //   page--;
    // }else if(page<1){
    //   page=1;

    // }
    const skip = (page - 1) * limit;
    // console.log("total", totalPages);

    const productData = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);


    if (req.session.user_id) {
      const userData = await User.findOne({ _id: req.session.user_id });

      res.render("allProducts", {
        userData: userData,
        productData: productData,
        categoryDetails,
        categoryDetails,
        sort: sort,
        totalPages: totalPages,
        page: page,
      });
    } else {
      res.render("allProducts", {
        productData: productData,
        categoryDetails,
        categoryDetails,
        sort: sort,
        totalPages: totalPages,
        page: page,
      });
    }
  } catch (error) {
    console.log(error.message);
res.status(404).render("404");
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
res.status(404).render("404");
  }
};
//===============================Add review ==================================

const addReview = async (req, res) => {
  try {
    const {id,review,starRating,title} =req.body;
    const productData= await Product.findById(id);
    const userData= await User.findById(req.session.user_id)
    const reviewData={
      userId: req.session.user_id,
      reviewer: userData.name,
      title: title,
      content: review,
      starRating:starRating,
      date: new Date()    
    }
    await Product.findByIdAndUpdate(id,{$push:{review:reviewData}},{new:true});

    res.redirect(req.headers.referer);

  } catch (error) {
    console.log(error.message);
res.status(404).render("404");
  }
};

module.exports = { loadAllProducts, loadProduct,addReview };

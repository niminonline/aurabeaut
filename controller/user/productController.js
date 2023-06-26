const Product = require("../../models/productModel");

//===============================Load All Products==================================

const loadAllProducts = async (req, res) => {
  try {
    const categoryId = req.query._id;
    if(categoryId){
    const productData = await Product.find({
      category: categoryId,
      isProductUnlist: false,
      isCategoryUnlist: false,
    });
    res.render("allProducts", { productData: productData });}
    else{
      const productData = await Product.find({
        isProductUnlist: false,
        isCategoryUnlist: false,
      });
      res.render("allProducts", { productData: productData });}
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

module.exports = { loadAllProducts, loadProduct };

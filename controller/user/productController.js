const Product = require("../../models/productModel");
const User = require("../../models/userModel");
const Category = require("../../models/categoryModel");
const { ObjectId } = require("mongodb");

//===============================Load All Products==================================

const loadAllProducts = async (req, res) => {
  try {
    const categoryDetails = await Category.find({});

    const categoryId = req.query.cat||'';
    const sort= req.query.sort||'';

    const catQuery= {isProductUnlist: false,
      isCategoryUnlist: false};
      if (categoryId !== '') {
        catQuery.category = categoryId;
      }
      let sortQuery='';
      if (sort !== '') {
        if(sort=='price-l-h'){
           sortQuery={price:1}
        }
        else  if(sort=='price-h-l'){
           sortQuery={price:-1}
      } else  if(sort=='new'){
         sortQuery={_id:-1}
    }}


// Pagination
const page = req.query.page || 1;
const limit = 4;
const skip = (page - 1) * limit;


const totalPages = Math.ceil(await Product.countDocuments(catQuery) / limit); 
// console.log("total", totalPages);




    
     
      const productData = await Product.find(catQuery).sort(sortQuery).skip(skip).limit(limit);;


      if (req.session.user_id) {
        const userData = await User.findOne({ _id: req.session.user_id });
  
        res.render("allProducts", { userData: userData, productData: productData ,categoryDetails,categoryDetails,sort:sort,totalPages:totalPages});
      } else {
        res.render("allProducts", { productData: productData,categoryDetails,categoryDetails,sort:sort,totalPages:totalPages});
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

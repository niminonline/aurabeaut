const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");


const getCategory= (req,res)=>{

    try{
        const id= req.query._id;
        console.log("cat id"+id);

    }
    catch(err){
        console.log(err.message);
    }
}




module.exports={getCategory}
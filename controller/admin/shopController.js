const Product= require("../../models/productModel")
const Category= require("../../models/categoryModel")
const fs= require("fs");
const path= require("path");    


// =============================================Add Category==============================
const addCategory= async(req,res)=>{

try{
    console.log(req.body);
    const categoryName = req.body.category.toUpperCase();
    const image = req.file;


    const isCategoryExist = await Category.findOne({ category: categoryName });
    if (!isCategoryExist) {
        const category = new Category({
            category: categoryName,
            imageUrl: image.filename,
        });
        await category.save().then((response) => {
            res.render("category", { successMessage: "Category added successfully" });
        })
       
    } else {
        res.render("category", { errorMessage: "Category already exist" });
    }
}
catch(err){
    console.log(err.message);
}
}

// ===================================Edit Category======================================
const editCategory= async(req,res)=>{

    try{
        console.log(req.body);
        console.log(req.file);

        const categoryName = req.body.category.toUpperCase();
        const id= req.body._id;
    
    
        const isCategoryExist = await Category.findOne({ category: categoryName });
        if ((!isCategoryExist)||(isCategoryExist._id==id)) {


            if(req.file){
            const categoryData=  await Category.findByIdAndUpdate({_id:id},{$set:{category: categoryName,imageUrl:req.file.filename }})
            }
            else{
                const categoryData=  await Category.findByIdAndUpdate({_id:id},{$set:{category: categoryName }})
  
            }
            res.redirect("/admin/category")

            }
           
        else {
            res.render("editCategory", { errorMessage: "Category already exist" });
        }
    }
    catch(err){
        console.log(err.message);
    }
    }

    // ===============================Add Product==========================

    const addProduct= async (req,res)=>{

        try {
            const categoryData= await Category.find();
             const categories= categoryData.map((item)=>item.category);
            const name = req.body.name.toUpperCase();
            const isProductExist = await Product.findOne({ name: name });
            if (!isProductExist) {
                const images = req.files.map((file) =>file.filename);
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
                await product.save()
                    .then((response) => {
                        res.redirect("/admin/products");
                    })
            } else {
                res.render("addproduct", {
                    categories: categories, errorMessage: "Product already exists"
                });
            }
        } catch (error) {
            console.log(error.message);
        }

    }

module.exports={addCategory,editCategory,addProduct}
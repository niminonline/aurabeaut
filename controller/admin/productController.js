const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");
const cloudinary = require("../../helper/cloudinary");
const { ObjectId } = require("mongodb");

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
    res.status(404).render("404", { errorMessage: err.message });
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
    res.status(404).render("404", { errorMessage: err.message });
  }
};
//===================================Add Product Load==========================

const addProductLoad = async (req, res) => {
  try {
    const categorydata = await Category.find();

    res.render("addProduct", { categorydata: categorydata });
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404", { errorMessage: err.message });
  }
};

// ===============================Add Product==========================

const addProduct = async (req, res) => {
  try {
    const categoryData = await Category.find();

    const name = req.body.name.toUpperCase();
    const isProductExist = await Product.findOne({ name: name });
    if (!isProductExist) {
      const images = req.files.map((file) => file.path);

      // -------------------------Cloudinary---------------------

      const uploadImages = async (images) => {
        try {
          const results = await Promise.all(images.map(uploadImage));
          console.log("Images uploaded:", results);
          const imageUrls = results.map((result) => result.secure_url);
          return imageUrls;
        } catch (error) {
          console.log("Upload error:", error);
          return [];
        }
      };

      // Upload a single image
      const uploadImage = (image) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            image,
            { folder: "image_uploads", width: 400, height: 600, crop: "fill" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
        });
      };
      const imageUrl = await uploadImages(images);
      //------------------End Cloudinary----------------
      if (imageUrl) {
        const product = new Product({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          category: req.body.category,
          mainImage: imageUrl[0],
          imageUrl: imageUrl,
          brand: req.body.brand,
          stock: req.body.stock,
          is_blocked: false,
        });
        await product.save().then((response) => {
          res.redirect("/admin/products");
        });
      } else {
        console.log("Error while uploading images to cloudinary");
      }
    } else {
      res.render("addproduct", {
        categoryData: categoryData,
        errorMessage: "Product already exists",
      });
    }
  } catch (error) {
    console.log(error.message);
res.status(404).render("404");  }
};

//=================================Edit Product===============================

const editProduct = async (req, res) => {
  try {
    console.log("image", req.file);
    console.log("bodyyy", req.body);
    const productName = req.body.category.toUpperCase();
    const id = req.body._id;
    // console.log(req.body);
    const isProductExist = await Product.findOne({ name: productName });
    if (!isProductExist || isProductExist._id == id) {
      if (req.files) {
        const images = req.files.map((file) => file.path);

        // -------------------------Cloudinary---------------------

        const uploadImages = async (images) => {
          try {
            const results = await Promise.all(images.map(uploadImage));
            console.log("Images uploaded:", results);
            const imageUrls = results.map((result) => result.secure_url);
            return imageUrls;
          } catch (error) {
            console.log("Upload error:", error);
            return [];
          }
        };

        // Upload a single image
        const uploadImage = (image) => {
          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
              image,
              {
                folder: "image_uploads",
                width: 400,
                height: 600,
                crop: "fill",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
          });
        };
        const imageUrl = await uploadImages(images);
        //------------------End Cloudinary----------------
        if (imageUrl) {
          const productData = await Product.findByIdAndUpdate(
            { _id: id },
            {
              $push: { imageUrl: { $each: imageUrl } },
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
        } else {
          console.log("Error while uploading images to cloudinary");
        }
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
res.status(404).render("404");  }
};

// ===========================Product List/Unlist=====================
const productListUnlist = async (req, res) => {
  try {
    const { id } = req.body;

    const productData = await Product.findOne({ _id: id });
    // console.log(productData);
    if (productData.isProductUnlist == true) {
      await Product.findByIdAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { isProductUnlist: false } }
      );
    } else {
      await Product.findByIdAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { isProductUnlist: true } }
      );
      // .then((response) => {

      //    res.json(response);

      // })
      // .catch((err) => {
      //   console.log(err.message);
      res.status(404).render("404", { errorMessage: err.message });
      // });
    }
    res.redirect("/admin/products");

    // const id = req.body.id;
    // const type = req.body.type;

    // await Product.findByIdAndUpdate(new ObjectId(id), {
    //   $set: { isProductUnlist: type === "unlist" ? true : false },
    // });
    // res.json("Success");
    // // res.redirect("/admin/category");
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404", { errorMessage: err.message });
  }
};

// ====================================Delete Product Image==========================

const deleteProductImage = async (req, res) => {
  try {
    const { id, imageurl } = req.query;
    const public_id = imageurl.match(/image_uploads\/\w+/)[0];
    // -----Start Cloudinary Image Removal-----

    const result = cloudinary.uploader.destroy(
      public_id,
      { invalidate: true },
      (result, error) => {
        if (error) {
          console.error(error);
        } else {
          return result;
        }
      }
    );

    if (result) {
      await Product.findByIdAndUpdate(
        { _id: id },
        { $pull: { imageUrl: imageurl } }
      ).then(() => {
        res.sendStatus(200);
      });
    } else {
      res.sendstatus(500);
    }
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404", { errorMessage: err.message });
  }
};

// ====================================Set Product main Image==========================

const setProductMainImage = async (req, res) => {
  try {
    const { id, imageurl } = req.query;
    await Product.findByIdAndUpdate(
      new ObjectId(id),
      { $set: { mainImage: imageurl } },
      { new: true }
    );
    res.redirect(req.headers.referer);
  } catch (err) {
    console.log(err.message);
    res.status(404).render("404", { errorMessage: err.message });
  }
};

// const deleteproduct = async (req, res) => {
//   try {
//     const id = req.query._id;
//     await Product.deleteOne({ _id: id });

//     res.redirect("/admin/products");
//   } catch (err) {
//     console.log(err.message);
// res.status(404).render("404");
//   }
//};

module.exports = {
  productsLoad,
  editProductLoad,
  addProductLoad,
  addProduct,
  editProduct,
  productListUnlist,
  deleteProductImage,
  setProductMainImage,
};

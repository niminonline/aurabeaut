
const Carousel= require("../../models/carouselModel");
const cloudinary = require("../../helper/cloudinary");



//===============================Carousel Load====================
const carouselLoad = async(req,res)=>{
    try{
        const carouselData= await Carousel.find({});
        res.render("carousel",{carouselData});

    }
    catch(err){
        console.error(err.message);
        res.status(404).render("404");
    }
}


//===================================Add Carousel Load==========================

const addCarousel = async(req,res)=>{
    try{


        const{title,subtitle,buttonText,buttonLink}=req.body;
       
        // ----------------------------
        
        const image = req.file;
    
          //-----Start Cloudinary Upload-----
          const result = await cloudinary.uploader.upload(image.path, {
            folder: "image_uploads",
          });
          //-----End Cloudinary Upload-----
        //   console.log("msg cloudinary",result);
          if (result) {
            const carousel = new Carousel({
                title:  title ,
                subtitle: subtitle  ,
                buttonText: buttonText  ,
                buttonLink:  buttonLink  ,
                imageUrl:  result.secure_url ,
            });
            await carousel.save().then((response) => {
              res.redirect("/admin/carousel");
            });
          } 
    }
    // ----------------------------
    catch(err){
        console.error(err.message);
    res.status(404).render("404");
    }
}
//===================================Edit Carousel Load==========================

const editCarouselLoad = async(req,res)=>{
    try{
        const id = req.query._id;
    const carouselData = await Carousel.findById({ _id: id });
    if (carouselData) {
      res.render("editCarousel", { carouselData: carouselData });
    } else {
      res.render("editCarousel", { errorMessage: "Category no longer exist" });
    }
    res.render("editCategory");
    }
    catch(err){
        console.error(err.message);
res.status(404).render("404");
    }
}


// ===================================Edit Carousel======================================
const editCarousel = async (req, res) => {
    try {
        const{title,subtitle,buttonText,buttonLink}=req.body;
        const id = req.body._id;
        if (req.file) {
          const image = req.file.path;
  
      //-----Start Cloudinary Upload-----
      const result = await cloudinary.uploader.upload(image, {
        folder: "image_uploads",
      });
      //-----End Cloudinary Upload-----
  
        if(result){
          const carouselData = await Carousel.findByIdAndUpdate(
            { _id: id },
            { $set: {title:title,subtitle:subtitle,buttonText:buttonText,buttonLink:buttonLink, imageUrl: result.secure_url } }
          );}
          else{
            console.error("Error Uploading image to cloudinary");
          }
        } else {
          const carouselData = await Carousel.findByIdAndUpdate(
            { _id: id },
            { $set:{title:title,subtitle:subtitle,buttonText:buttonText,buttonLink:buttonLink } }
          );
        }
        res.redirect("/admin/carousel");
     
      
    } catch (err) {
      console.error(err.message);
  res.status(404).render("404");
    }
  };


  // ===================================Delete Carousel======================================
const deleteCarousel = async (req, res) => {
    try {
       
        const id= req.query._id;
        await Carousel.findByIdAndDelete(id);
        res.redirect("/admin/carousel")
      
    } catch (err) {
      console.error(err.message);
  res.status(404).render("404");
    }
  };

  

module.exports={carouselLoad,addCarousel,editCarouselLoad,editCarousel,deleteCarousel}

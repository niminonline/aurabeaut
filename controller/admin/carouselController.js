
const Carousel= require("../../models/carouselModel");



//===============================Carousel Load====================
const carouselLoad = async(req,res)=>{
    try{
        res.render("carousel");

    }
    catch(err){
        console.log(err.message);
res.status(404).render("404");
    }
}

//===================================Edit Carousel Load==========================

const editCarouselLoad = async(req,res)=>{
    try{
        res.render("editCarousel");

    }
    catch(err){
        console.log(err.message);
res.status(404).render("404");
    }
}



module.exports={carouselLoad,editCarouselLoad}

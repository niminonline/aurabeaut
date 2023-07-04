
const Coupon= require("../../models/couponModel");


//===============================Coupons Load====================
const couponsLoad = async(req,res)=>{
    try{
        res.render("coupons");

    }
    catch(err){
        console.log(err.message);
    }
}



module.exports={couponsLoad}

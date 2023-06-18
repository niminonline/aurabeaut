const isLogin= async(req,res,next)=>{
    try{
        if(req.session.admin_id){
            res.redirect("/admin/home");
        }
        else
        next();
    }
    catch(err){
        console.log(err.message);
    }
}
const isLogout= async(req,res,next)=>{
    try{

        if(!req.session.admin_id){
            res.redirect("/admin");
        }
        else
        next();
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports={isLogin,isLogout}
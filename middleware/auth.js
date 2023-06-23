const isAdminLogin= async(req,res,next)=>{
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
const isAdminLogout= async(req,res,next)=>{
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
const isUserLogin= async(req,res,next)=>{
    try{
        if(req.session.user_id){
            
            res.redirect("/home");
        }
        else
        next();
    }
    catch(err){
        console.log(err.message);
    }
}
const isUserLogout= async(req,res,next)=>{
    try{

        if(!req.session.user_id){
            res.redirect("/");
        }
        else
        next();
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports={isAdminLogin,isAdminLogout,isUserLogin,isUserLogout}
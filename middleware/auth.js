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
res.status(404).render("404");
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
res.status(404).render("404");
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
res.status(404).render("404");
    }
}

const isUserSession= async(req,res,next)=>{
    try{
        if(req.session.user_id){
            
            next();
        }
        else
        res.redirect("/login");
    }
    catch(err){
        console.log(err.message);
res.status(404).render("404");
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
res.status(404).render("404");
    }
}

module.exports={isAdminLogin,isAdminLogout,isUserLogin,isUserLogout,isUserSession}
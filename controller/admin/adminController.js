
//=====================================Admin Logout================



const adminLogout = async(req,res)=>{
    try{
        delete req.session.admin_id;
        // req.session.destroy();
        res.redirect("/admin/");
    }

    catch(err){
        console.log(err.message);
    }

}


module.exports={adminLogout}
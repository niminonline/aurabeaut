

const noCache = (req,res,next)=>{
    res.header('Cache-control','no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0');
   next();
   };

module.exports ={noCache}

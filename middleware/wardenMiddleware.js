const wardenMiddleware=(req,res,next)=>{
    if(!req.user|| req.user.role!="warden")
    {
        return res.status(403).json({
            message:"Access denied . Warden only"
        })
    }
    next();
};
module.exports=wardenMiddleware
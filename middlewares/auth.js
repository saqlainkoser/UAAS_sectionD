//isAuthenticated - it will check user is logged in or not
//checkRole - it will check user is allowed to go specific route 

const isAuthenticated = (req,res,next)=>{
    if(req.cookies.token){
        return next()
    }
    else{
        res.redirect("/login")
    }
}

const jwt = require("jsonwebtoken")

const checkRole = (role) =>{

   return (req,res,next) =>{
        const user =  jwt.verify(req.cookies.token,"secret")
        if(req.cookies.token && user.userRole == role ){
            next()
        }
        else{
            res.status(403).json({message:"!You Do Not Have Access"})
        }
   }
} 

module.exports = {isAuthenticated,checkRole}
const express = require("express")
const mongoose = require("mongoose")
const app = express()
const userModel = require("./models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { isAuthenticated } = require("./middlewares/auth")
const cookieParser = require("cookie-parser")
const deptModel = require("./models/deptModel")



app.set("view engine","ejs")
app.use(express.urlencoded({extented:true}))
app.use(cookieParser())


const jwtSecret = "secret"


const generateToken =(payload) => {
    return jwt.sign(payload,jwtSecret,{expiresIn:"30s"})
}

mongoose.connect("mongodb://localhost:27017/UAAN_sectionD")
        .then(()=>console.log("MongoDb Connected"))
        .catch((err)=>console.log(err))


app.get("/login",(req,res)=>{
    res.render("login")
})        

app.post("/login",async (req,res)=>{
    console.log(req.body)
    const {email,password} = req.body
    if(!email && !password){
        return res.status(400).json({message:"Email and Password Required"})
    }
    const user = await userModel.findOne({email:email})
    console.log(user);
    
    if(!user){
        return res.status(400).json({message:"Invalid Email Or Password"})
    }

    console.log(user.password);
    console.log(password);
    
    const validUser = await bcrypt.compare(password,user.password)

    if(!validUser){
        return res.status(400).json({message:"Incorret Password"})
    }

    res.cookie("token",generateToken({
        userId:user._id,userRole:user.role}))

    res.redirect("/dashboard")
})

app.get("/dashboard",isAuthenticated,(req,res)=>{
    let message = ""
    if(req.cookies.flashmsg){
        message = req.cookies.flashmsg
        res.cookie("flashmsg","")
    }
    res.render("dashboard",{message})
})

//department creation 

//department creation get route
app.get("/create-department",(req,res)=>{
    res.render("create-department")
})

//department creation post route
app.post("/create-department",async(req,res)=>{
    const {name,type,address} = req.body
    if(!name && !type && !address){
        res.status(404).json({message:"Fill all the fields"})
    }
    const newDept = await deptModel.create({
        name:name,
        type:type,
        address : address
    })

    await newDept.save()
    res.cookie("flashmsg","Deapratment Created")
    res.redirect("/dashboard")
})


app.get("/departments",(req,res)=>{
    res.render("departments")
})


app.listen(3309,()=>{
    console.log("Server is running on http://localhost:3309/login");
})
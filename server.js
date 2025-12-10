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


app.get("/departments",async(req,res)=>{
    const search = req.query.search || "" 
    const type = req.query.type || "all"
    
    const matchStage = {}

    //Search by name
    if(search.trim()!== ""){
        matchStage.name = { $regex : search , $options : "i" }
    }
    if(type!=="all"){
        matchStage.type = type
    }


  const data =   await deptModel.aggregate([
        {$match : matchStage },
        {$lookup:
            {
               from : "uaasusers",
               localField : "_id",
               foreignField : "department",
               as : "users"
            }
        },
        {$project:
            {
                name : 1,
                type : 1,
                address : 1,
                //it will give the count of users in diffrent departments
                userCount : { $size : "$users" }

            }
        }
        
    ])
    res.render("departments",{data ,search,type})
})

app.get("/delete-department/:id",async(req,res)=>{
    await deptModel.findByIdAndDelete(req.params.id)
    res.redirect("/departments")
})

app.get("/edit-department/:id",async(req,res)=>{
    // await deptModel.findByIdAndUpdate(req.params.id,{name,email,password})
    const currentDept = await deptModel.findById(req.params.id)
    res.render("edit-department",{currentDept})
})

app.post("/edit-department/:id",async(req,res)=>{
    const {name,type,address} = req.body
    await deptModel.findByIdAndUpdate(req.params.id,{name,type,address})
    res.redirect("/departments")
})

app.get("/create-user",async(req,res)=>{
    const deptData = await deptModel.find({},"name")
    // res.json({result:deptData})
    res.render("create-user",{deptData})
})

app.post("/create-user",async(req,res)=>{
    const {email,password,role,firstName,lastName,department} = req.body
    // res.json({result:req.body})
    
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser =  await userModel.create({
        email : email,
        password : hashedPassword,
        role : role,
        firstName : firstName,
        lastName : lastName,
        department : department
    })

    await newUser.save()
    res.redirect("/dashboard")
})


app.get("/users",async(req,res)=>{
    const users = await userModel.find().populate("department")
    res.render("users",{users})
    // res.json(users)
})

app.listen(3309,()=>{
    console.log("Server is running on http://localhost:3309/users");
})
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const userModel = require("../models/userModel")

mongoose.connect("mongodb://localhost:27017/UAAN_sectionD")
        .then(()=>console.log("MongoDb Connected"))
        .catch((err)=>console.log(err))

async function addAdminCred(){

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("12345",salt)

   const admin =  await userModel.create({
    email : "admin@1234",
    password : hashedPassword,
    role : "admin",
    firstName : "admin"
    })

    await admin.save()
    console.log(admin);
    console.log("Admin Added");
}

addAdminCred()


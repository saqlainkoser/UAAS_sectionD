//user schema
const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    email:{
        type : String,
        unique : true,
        required : true
    },
    password:{
        type: String,
        required : true
    },
    role:{
        type: String,
        enum : ['student','hod','admin','professor'],
        required : true,
        default : 'student'
    },
    firstName:{
        type:String,
        required : true
    },
    lastName:{
        type:String,
    },
    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"department"
    },
    isActive:{
        type : Boolean,
        default : true
    }
},{
    timestamps : true
})

const userModel = mongoose.model("uaasuser",userSchema)
module.exports = userModel

userModel.find().populate()


//name of depart , type ,usercount
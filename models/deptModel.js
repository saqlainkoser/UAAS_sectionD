const mongoose = require("mongoose")

const deptSchema = new mongoose.Schema({
    name : {
        type : String,
        required:true,
        unique : true
    },
    type:{
        type:String,
        enum : ["UG","PG","Research"]
    },
    address:String
})


module.exports =  mongoose.model("department",deptSchema)
const { default: mongoose, model } = require("mongoose");


const adminSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    fullName:{type:String,required:true},
    phone:{type:String,required:true}
})

const Admin=mongoose.model('Admin',adminSchema);
module.exports=Admin;
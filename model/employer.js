const { default: mongoose } = require("mongoose");
const user = require("./user");

const employerSchmea=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
    ,
    Name:{type:String, required:true},
    Designation:{type:String ,required:true},
    phone:{type:String,required:true},
    companyName:{type:String,required:true},
    companyDescription:{type:String,required:true},
    companyAddress:{type:String,required:true},
    companyCity:{type:String,required:true},
    companyWebsite:{type:String},
    industry:{type:String,required:true},
    companyLogoUrl:{type:String},
},{timestamps:true});

const Employer=mongoose.model("Employer",employerSchmea);
module.exports=Employer;
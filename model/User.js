const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
 
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6 // you’ll hash this before saving
  },
  

  role: { type: String, enum: ["jobseeker", "employer", "admin"], default: "jobseeker" },
  resetToken:{type:String},
  resetTokenExpiredAt:{type:Date}

 
}, { timestamps: true });


// candidateSchema.methods.generateJWT_Token = () => {
//   jwt.sign({ id: this._id }, process.env, { expiresIn: '24h' })
// }
const User = mongoose.model("User", UserSchema);
module.exports=User;





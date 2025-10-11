const User=require('../model/user');
const jwt = require('jsonwebtoken');


function generateToken(user,res,meesage,statusCode){
    const token=user.generateJWT_Token();
}


function tokenGen(user){
   return jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:'24h'});
}

module.exports.tokenGen=tokenGen;
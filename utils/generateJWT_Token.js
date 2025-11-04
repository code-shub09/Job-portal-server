const User=require('../model/user');
const jwt = require('jsonwebtoken');


// function generateToken(user,res,meesage,statusCode){
//     const token=user.generateJWT_Token();
// }

const { customError } = require("../utils/errorClass");
function tokenGen(user) {
  if (!user || !user._id) {
    throw new customError("Invalid user object passed to tokenGen()",404);
  }

  // Generate a JWT
  console.log('token gen')
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "55m" }
  );
}

module.exports = { tokenGen };
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const { customError } = require("../utils/errorClass");
const { tokenGen } = require("../utils/generateJWT_Token");

async function logic_resetPassword(sentpassword,resetTokensent){
    const decoded= jwt.verify(resetTokensent,process.env.JWT_SECRET_KEY);

    console.log('decoded user',decoded);
    // findind the user object from decoded token , the user object reset token should match with sent token and expiret time should be more than of current time
    const user=await User.findOne({_id:decoded.id,resetToken:resetTokensent,resetTokenExpiredAt:{$gt:Date.now()}});
    if(!user){
        throw new customError('invalid or expired token',400);
    }

    user.password=sentpassword;
    console.log(' user pass',user.password);
    user.resetToken=undefined;  // so that user couldn't click same link multiple times and reset password again when the is yet to expired
    user.resetTokenExpiredAt=undefined;
    await user.save();

}

module.exports={logic_resetPassword};
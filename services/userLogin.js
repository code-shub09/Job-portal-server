const User = require("../model/user");
const { customError } = require("../utils/errorClass");
const { tokenGen } = require("../utils/generateJWT_Token");
async function userLogin(userDetails) {
    const { email, password } = userDetails;
    // finding the user whehter it exist or not
    const userX = await User.findOne({ email });
    
    console.log(userX)
    if (!userX) {
        throw new customError('User not registered', 401);

    }
    if (password != userX.password) {
        console.log('sp:up:', password, " --", userX.password);
        throw new customError("Password didn't match", 401);
    }
    console.log('ok:sp:up:', password, " --", userX.password);
    const token = tokenGen(userX);
    console.log("Generated Token:", token);

    return token;
}

module.exports = { userLogin };
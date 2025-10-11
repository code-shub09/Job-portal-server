// import { createUser } from "../services/createUser";
// import { userLogin } from "../services/userLogin";
// import { customError } from "../utils/errorClass";

// const Admin = require("../model/admin");
// const Employer = require("../model/employer");
// const Jobseeker = require("../model/job_seeker");
// const User = require("../model/user");
// const { tokenGen } = require("../utils/generateJWT_Token");

const { createUser } = require("../services/createUser");
const { userLogin } = require("../services/userLogin");
const { customError } = require("../utils/errorClass");
const { tokenGen } = require("../utils/generateJWT_Token");



 async function register(req, res) {


    const { newUser, token } = await createUser(req.body);
    console.log(req.body);

    res.status(200).cookie('jwt', token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day,
        httpOnly: true,
        secure: true, // Use true if your site uses HTTPS
        sameSite: "none", // Required for cross-origin cookies
    }).json({
        message: "User registerd succesfully ",
        role: newUser.role
    })

}

 async function login(res, req) {

    const token=userLogin(req.body);

    res.status(200).cookie('jwt', token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day,
        httpOnly: true,
        secure: true, // Use true if your site uses HTTPS
        sameSite: "none", // Required for cross-origin cookies
    }).json({
        message: "User logged in succesfully ",
        role: newUser.role
    })
}

module.exports = { register, login };
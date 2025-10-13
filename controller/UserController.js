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
let nodemailer = require('nodemailer');

const {sendForgetMail}=require('../services/forgetpassword');
const User = require("../model/user");
// const { responseHandler } = require("../utils/responseHandler");
const responseHandler = require("../utils/responseHandler");
const { logic_resetPassword } = require("../services/logic_restPassword");




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

async function login( req,res) {

    const token = await userLogin(req.body);
    console.log('token is good res')

    res.status(200).cookie('jwt', token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day,
        httpOnly: true,
        secure: true, // Use true if your site uses HTTPS
        sameSite: "none", // Required for cross-origin cookies
    }).json({
        message: "User logged in succesfully ",
       
    })
}

async function forgetPassword(req,res) {
    const {email}=req.body;

     // check whether this email is registered or not

    await sendForgetMail(email);


    res.json({ message: "Password reset link sent to email" });
   
}

async function resetPassword(req,res) {
    const {password}=req.body;
    const {token}= req.params;
    console.log('params',req.params)
    console.log('sent user pass',req.body);

     // check whether this email is registered or not

    await logic_resetPassword(password,token);
    console.log('succes -reset')
    res.status(200).json({ message: "Password reset successfull" });
}


// module.exports.forgetPassword=responseHandler(forgetPassword);
// module.exports.register=responseHandler(register);
// module.exports.login=responseHandler(login);

module.exports = {
  register: responseHandler(register),
  login: responseHandler(login),
  forgetPassword: responseHandler(forgetPassword),
  resetPassword:responseHandler(resetPassword)
};
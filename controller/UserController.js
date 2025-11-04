

const { createUser } = require("../services/createUser");
const { userLogin } = require("../services/userLogin");
const { customError } = require("../utils/errorClass");
const { tokenGen } = require("../utils/generateJWT_Token");
let nodemailer = require('nodemailer');

const { sendForgetMail } = require('../services/forgetpassword');
const User = require("../model/user");
// const { responseHandler } = require("../utils/responseHandler");
const responseHandler = require("../utils/responseHandler");
const { logic_resetPassword } = require("../services/logic_restPassword");
const Job = require("../model/job");
const { sendForgetMailX, verifyOtp } = require("../services/verifyEmail");




async function register(req, res) {
    console.log('refister puja')
    // console.log(req.body);
    const { companyName,
        companyDescription,
        companyLogo,
        website,
        contactName,
        industry,
        designation,
        email,
        phone,
        address,
        city,
        password,
        confirmPassword } = req.body;
    const profile = { companyName, companyDescription, website, contactName, designation, industry, phone, address, city }
    const userDetails = { email, password, role: 'employer', profile }



    const { newUser, token } = await createUser(userDetails);


    res.status(200).cookie('jwt', token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day,
        httpOnly: true,
        secure: false, // Use true if your site uses HTTPS
        sameSite: "lax", // Required for cross-origin cookies
    }).json({
        message: "User registerd succesfully ",
        role: newUser.role
    })

}

async function login(req, res) {

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

async function forgetPassword(req, res) {
    const { email } = req.body;

    // check whether this email is registered or not

    await sendForgetMail(email);


    res.json({ message: "Password reset link sent to email" });

}

async function jobSearch(req, res) {
    const { jobTitle, location } = req.body;

    const filter = { status: "open" };

    if (location) {
        filter.location = { $regex: location, $options: 'i' };
    }

    if (jobTitle) {
        filter.title = { $regex: jobTitle, $options: 'i' }
    }

    const jobsFilter = await Job.find({ ...filter });
    // console.log('filter',jobsFilter);

    res.status(200).json({ success: true, message: 'done', jobs: jobsFilter });


}

async function JobDetail(req, res) {
    console.log('job dibbmvvkhj:::')
    const { id } = req.params;
    try {
        const jobx = await Job.findOne({ _id: id }).populate('postedBy');
        console.log('job', jobx);
        res.status(200).json({
            success: true,
            job: jobx
        })

    } catch (error) {
        console.log(error)
        throw new customError('Server error', 500);

    }




}

async function resetPassword(req, res) {
    const { password } = req.body;
    const { token } = req.params;
    console.log('params', req.params)
    console.log('sent user pass', req.body);

    // check whether this email is registered or not
    await logic_resetPassword(password, token);
    console.log('succes -reset')
    res.status(200).json({ message: "Password reset successfull" });
}

async function verify(req, res) {
    console.log('verify')
    const { email, password, firstName, lastName } = req.body;
    // const profile = { firstName, lastName }
    // const userdetails = { email, password, role: 'jobseeker', profile };
    //  let userExists = null;


    //  console.log('create user');
    // create user

    await sendForgetMailX(email);
    console.log('okkkkkkk')

    // const { newUser, token } = await createUser(userdetails);


    res.status(200).json({
        message: "OTP sent to your email",
        email, // useful for frontend to show
    });


}

async function otpCheck(req, res) {

    try {
        const { email, otp,pas } = req.body;
        const {newUser,token}=await verifyOtp(email,password, otp);
        res.status(200).cookie('jwt', token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day,
            httpOnly: true,
            secure: false, // Use true if your site uses HTTPS
            sameSite: "lax", // Required for cross-origin cookies
        }).json({
            message: "User registerd succesfully ",
            user:newUser
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error verifying OTP" });


    }
}

async function profileView(req, res) {
    const cur_user = req.user;
    try {
        const userZ = User.findOne({ id: cur_user });
        if (userZ) {
            throw new customError('user is invalid', 400);
        }

        res.status(200).json({ profile: userZ, success: true });
    } catch (error) {
        console.log(error)
    }
}

// module.exports.forgetPassword=responseHandler(forgetPassword);
// module.exports.register=responseHandler(register);
// module.exports.login=responseHandler(login);

module.exports = {
    register: responseHandler(register),
    login: responseHandler(login),
    forgetPassword: responseHandler(forgetPassword),
    resetPassword: responseHandler(resetPassword),
    jobSearch: responseHandler(jobSearch),
    JobDetail: responseHandler(JobDetail),
    verify: responseHandler(verify),
    otpCheck: responseHandler(otpCheck),
    profileView: responseHandler(profileView)
};
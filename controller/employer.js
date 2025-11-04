const User = require("../model/user");
const { createUser } = require("../services/createUser");
const Job=require('../model/job');
const { customError } = require("../utils/errorClass");
const {postJob}=require('../services/postJob');
const responseHandler = require("../utils/responseHandler");


async function createPost(req,res){
     
    await postJob(req.body,req.user);
    
    res.status(200).json({
        success:true,
        message:'Job created successfully!'
    })
    

   
}


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
        const profile={companyName,companyDescription,website,contactName,designation,industry,phone,address,city}
        const userDetails={email,password,role:'employer',profile}
       


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

module.exports = {
    createPost:responseHandler(createPost),
    register:responseHandler(register)
}
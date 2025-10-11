const Admin = require("../model/admin");
const Employer = require("../model/employer");
const Jobseeker = require("../model/job_seeker");
const User = require("../model/user");
const { tokenGen } = require("../utils/generateJWT_Token");
const { customError } = require("../utils/errorClass");

 async function createUser(userDetails){
    const { email, password,role,profile }=userDetails;
    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new customError('User already exists',409);
       
    }


    // create user
    const newUser = await User.create({ email: email, password: password});
    // await newUser.save();

    // role specific profile
    if (role == 'jobseeker') {
        const newJobSeeker = await Jobseeker.create({ user: newUser._id, fullName: profile.fullName})
    } else if (role == 'employer') {
        await Employer.create({
            user: newUser._id,
            companyName: profile.companyName,
            companyWebsite: profile.companyWebsite,
            industry: profile.industry,
            contactPerson: profile.contactPerson,
            phone: profile.phone,
            companyLogoUrl: profile.companyLogoUrl
        })
    } else if (role === 'admin') {
        await Admin.create({ user: newUser._id, fullName: profile.fullName, phone: profile.phone });
    }

    const token=tokenGen(newUser._id);
      return { newUser, token };
}


module.exports = { createUser };
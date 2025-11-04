const Admin = require("../model/admin");
const Employer = require("../model/employer");
const Jobseeker = require("../model/job_seeker");
const User = require("../model/user");
const { tokenGen } = require("../utils/generateJWT_Token");
const { customError } = require("../utils/errorClass");

 async function createUser(userDetails){
    console.log('userdetails: ',userDetails)
    const { email, password,role,profile }=userDetails;
    let userExists = null;
    try {
        userExists=await User.findOne({ email })
        
    } catch (error) {
        console.log(error)
     
    }
   
    if (userExists) {
        console.log('userexists ',userExists);
        console.log('create user ---');
        throw new customError('User already exists',409);
    }

    //  console.log('create user');
    // create user

     await sendForgetMail(email);

    const newUser = await User.create({ email: email, password: password,role:userDetails.role});
      console.log('create newuser',newUser);
    // await newUser.save();

    // role specific profile
    if (role == 'jobseeker') {
        const newJobSeeker = await Jobseeker.create({ user: newUser._id, firstName: profile.firstName,lastName:profile.lastName})
        console.log('job -seeker:',newJobSeeker);
    } else if (role == 'employer') {
        const emp=await Employer.create({
            user: newUser._id,
            companyName: profile.companyName,
            companyWebsite: profile.website,
            companyDescription:profile.companyDescription,
            companyCity:profile.city,
            companyAddress:profile.address,
            industry: profile.industry,
            Designation:profile.designation,
            Name: profile.contactName,
            phone: profile.phone,
        })
        console.log('emp:',emp);
    } else if (role === 'admin') {
        await Admin.create({ user: newUser._id, fullName: profile.fullName, phone: profile.phone });
    }

    const token=tokenGen(newUser._id);
      return { newUser, token };
}


module.exports = { createUser };
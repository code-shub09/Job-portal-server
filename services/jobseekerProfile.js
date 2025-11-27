const Jobseeker = require("../model/job_seeker");
const User = require("../model/user");
const { customError } = require("../utils/errorClass");


async function profile_addWork(userId, experienceDetails) {
    let { company, role, workFrom, workTill, currentlyWorking, salary, responsibilities
    } = experienceDetails;

    const candidate = await Jobseeker.findOne({ user: userId });
       
    if (!candidate) throw new customError("Jobseeker profile not found", 404);
    //  console.log('candiate :', candidate);
    if (currentlyWorking) {
        
        workTill = { month: null, year: null };
        console.log('cand :', candidate);
    }
    //  console.log('cand :', candidate);
    candidate.WorkExperience.push({ companyName: company, designation: role, workFrom: workFrom, workTill: workTill, currentlyWorking: currentlyWorking, currentCTC: salary, description: responsibilities });
    await candidate.save();
    console.log('candiate :', candidate);
    return candidate.WorkExperience
}

async function profile_addSocialLink(socail,link,userId){
    const candidate=  await Jobseeker.findOne({ user: userId });
    if (!candidate) throw new customError("Jobseeker profile not found", 404);

    candidate.socialLinks[socail]=link;
    await candidate.save();
    console.log('can social:',candidate);


}

module.exports = { profile_addWork ,profile_addSocialLink};
const Employer = require('../model/employer');
const Job=require('../model/job');
const { customError } = require('../utils/errorClass');
async function postJob(jobDetails,userX){
    try {
        console.log('userx:',userX._id);
        const empX=await Employer.findOne({user:userX._id});

    // console.log('job details:',jobDetails);
    const {title,description,jobType,minExperience,department,salaryMin,salaryMax,skillsRequired}=jobDetails;

    const new_job=await Job.create({title:title,description:description,jobType:jobType,department:department,minExperience:minExperience,salaryRange:{min:salaryMin,max:salaryMax},postedBy:empX._id,skillsRequired:skillsRequired});
     console.log('new job details:',new_job);
    return;  
    } catch (error) {

        console.log('error: ',error);
       throw new customError('server error',500) ;
    }  
}

module.exports = { postJob };

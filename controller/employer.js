const User = require("../model/user");
const { createUser } = require("../services/createUser");
const Job = require('../model/job');
const { customError } = require("../utils/errorClass");
const { postJob } = require('../services/postJob');
const responseHandler = require("../utils/responseHandler");
const Application = require("../model/application");
const Employer = require("../model/employer");
const { default: mongoose } = require("mongoose");
const Jobseeker = require("../model/job_seeker");
const { mailHandler } = require("../utils/globalMailHandler");
const { shortlistTemplate } = require("../utils/htmlTemplatesX");


async function createPost(req, res) {

    await postJob(req.body, req.user);

    res.status(200).json({
        success: true,
        message: 'Job created successfully!'
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
    const profile = { companyName, companyDescription, website, contactName, designation, industry, phone, address, city }
    const userDetails = { email, password, role: 'employer', profile }



    const { newUser, token } = await createUser(userDetails);


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

// Method	                        Runs	           Speed
// await a; await b; await c;	    Sequential	       Slow
// await Promise.all([a, b, c])	    Parallel	       Fast

async function getAllJobPost(req, res) {

    const emp = await Employer.findOne({ user: req.user._id });
    const AllJob = await Job.find({ postedBy: emp }).lean();
    console.log('all job:', AllJob);


    async function helper(job, index) {
        console.log('e')
        const totalApplications = await Application.countDocuments({ jobID: job._id });
        console.log('tot', totalApplications);
        const shortlistedApplications = await Application.countDocuments({ jobID: job._id, status: "shortlisted" });
        const InterviewApplications = await Application.countDocuments({ jobID: job._id, status: "interview" });

        // as we are not returning promise manually so , internally it will get wraped in promise with resolve
        return {
            ...job,
            stats: {
                totalApplications,
                shortlistedApplications,
                InterviewApplications
            }
        }
    };
    // basically Promise.all(arr_of_Promise), 

    const enrichedJobs = await Promise.all(
        // helper function will return promise for each jobPost 
        AllJob.map(helper)

    )

    // console.log('all job:', enrichedJobs);
    res.status(200).json({
        success: true,
        jobPosts: enrichedJobs
    })
}

async function closeJob(req, res) {
    console.log('close job-----')
    const jobId = req.params.id;
    const response = await Job.findByIdAndUpdate(jobId, { status: 'closed' });
    res.status(200).json({
        success: true,
        message: 'closed job successfully!!!'
    })
}

async function deleteJob(req, res) {
    const jobId = req.params.id;
    const response = await Job.findByIdAndDelete(jobId);
    console.log('resp', response)
    res.status(200).json({
        success: true,
        message: 'Deleted job successfully!!!'
    })
}


// async function getSingleJobDetails(req, res) {
//     console.log('single job')

//     const job = await Job.findById(req.params.id).lean();

//     if (!job) {
//         return res.status(404).json({ success: false, message: "Job not found" });
//     }

//     // Fetch stats
//     const totalApplications = await Application.countDocuments({ jobID: job._id });
//     const shortlisted = await Application.countDocuments({ jobID: job._id, status: "shortlisted" });
//     const interviews = await Application.countDocuments({ jobID: job._id, status: "interview" });
//     job.stats = {
//         totalApplications,
//         shortlistedApplications: shortlisted,
//         InterviewApplications: interviews,
//     };
//      const latestApplications = await Application.find({ jobID: req.params.id })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate("applicant", "email");

//     job.latestApplications=latestApplications;
//      console.log('single job',job)
//     // 3️⃣ Response

//     res.status(200).json({ success: true, job });

// };
// async function getSingleJobDetails(req, res) {
//     const jobId = req.params.id;

//     // 1️⃣ Find the job
//     const job = await Job.findById(jobId).lean();
//     if (!job) return res.status(404).json({ success: false, message: "Job not found" });

//     // 2️⃣ Stats (still fast, keep as is)
//     const totalApplications = await Application.countDocuments({ jobID: jobId });
//     const shortlisted = await Application.countDocuments({ jobID: jobId, status: "shortlisted" });
//     const interviews = await Application.countDocuments({ jobID: jobId, status: "interview" });

//     job.stats = {
//         totalApplications,
//         shortlistedApplications: shortlisted,
//         InterviewApplications: interviews
//     };

//     // 3️⃣ Fetch latest applications + applicant + jobseeker in ONE query
//     const latestApplications = await Application.aggregate([
//         { $match: { jobID: new mongoose.Types.ObjectId(jobId) } },
//         { $sort: { createdAt: -1 } },
//         { $limit: 5 },

//         // Join User
//         {
//             $lookup: {
//                 from: "users",
//                 localField: "applicant",
//                 foreignField: "_id",
//                 as: "user"
//             }
//         },
//         { $unwind: "$user" },

//         // Join Jobseeker
//         {
//             $lookup: {
//                 from: "jobseekers",
//                 localField: "applicant",
//                 foreignField: "user",
//                 as: "jobseeker"
//             }
//         },
//         { $unwind: "$jobseeker" },

//         // Pick only useful fields
//         {
//             $project: {
//                 _id: 1,
//                 status: 1,
//                 coverLetter: 1,
//                 phoneNo: 1,
//                 createdAt: 1,
//                 timeline: 1,
//                 resume: 1,
//                 experience:1,
//                 educationSnapshot:1,
//                 dates:1,
//                 applicant: {
//                     _id: "$user._id",
//                     email: "$user.email",
//                     firstName:"$jobseeker.firstName",
//                     lastName:"$jobseeker.lastName",
//                     profilePic: "$jobseeker.profilePic",
//                 }
//             }
//         }
//     ]);

//     job.latestApplications = latestApplications;

//     res.status(200).json({
//         success: true,
//         job
//     });
// }

async function getSingleJobDetails(req, res) {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).lean();
    if (!job)
        return res.status(404).json({ success: false, message: "Job not found" });

    // ------------------------------
    // Stats
    // ------------------------------
    const totalApplications = await Application.countDocuments({ jobID: jobId });
    const shortlisted = await Application.countDocuments({ jobID: jobId, status: "shortlisted" });
    const interviews = await Application.countDocuments({ jobID: jobId, status: "interview" });

    job.stats = {
        totalApplications,
        shortlistedApplications: shortlisted,
        InterviewApplications: interviews
    };

    // ------------------------------
    // Latest 5 Applications
    // ------------------------------
    const latestApplications = await Application.aggregate([
        { $match: { jobID: new mongoose.Types.ObjectId(jobId) } },
        { $sort: { createdAt: -1 } },
        { $limit: 5 },

        // Join user + jobseeker
        {
            $lookup: {
                from: "users",
                localField: "applicant",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },

        {
            $lookup: {
                from: "jobseekers",
                localField: "applicant",
                foreignField: "user",
                as: "jobseeker"
            }
        },
        { $unwind: "$jobseeker" },

        {
            $project: {
                _id: 1,
                status: 1,
                coverLetter: 1,
                phoneNo: 1,
                createdAt: 1,
                timeline: 1,
                resume: 1,
                experience: 1,
                educationSnapshot: 1,
                dates: 1,
                applicant: {
                    _id: "$user._id",
                    email: "$user.email",
                    firstName: "$jobseeker.firstName",
                    lastName: "$jobseeker.lastName",
                    profilePic: "$jobseeker.profilePic",
                }
            }
        }
    ]);

    job.latestApplications = latestApplications;

    // ------------------------------
    // Full Shortlisted Applications
    // ------------------------------
    const shortlistedApplicants = await Application.aggregate([
        { $match: { jobID: new mongoose.Types.ObjectId(jobId), status: "shortlisted" } },

        {
            $lookup: {
                from: "users",
                localField: "applicant",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },

        {
            $lookup: {
                from: "jobseekers",
                localField: "applicant",
                foreignField: "user",
                as: "jobseeker"
            }
        },
        { $unwind: "$jobseeker" },

        {
            $project: {
                _id: 1,
                status: 1,
                phoneNo: 1,
                resume: 1,
                experience: 1,
                applicant: {
                    firstName: "$jobseeker.firstName",
                    lastName: "$jobseeker.lastName",
                    profilePic: "$jobseeker.profilePic",
                    email: "$user.email"
                }
            }
        }
    ]);

    job.shortlistedApplicants = shortlistedApplicants;

    res.status(200).json({ success: true, job });
}


// controllers/jobController.js


// exports.getJobWithLatestApplications = async (req, res) => {
//   try {
//     const jobId = req.params.id;

//     // 1️⃣ Fetch Job
//     const job = await Job.findById(jobId);
//     if (!job) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     // 2️⃣ Fetch latest 5 applications for this job
//     const latestApplications = await Application.find({ jobID: jobId })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate("applicant", "name email profilePhoto experience totalExperienceYears");


//     // 3️⃣ Response
//     return res.json({
//       success: true,
//       job,
//       latestApplications
//     });

//   } catch (err) {
//     console.error("Error fetching job details:", err);
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
// async function getAllApplicaion(req,res) {
//     const jobId=req.params.id;
//     console.log('jibid',jobId);

//     const applications=await Application.find({jobID:jobId}).populate('applicant');
//     console.log('applicaion',applications);
    
//     res.status(200).json({
//         success:true,
//         applications:applications
//     })
    
// }



async function getAllApplicaion(req, res) {
 
    const jobId = req.params.id;
    // console.log(jobId)

    // 1️⃣ Check if job exists
    const jobExists = await Job.exists({ _id: jobId });
    
    if (!jobExists) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    
        // 3️⃣ Fetch latest applications + applicant + jobseeker in ONE query
    const applications = await Application.aggregate([
        { $match: { jobID: new mongoose.Types.ObjectId(jobId) } },
        { $sort: { createdAt: -1 } },
       

        // Join User
        {
            $lookup: {
                from: "users",
                localField: "applicant",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },

        // Join Jobseeker
        {
            $lookup: {
                from: "jobseekers",
                localField: "applicant",
                foreignField: "user",
                as: "jobseeker"
            }
        },
        { $unwind: "$jobseeker" },

        // Pick only useful fields
        {
            $project: {
                _id: 1,
                status: 1,
                coverLetter: 1,
                phoneNo: 1,
                createdAt: 1,
                timeline: 1,
                resume: 1,
                experience:1,
                educationSnapshot:1,
                dates:1,
                applicant: {
                    _id: "$user._id",
                    email: "$user.email",
                    firstName:"$jobseeker.firstName",
                    lastName:"$jobseeker.lastName",
                    profilePic: "$jobseeker.profilePic",
                }
            }
        }
    ]);

    // console.log('app:',applications);

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });

  
}

async function shortlistApplication(req,res) {
    console.log("SHORTLIST ID:", req.params.id);
    const applicationId = req.params.id;

    const { note, notify } = req.body;

    // 1️⃣ Find application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // 2️⃣ Prevent status conflict
    if (application.status === "shortlisted") {
      return res.status(400).json({
        success: false,
        message: "Candidate is already shortlisted",
      });
    }

    if (application.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Rejected candidates cannot be shortlisted",
      });
    }

    // 3️⃣ Update status
    application.status = "shortlisted";
    application.dates.shortlistedAt = new Date();

    // 4️⃣ Add timeline entry
    application.timeline.push({
      status: "shortlisted",
      message: "Candidate has been shortlisted by recruiter",
      date: new Date(),
    });

    // 5️⃣ Save recruiter note (optional)
    if (note) {
      application.recruiterNotes = note;
    }

    // Save application
    await application.save();
    console.log('updated application',application);

    // 6️⃣ Email notification to candidate (optional)
    if (notify) {
      const jobseeker = await Jobseeker.findOne({ user: application.applicant }).populate('user');
    //    console.log('short',jobseeker);
      if (jobseeker && jobseeker.user.email) {
        const receiverEmail=jobseeker.user.email;
        const subject= "You have been shortlisted!" ;
        const name=jobseeker.firstName +jobseeker.lastName;
        const htmlContent=shortlistTemplate(name);
        await mailHandler(receiverEmail,htmlContent,subject);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Candidate shortlisted successfully",
      application,
    });
}



module.exports = {
    createPost: responseHandler(createPost),
    register: responseHandler(register),
    getAllJobPost: responseHandler(getAllJobPost),
    closeJob: responseHandler(closeJob),
    deleteJob: responseHandler(deleteJob),
    getSingleJobDetails:responseHandler(getSingleJobDetails),
    getAllApplicaion:responseHandler(getAllApplicaion),
    shortlistApplication:responseHandler(shortlistApplication)
}


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
const Jobseeker = require("../model/job_seeker");
const { profile_addWork, profile_addSocialLink } = require("../services/jobseekerProfile");
const { uploadResumeToCloudinary } = require("../middelware/resumeUpload");
const Application = require("../model/application");
const { url } = require("../config/cloud2");
const { application } = require("express");




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

async function login(req, res) {

    const token = await userLogin(req.body);
    console.log('token is good res')

    res.status(200).cookie('jwt', token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day,
        httpOnly: true,
        secure: false, // Use true if your site uses HTTPS
        sameSite: "lax", // Required for cross-origin cookies
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
        const { email, otp, password, firstName, lastName } = req.body;
        console.log('otp body:', req.body);
        const { newUser, token } = await verifyOtp(email, password, otp, firstName, lastName);
        res.status(200).cookie('jwt', token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day,
            httpOnly: true,
            secure: false, // Use true if your site uses HTTPS
            sameSite: "lax", // Required for cross-origin cookies
        }).json({
            message: "User registerd succesfully ",
            user: newUser
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error verifying OTP" });


    }
}

async function profileView(req, res) {
    const cur_user = req.user;

    const userZ = await Jobseeker.findOne({ user: cur_user._id }).populate({
        path: "user",
        select: "email role" // ✅ Don’t send password or unnecessary fields
    })
    // console.log('user profile--:', cur_user);
    // console.log('user view pro:', userZ);
    if (!userZ) {
        throw new customError('user not found', 404);
    }

    res.status(200).json({ profile: userZ, success: true });

}

async function addGraduation(req, res) {

    const userId = req.user._id;
    const { courseName, specialization, gradeSystem, startYear, endYear, courseType } = req.body;

    const candidate = await Jobseeker.findOne({ user: userId });
    if (!candidate) throw new customError("Jobseeker not found", 404);

    candidate.education.graduation = {
        courseName,
        specialization,
        gradeSystem,
        courseDuration: { startYear: startYear, endYear: endYear },
        courseType: courseType
    }

    await candidate.save();
    res.status(200).json({
        success: true,
        message: "Graduation details added successfully",
        graduation: candidate.education.graduation,
    });

}

// module.exports.forgetPassword=responseHandler(forgetPassword);
// module.exports.register=responseHandler(register);
// module.exports.login=responseHandler(login);
async function addWorkexperience(req, res) {
    const userId = req.user._id;

    console.log('add wo - ', userId);

    const canWorkExp = await profile_addWork(userId, req.body);
    res.status(200).json({
        success: true,
        message: "Experience added successfully",
        experience: canWorkExp,
    });
}
async function checkEmail(req, res) {
    const { email } = req.query;
    const existingUser = await User.findOne({ email });
    console.log('check emails', existingUser);
    if (existingUser) {
        return res.status(200).json({ exists: true, message: "Email already registered" });
    }

    res.status(200).json({ exists: false, message: "Email is available" });
}

async function addSocailLink(req, res) {
    // const { email } = req.query;
    const { social, link } = req.body;
    const userId = req.user._id;

    console.log('add wo - ', userId);

    const canWorkExp = await profile_addSocialLink(social, link, userId);
    res.status(200).json({
        success: true,
        message: `${social} added successfully`,
        experience: canWorkExp,
    });
}

async function uploadPhoto(req, res) {
    console.log('uplaod', req.file);

    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Cloudinary file info
    const imageUrl = req.file.path;

    // ✅ Update DB (assuming user ID is in req.user._id)
    const cand = await Jobseeker.findOneAndUpdate(
        { user: req.user._id },
        { profilePic: imageUrl },
        { new: true }
    );
    console.log('cand:', cand);

    return res.json({
        success: true,
        message: "Profile photo updated!",
        imageUrl,
    });

}

async function updateCareerPreferences(req, res) {

    const userId = req.user.id; // from auth middleware

    const { roles, location, minctc, maxctc } = req.body;
    // console.log('body: ',roles, locationX, minctc, maxctc);

    if (!roles || roles.length === 0 || !location || !minctc || !maxctc) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    // Update jobseeker record
    const updated = await Jobseeker.findOneAndUpdate(
        { user: userId },
        {
            careerPreferences: { roles: roles, location: location, minctc: minctc, maxctc: maxctc }
        },
        { new: true }
    );

    if (!updated) {
        return res.status(404).json({ message: "Jobseeker profile not found" });
    }

    console.log('updated', updated.careerPreferences);
    res.status(200).json({
        message: "Career preferences updated successfully",
        data: updated,
    });

}

// async function uploadResumeFile(req, res) {
//     console.log("🟦 Multer received file:");
//     console.log("req.file:", req.file);

//     if (!req.file) {
//         console.log('error')
//         throw new customError('No file uploaded', 400);
//     }

//     // Upload to Cloudinary
//     const result = await uploadResumeToCloudinary(
//         req.file.buffer,
//         req.file.originalname
//     );

//     console.log('r4rsume controller-', result);



//     // ✅ Update DB (assuming user ID is in req.user._id)
//     const cand = await Jobseeker.findOneAndUpdate(
//         { user: req.user._id },
//         {
//             resumeFile: {
//                 resume: result.secure_url,
//                 resumeName: req.file.originalname,
//                 size: req.file.size,       // ⭐ SIZE FROM MULTER (bytes)
//                 uploadedAt: new Date(),    // ⭐ TIMESTAMP
//             }
//         },
//         { new: true }
//     );
//     console.log('cand:', cand);

//     return res.status(200).json({
//         success: true,
//         message: "Resume uploaded successfully",
//         resumeFile: cand.resumeFile
//     });
// }

async function uploadResumeFile(req, res) {
    console.log("🟦 Multer received file:", req.file);

    if (!req.file) {
        throw new customError("No file uploaded", 400);
    }

    // ⭐ Upload to Cloudinary
    const uploaded = await uploadResumeToCloudinary(
        req.file.buffer,
        req.file.originalname
    );

    console.log("📄 Cloudinary Upload Result:", uploaded);

    // ⭐ Save correct structure in DB
    const updated = await Jobseeker.findOneAndUpdate(
        { user: req.user._id },
        {
            resumeFile: {
                url: uploaded.secure_url,           // correct
                public_id: uploaded.public_id,       // needed for delete
                fileName: req.file.originalname,     // original file name
                fileSize: req.file.size,             // size in bytes
                uploadedAt: new Date(),              // timestamp
            }
        },
        { new: true }
    );

    return res.status(200).json({
        success: true,
        message: "Resume uploaded successfully",
        resumeFile: updated.resumeFile
    });
}


// async function createApplication(req, res) {
//     console.log("🟦 Multer received file:");

//     const { jobId, phone, isFresher, coverLetter, noticePeriod, experience, ctc, resume_type } = req.body;



//     let resumeData = null;

//     // ⭐ CASE 1: New resume upload
//     if (resume_type === "upload") {
//         if (!req.file) {
//             throw new customError('No file uploaded', 400);
//         }

//         const uploaded = await uploadResumeToCloudinary(
//             req.file.buffer,
//             req.file.originalname
//         );

//         resumeData = {
//             url: uploaded.secure_url,
//             public_id: uploaded.public_id,
//             fileName: req.file.originalname,
//             fileSize: req.file.size
//         };

//         console.log("📄 New resume uploaded:", resumeData);
//     }

//     if (resume_type === 'existing') {

//         const jobseekerX = await Jobseeker.findOne({ user: req.user._id });

//         // console.log('create application:', jobseekerX);
//         resumeData = {
//             url: jobseekerX.resumeFile.url,
//             public_id: jobseekerX.resumeFile.public_id,
//             fileName: jobseekerX.resumeFile.fileName,
//             fileSize: jobseekerX.resumeFile.fileSize,
//         }
//         // console.log('existing type:',resumeData)

//     }

//     console.log('resume info:', req.user._id);

//     // ⭐ Build experience object
//     const experienceData = {
//         isFresher: isFresher === "true",
//         totalExperienceYears: isFresher === "true" ? 0 : Number(experience),
//         currentCTC: isFresher === "true" ? 0 : Number(ctc),
//         expectedCTC: null,
//         noticePeriodDays: Number(noticePeriod) || 0
//     };

//     const newApplication = await Application.create({
//         jobID: jobId, applicant:req.user._id,phoneNo: phone, experience: experienceData, coverLetter: coverLetter, resume: resumeData,
//         timeline: [
//             { status: "applied", message: "Application submitted" }
//         ]
//     })

//     console.log('r4rsume controller-', newApplication);
//     return res.status(201).json({
//         success: true,
//         message: "Application submitted successfully",
//         application: newApplication
//     });
// }
const createApplication = async (req, res) => {
    console.log("🟦 Multer received file:");

    const {
        jobId,
        phone,
        isFresher,
        coverLetter,
        noticePeriod,
        experience,
        ctc,
        resume_type,

        // fresher education fields
        education_courseName,
        education_specialization,
        education_collegeName,
        education_graduationYear
    } = req.body;
    console.log('body:', req.body);

    let resumeData = null;

    //────────────────────────────────────────────
    // ⭐ CASE 1: New Resume Upload
    //────────────────────────────────────────────
    if (resume_type === "upload") {
        if (!req.file) {
            throw new customError("No file uploaded", 400);
        }

        const uploaded = await uploadResumeToCloudinary(
            req.file.buffer,
            req.file.originalname
        );

        resumeData = {
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
            fileName: req.file.originalname,
            fileSize: req.file.size
        };

        console.log("📄 New resume uploaded:", resumeData);
    }

    //────────────────────────────────────────────
    // ⭐ CASE 2: Use Existing Resume from Profile
    //────────────────────────────────────────────
    if (resume_type === "existing") {
        const jobseeker = await Jobseeker.findOne({ user: req.user._id });

        if (!jobseeker || !jobseeker.resumeFile?.url) {
            throw new customError("No existing resume found", 400);
        }

        resumeData = {
            url: jobseeker.resumeFile.url,
            public_id: jobseeker.resumeFile.public_id,
            fileName: jobseeker.resumeFile.fileName,
            fileSize: jobseeker.resumeFile.fileSize,
        };
    }

    //────────────────────────────────────────────
    // ⭐ Experience Details (For Experienced)
    //────────────────────────────────────────────
    const experienceData = {
        isFresher: isFresher === "true",
        totalExperienceYears: isFresher === "true" ? 0 : Number(experience),
        currentCTC: isFresher === "true" ? 0 : ctc, // ctc already formatted
        expectedCTC: null,
        noticePeriodDays: Number(noticePeriod) || 0
    };

    //────────────────────────────────────────────
    // ⭐ Education Snapshot (Only for Fresher)
    //────────────────────────────────────────────
    let educationSnapshot = null;

    if (isFresher === "true") {
        educationSnapshot = {
            courseName: education_courseName || "",
            specialization: education_specialization || "",
            collegeName: education_collegeName || "",
            graduationYear: Number(education_graduationYear) || null
        };
    }

    //────────────────────────────────────────────
    // ⭐ Create Application Document
    //────────────────────────────────────────────
    const newApplication = await Application.create({
        jobID: jobId,
        applicant: req.user._id,
        phoneNo: phone,
        coverLetter,
        resume: resumeData,

        experience: experienceData,
        educationSnapshot: educationSnapshot,

        timeline: [
            { status: "applied", message: "Application submitted" }
        ]
    });

    console.log("📌 Application Created:", newApplication);

    return res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        application: newApplication
    });
};


async function getJobseekerApplications(req, res) {

    const jobseekerId = req.user.id;
    const apps = await Application.find({ applicant: jobseekerId })
        .populate({
            path: "jobID",
            populate: {
                path: "postedBy",
                model: "Employer",
                select: "companyName companyLogoUrl"
            }
        })
        .exec();


    console.log('applications jobseeker:', apps);
    res.status(200).json({
        success: true,
        applications: apps
    });

};







// ------------------------------
// Helper: Convert DB timeline → UI-friendly timeline
// ------------------------------
function buildTimeline(application) {
    const order = ["applied", "viewed", "shortlisted", "interview", "rejected", "hired"];
    const currentIndex = order.indexOf(application.status);

    return order.map((stage, index) => {
        const stageEvent = application.timeline.find(t => t.status === stage);

        return {
            title:
                stage === "applied" ? "Application Submitted" :
                    stage === "viewed" ? "Viewed by Recruiter" :
                        stage === "shortlisted" ? "Shortlisted" :
                            stage === "interview" ? "Interview Scheduled" :
                                stage === "rejected" ? "Rejected" :
                                    stage === "hired" ? "Hired" :
                                        "Updated",

            desc: stageEvent?.message || "",

            date: stageEvent?.date || "Pending",

            status:
                index < currentIndex ? "completed" :
                    index === currentIndex ? "current" :
                        "pending",

            icon:
                stage === "applied" ? "check" :
                    stage === "viewed" ? "eye" :
                        stage === "shortlisted" ? "star" :
                            stage === "interview" ? "calendar" :
                                stage === "rejected" ? "close" :
                                    "trophy"
        };
    });
}

// ------------------------------
// GET /jobseeker/application/:appId
// ------------------------------
async function getSingleApplication(req, res) {
    console.log('hello applicaton')
    const { appId } = req.params;

    // Application must belong to logged-in user
    const application = await Application
        .findOne({ _id: appId, applicant: req.user._id })
        .populate("jobID") // get job details
        .populate("applicant", "firstName lastName email phone"); // basic user info

    if (!application) {
        return res.status(404).json({
            success: false,
            message: "Application not found"
        });
    }

    // Get recommended jobs (same skills)
    const recommendedJobs = await Job.find({
        _id: { $ne: application.jobID._id },
        skills: {
            $in: application.jobID.skillsRequired
        }
    }).limit(5);

    return res.status(200).json({
        success: true,
        application: {
            // Basic
            _id: application._id,
            status: application.status,
            appliedAt: application.dates.appliedAt,

            // Job details
            job: {
                id: application.jobID._id,
                title: application.jobID.title,
                companyName: application.jobID.companyName,
                companyLogo: application.jobID.companyLogo,
                location: application.jobID.location,
                salaryRange: application.jobID.salaryRange,
                type: application.jobID.jobType,
                skills: application.jobID.skills
            },

            // Resume & Cover Letter
            resume: application.resume,
            coverLetter: application.coverLetter,

            // Personal Info (Snapshot stored from User)
            personalInfo: {
                name: `${application.applicant.firstName} ${application.applicant.lastName}`,
                email: application.applicant.email,
                phone: application.phoneNo
            },

            // Experience Snapshot
            experience: application.experience,

            // Education Snapshot
            education: application.educationSnapshot,

            // Timeline converted for UI
            timeline: buildTimeline(application),

            // Interview Details
            interview: application.interview,

            // Recommended Jobs
            recommendedJobs
        }
    });

};


module.exports = {
    register: responseHandler(register),
    login: responseHandler(login),
    forgetPassword: responseHandler(forgetPassword),
    resetPassword: responseHandler(resetPassword),
    jobSearch: responseHandler(jobSearch),
    JobDetail: responseHandler(JobDetail),
    verify: responseHandler(verify),
    otpCheck: responseHandler(otpCheck),
    profileView: responseHandler(profileView),
    addWorkexperience: responseHandler(addWorkexperience),
    checkEmail: responseHandler(checkEmail),
    addSocailLink: responseHandler(addSocailLink),
    uploadPhoto: responseHandler(uploadPhoto),
    uploadResumeFile: responseHandler(uploadResumeFile),
    createApplication: responseHandler(createApplication),
    updateCareerPreferences: responseHandler(updateCareerPreferences),
    getJobseekerApplications: responseHandler(getJobseekerApplications),
    getSingleApplication: responseHandler(getSingleApplication)
};
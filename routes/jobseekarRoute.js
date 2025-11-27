const express= require('express');
const router =express.Router();

// const { register, login ,forgetPassword, resetPassword} = require("../controller/UserController");

const { protect, authorize } = require('../middelware/authanticationMiddleware');
const { jobSearch, JobDetail, verify, otpCheck, profileView, addWorkexperience, checkEmail, addSocailLink, uploadPhoto, uploadResumeFile, createApplication, updateCareerPreferences, getJobseekerApplications, getSingleApplication } = require('../controller/UserController');
const { upload, uploadResume } = require('../config/cloud');
const { uploadResumePdf } = require('../middelware/resumeUpload');



router.get('/check-email',checkEmail);
router.post('/job-search',jobSearch);
router.get('/job-search/:id',JobDetail);
router.post('/verify',verify);
router.post('/verifyotp',otpCheck);
router.get('/profile',protect,authorize('jobseeker'),profileView);

router.post('/profile/addexperience',protect,authorize('jobseeker'),addWorkexperience);
router.post('/profile/career-preferences',protect,authorize('jobseeker'),updateCareerPreferences);
router.post('/profile/add-social-link',protect,authorize('jobseeker'),addSocailLink);
router.post('/profile/upload-photo',protect,authorize('jobseeker'),upload.single('profilePic'),uploadPhoto);
router.post('/profile/upload-resume',protect,authorize('jobseeker'),uploadResumePdf,uploadResumeFile);
router.get('/applications',protect,authorize('jobseeker'),getJobseekerApplications);
router.post('/job-apply',protect,authorize('jobseeker'),uploadResumePdf,createApplication);
router.get('/application/:appId',protect,authorize('jobseeker'),getSingleApplication);
module.exports = router;
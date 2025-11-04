const express= require('express');
const router =express.Router();

// const { register, login ,forgetPassword, resetPassword} = require("../controller/UserController");

const { protect, authorize } = require('../middelware/authanticationMiddleware');
const { jobSearch, JobDetail, verify, otpCheck, profileView } = require('../controller/UserController');




router.post('/job-search',jobSearch);
router.get('/job-search/:id',JobDetail);
router.post('/verify',verify);
router.post('/verifyotp',otpCheck);
router.get('/profile',protect,authorize('jobseeker'),profileView);


module.exports = router;
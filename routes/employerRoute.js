const express= require('express');
const router =express.Router();

// const { register, login ,forgetPassword, resetPassword} = require("../controller/UserController");
const {createPost,register, getAllJobPost, closeJob, deleteJob, getSingleJobDetails, getAllApplicaion, shortlistApplication} = require("../controller/employer");
const { protect, authorize } = require('../middelware/authanticationMiddleware');
const { jobSearch } = require('../controller/UserController');




router.post('/register',register);
router.post('/post-job',protect,authorize('employer'),createPost);
router.post('/job-search',jobSearch)
router.get('/all-jobposts',protect,authorize('employer'),getAllJobPost);
router.patch('/job/close/:id',protect,authorize('employer'),closeJob);
router.delete('/job/delete/:id',protect,authorize('employer'),deleteJob);

router.get('/job/:id',protect,authorize('employer'),getSingleJobDetails);
router.get('/job/all-application/:id',protect,authorize('employer'),getAllApplicaion);
router.post('/job/application/shortlist/:id',protect,authorize('employer'),shortlistApplication);
module.exports = router;
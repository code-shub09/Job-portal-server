const express= require('express');
const router =express.Router();

// const { register, login ,forgetPassword, resetPassword} = require("../controller/UserController");
const {createPost,register} = require("../controller/employer");
const { protect, authorize } = require('../middelware/authanticationMiddleware');
const { jobSearch } = require('../controller/UserController');



router.post('/register',register);
router.post('/post-job',protect,authorize('employer'),createPost);
router.post('/job-search',jobSearch)


module.exports = router;
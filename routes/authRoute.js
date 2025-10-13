const express= require('express');
const router =express.Router();

// import { register ,login} from "../controller/UserController";
const { register, login ,forgetPassword, resetPassword} = require("../controller/UserController");

router.post('/register',register);

router.post('/login',login);
router.post('/forget-password',forgetPassword)
router.post('/reset-password/:token',resetPassword);

module.exports = router;
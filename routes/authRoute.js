const express= require('express');
const router =express.Router();

// import { register ,login} from "../controller/UserController";
const { register, login } = require("../controller/UserController");

router.post('/register',register);

router.post('/login',login);


module.exports = router;
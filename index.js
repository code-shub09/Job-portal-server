const express=require('express');
const app=express();
// const mongoose = require("mongoose");
const cookie_parser = require('cookie-parser');
const db=require('./config/database');
db();
const authRoute= require('./routes/authRoute');

require('dotenv').config();
// parsing json data
app.use(express.json());



// printing all url request
app.use((req,res,next)=>{
    console.log(`[${req.method}] ${req.url}`);
    next();
});

app.use('/auth',authRoute);

app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
});





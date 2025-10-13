const express=require('express');
const app=express();
const cors = require('cors');
// const mongoose = require("mongoose");
const cookie_parser = require('cookie-parser');
const db=require('./config/database');
db();
const authRoute= require('./routes/authRoute');

require('dotenv').config();
// parsing json data
app.use(express.json());

// Simplified CORS configuration
const allowedOrigins = [
    "http://localhost:5173",
    "https://job-portal-frontend-rosy-beta.vercel.app"


   
];

const corsOptions = {
    origin: (origin, callback) => {
        console.log("Request Origin:", origin);
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// printing all url request
app.use((req,res,next)=>{
    console.log(`[${req.method}] ${req.url}`);
    next();
});

app.use('/auth',authRoute);

app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
});





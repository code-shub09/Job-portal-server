import mongoose from "mongoose";



const JobSchema= new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
      },
      description: {
        type: String,
        required: [true, "Job description is required"],
      },
      requirements: [
        {
          type: String,
        },
      ],
      location: {
        type: String,
        required: true,
      },
      jobType: {
        type: String,
        enum: ["full-time", "part-time", "internship", "contract", "remote"],
        default: "full-time",
      },
      salaryRange: {
        min: { type: Number },
        max: { type: Number },
      },
      experienceLevel: {
        type: String,
        enum: ["fresher", "junior", "mid-level", "senior"],
        default: "fresher",
      },
      department: {
        type:mongoose.Schema.Types.ObjectId,
        ref:""
      },
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // employer who posted the job
        required: true,
      },
      applicants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Application",
        },
      ],
      status: {
        type: String,
        enum: ["open", "closed"],
        default: "open",
      },

})
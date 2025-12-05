const mongoose = require('mongoose');



const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Job title is required"],
    trim: true,
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    enum: [
      "IT",
      "Engineering",
      "Finance",
      "Sales",
      "Marketing",
      "HR",
      "Design",
      "Operations",
      "Healthcare",
      "Education",
      "Other"
    ],
    index: true
  },
  location: {
    type: String,
    required: true,
    index: true, // for fast location search
  },

  jobType: {
    type: String,
    enum: ["full-time", "part-time", "internship", "contract", "remote"],
    default: "full-time",
    index: true
  },
  salaryRange: {
    min: { type: Number },
    max: { type: Number },
  },
  description: {
    type: String,
    required: [true, "Job description is required"],
  },
  requirements: {
    type: String
  }
  ,
  minExperience: {
    type: Number,

    index: true
  },
  skillsRequired: [{
    type: String
  }

  ],

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employer", // employer who posted the job
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

const Job = mongoose.model("Job", JobSchema);
module.exports = Job;
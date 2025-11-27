
// const mongoose = require('mongoose');


// const applicationSchema = new mongoose.Schema({
//     jobID: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Job',
//         reuired: true
//     },
//     applicant: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     status: {
//         type: String,
//         enum: [
//             "applied",
//             "viewed",
//             "shortlisted",
//             "interview",
//             "rejected",
//             "hired"
//         ],
//         default: "applied",
//     },
//     // Recruiter notes (visible only to employer)
//     recruiterNotes: {
//         type: String,
//     },
//     resume: {
//         url: String,
//         fileName: String,
//         fileSize: Number,
//     },
//     coverLetter: {
//         type: String,   // optional text
//     },
//     phoneNo: {
//         type: String,
//         required: true
//     },
//     experience: {
//         isFresher: {
//             type: Boolean,
//             default: false,
//         },

//         totalExperienceYears: {
//             type: Number,
//             default: 0, // For freshers 0
//         },

//         currentCTC: {
//             type: Number, // LPA or annual salary
//         },

//         expectedCTC: {
//             type: Number,
//         },

//         noticePeriodDays: {
//             type: Number, // 0 for fresher, or "Immediate"
//         },
//     },
//     timeline: [
//         {
//             status: String,
//             message: String,
//             date: { type: Date, default: Date.now },
//         },
//     ],
//     interview: {
//         type: { type: String, enum: ["online", "offline", "phone", null], default: null },
//         location: String,
//         meetingLink: String,
//         scheduledAt: Date,
//         notes: String,
//     },
//     dates: {
//         appliedAt: { type: Date, default: Date.now },
//         viewedAt: Date,
//         shortlistedAt: Date,
//         interviewDate: Date,
//     },

// }, { timestamps: true })

// const Application=mongoose.model('Application',applicationSchema);

// module.exports=Application;

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },

    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    status:{
        type: String,
        enum: ["applied", "viewed", "shortlisted", "interview", "rejected", "hired"],
        default: "applied",
    },

    recruiterNotes: { type: String },

    // Resume snapshot stored at time of application
    resume: {
        url: String,
        fileName: String,
        fileSize: Number,
    },

    coverLetter: { type: String },

    phoneNo: {
        type: String,
        required: true
    },

    // ------------------------------
    // EXPERIENCE DETAILS (EXPERIENCED USERS)
    // ------------------------------
    experience: {
        isFresher: { type: Boolean, default: false },

        totalExperienceYears: { type: Number, default: 0 },

        currentCTC: { type: String },   // Example: "6 LPA"
        expectedCTC: { type: String },  // Example: "8 LPA", optional

        noticePeriodDays: { type: Number }, // In days (0 for fresher)
    },

    // ------------------------------
    // EDUCATION SNAPSHOT (FRESHERS)
    // ------------------------------
    educationSnapshot: {
        courseName: { type: String },
        specialization: { type: String },
        collegeName: { type: String },
        graduationYear: { type: Number }
    },

    // TIMELINE
    timeline: [
        {
            status: String,
            message: String,
            date: { type: Date, default: Date.now },
        },
    ],

    // INTERVIEW DETAILS
    interview: {
        type: { type: String, enum: ["online", "offline", "phone", null], default: null },
        location: String,
        meetingLink: String,
        scheduledAt: Date,
        notes: String,
    },

    // STATUS CHANGE DATES
    dates: {
        appliedAt: { type: Date, default: Date.now },
        viewedAt: Date,
        shortlistedAt: Date,
        interviewDate: Date,
    },

}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;

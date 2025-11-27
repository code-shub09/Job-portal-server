// const { default: mongoose } = require("mongoose");

// const jobseekerSchmea = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     firstName: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     lastName: {
//         type: String,
//         required: true,
//         trim: true
//     },

//     profilePic: { type: String },
//     education: {
//         class12th: {
//             boardName: { type: String },
//             medium: { type: String },
//             percentage: { type: String },
//             passingYear: { type: String },
//         },
//         graduation: {
//             courseName: { type: String },
//             specialization: { type: String },
//             gradeSystem: { type: String, enum: ['cgpa', 'percentage'] },
//             courseDuration: { startYear: { type: Number }, endYear: { type: Number } },
//             courseType: { type: String, enum: ['Full', 'Part time', 'Correspondece'] },

//         }
//         , postgraduation: {
//             courseName: { type: String },
//             specailaisation: { type: String },
//             gradeSystem: { type: String, enum: ['cgpa', 'percentage'] },
//             courseDuration: { startYear: { type: Number }, endYear: { type: Number } },
//             courseType: { type: String, enum: ['Full', 'Part time', 'Correspondece'] },

//         }
//     },
//     WorkExperience: [{
//         companyName: { type: String },
//         designation: { type: String },
//         workFrom: { month: { type: String }, year: { type: Number } },
//         workTill: { month: { type: String }, year: { type: Number } },
//         currentlyWorking: { type: Boolean, default: false },
//         currentCTC: { type: String }, // 💰 Store salary if currently working
//         description: { type: String },
//     }],
//     socialLinks: {
//         linkedin: { type: String },
//         github: { type: String },
//         portfolio: { type: String }
//     },
//     phoneNo: { type: String },
//     isPhoneVerified: { type: Boolean, default: false },
//     about: { type: String },
//     prefferedRoles: [{ type: String }],
//     skills: [{ type: String }],
//     prefferedLocation: [{ type: String }],

//     resumeFile: {
//         url: { type: String },          // cloudinary URL
//         public_id: { type: String },    // important for deleting/updating
//         fileName: { type: String },     // original file name
//         fileSize: { type: Number },     // bytes
//         uploadedAt: { type: Date },     // timestamp
//     }




// })


// const Jobseeker = mongoose.model('Jobseeker', jobseekerSchmea);
// module.exports = Jobseeker

const { default: mongoose } = require("mongoose");

const jobseekerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    profilePic: { type: String },

    education: {
        class12th: {
            boardName: String,
            medium: String,
            percentage: String,
            passingYear: String,
        },
        graduation: {
            courseName: String,
            specialization: String,
            gradeSystem: { type: String, enum: ["cgpa", "percentage"] },
            courseDuration: {
                startYear: Number,
                endYear: Number,
            },
            courseType: { type: String, enum: ["Full", "Part time", "Correspondece"] },
        },
        postgraduation: {
            courseName: String,
            specailaisation: String,
            gradeSystem: { type: String, enum: ["cgpa", "percentage"] },
            courseDuration: {
                startYear: Number,
                endYear: Number,
            },
            courseType: { type: String, enum: ["Full", "Part time", "Correspondece"] },
        },
    },

    WorkExperience: [{
        companyName: String,
        designation: String,
        workFrom: { month: String, year: Number },
        workTill: { month: String, year: Number },
        currentlyWorking: { type: Boolean, default: false },
        currentCTC: String,
        description: String,
    }],

    socialLinks: {
        linkedin: String,
        github: String,
        portfolio: String,
    },

    phoneNo: String,
    isPhoneVerified: { type: Boolean, default: false },

    about: String,

    skills: [String],

    resumeFile: {
        url: String,
        public_id: String,
        fileName: String,
        fileSize: Number,
        uploadedAt: Date,
    },

    // ⭐⭐⭐ NEW ---- CAREER PREFERENCES ⭐⭐⭐
    careerPreferences: {
        roles: { type: [String], default: [] },          // max 3 on frontend
        location: { type: String, default: "" },
        minctc: { type: Number, default: null },         // LPA
        maxctc: { type: Number, default: null },         // LPA
    }

});

const Jobseeker = mongoose.model("Jobseeker", jobseekerSchema);
module.exports = Jobseeker;

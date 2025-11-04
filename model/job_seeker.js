const { default: mongoose } = require("mongoose");

const jobseekerSchmea = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },

    profilePic:{type:String},
    education: {
        class12th: {
            boardName: { type: String },
            medium: { type: String },
            percentage: { type: String },
            passingYear: { type: String },
        },
        graduation: {
            courseName: { type: String },
            specailaisation: { type: String },
            gradeSystem: { type: String, enum: ['cgpa', 'percentage'] },
            courseDuration: { startYear: { type: Number }, endYear: { type: Number } },
            courseType: { type: String, enum: ['Full', 'Part time', 'Correspondece'] },

        }
        , postgraduation: {
            courseName: { type: String },
            specailaisation: { type: String },
            gradeSystem: { type: String, enum: ['cgpa', 'percentage'] },
            courseDuration: { startYear: { type: Number }, endYear: { type: Number } },
            courseType: { type: String, enum: ['Full', 'Part time', 'Correspondece'] },

        }
    },
    WorkExperience: [{
        companyName: { type: String },
        designation: { type: String },
        workFrom: { month: { type: String }, year: { type: Number } },
        workTill: { month: { type: String }, year: { type: Number } },
        currentlyWorking: { type: Boolean, default: false },
        currentCTC: { type: String }, // 💰 Store salary if currently working
        description: { type: String },
    }],
    socialLinks: {
        linkedin: { type: String },
        github: { type: String },
        portfolio: { type: String }
    },
    phoneNo: { type: String },
    isPhoneVerified: { type: Boolean, default: false },
    about: { type: String },
    prefferedRoles: [{ type: String }],
    skills: [{ type: String }],
    prefferedLocation: [{ type: String }],
    resume: { type: String },


})


const Jobseeker = mongoose.model('Jobseeker', jobseekerSchmea);
module.exports = Jobseeker
const { default: mongoose } = require("mongoose");

const jobseekerSchmea = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    bio: { type: String },
    qualification: { type: String },
    skills: { type: String },
    location: { type: String },
    resume: { type: String },
    experience: [{
        company: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String }
    }],

})


const Jobseeker=mongoose.model('Jobseeker',jobseekerSchmea);
module.exports=Jobseeker
const dotenv = require("dotenv");
dotenv.config();

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");



console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "Loaded ✅" : "Missing ❌");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "job-portal", // Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});



const upload = multer({ storage });
// console.log('multer');

// const ResumeStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "job-portal/resume", // Cloudinary folder name
//     allowed_formats: ["pdf", "doc", "docx"],
//     resource_type: "raw",
//   },
// });

// const uploadResume=multer({storage:ResumeStorage});
module.exports = { cloudinary, upload };


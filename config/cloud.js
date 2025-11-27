const dotenv = require("dotenv");
dotenv.config();

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");


console.log("Cloudinary Config:");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
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

// const dotenv = require("dotenv");
// dotenv.config();

// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");

// console.log("Cloudinary Config:");
// console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API Key:", process.env.CLOUDINARY_API_KEY);
// console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "Loaded ✅" : "Missing ❌");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });


// // ================================
// // 📸 PROFILE PICTURE UPLOADER
// // ================================
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "job-portal/profile-pics",   // BETTER ORGANIZED
//     allowed_formats: ["jpg", "png", "jpeg"],
//     resource_type: "image",              // IMPORTANT FIX
//   },
// });
// const upload = multer({ storage });


// // ================================
// // 📄 RESUME UPLOADER
// // ================================
// const ResumeStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "job-portal/resume",
//     allowed_formats: ["pdf", "doc", "docx"],
//     resource_type: "auto",               // REQUIRED FOR DOCUMENTS
//     use_filename: true,         // KEEP ORIGINAL NAME
//     unique_filename: false,     // DO NOT REMOVE EXTENSION
//     filename_override: (req, file) => file.originalname,
//   },
// });
// const uploadResume = multer({ storage: ResumeStorage });


// module.exports = { cloudinary, upload, uploadResume };


// const dotenv = require("dotenv");
// dotenv.config();

// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");

// // CLOUDINARY CONFIG
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // =============== PROFILE PIC UPLOAD (IMAGE) ===============
// const profilePicStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "job-portal/profile-pics",
//     allowed_formats: ["jpg", "jpeg", "png"],
//     resource_type: "image",
//   },
// });
// const upload = multer({ storage: profilePicStorage });

// // =============== RESUME UPLOAD (PDF / DOCX) ===============
// const resumeStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "job-portal/resume",
//     resource_type: "raw",
//     allowed_formats: ["pdf", "doc", "docx"],
//     use_filename: true,          // KEEP original name
//     unique_filename: false,      // DO NOT rename or remove extension
//     public_id: (req, file) => {
//       return file.originalname;  // MUST include extension
//     }
//   },
// });

// const uploadResume = multer({ storage: resumeStorage });

// module.exports = { cloudinary, upload, uploadResume };


// const dotenv = require("dotenv");
// dotenv.config();

// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ==========================
// //  PROFILE PHOTO (image)
// // ==========================
// const profilePicStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "job-portal/profile-pics",
//     allowed_formats: ["jpg", "jpeg", "png"],
//     resource_type: "image",
//   },
// });
// const upload = multer({ storage: profilePicStorage });

// // ==========================
// //  RESUME UPLOAD (PDF/DOC)
// // ==========================
// const resumeStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "job-portal/resume",

//     // ⭐ IMPORTANT FIX
//     resource_type: "auto",

//     // ⭐ Allow PDFs and docs
//     allowed_formats: ["pdf", "doc", "docx"],

//     // ⭐ Keep original filename with extension
//     use_filename: true,
//     unique_filename: true,

//     // ⭐ REQUIRED for pdf/doc/docx to open correctly
//     public_id: (req, file) => file.originalname,
//   },
// });

// const uploadResume = multer({ storage: resumeStorage });

// module.exports = { cloudinary, upload, uploadResume };


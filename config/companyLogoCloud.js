const dotenv = require("dotenv");
dotenv.config();

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// // Profile picture storage
// const profilePicStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "job-portal/profile-pics",
//     allowed_formats: ["jpg", "png", "jpeg"],
//   },
// });
// const uploadProfilePic = multer({ storage: profilePicStorage });

// Company Logo storage
const companyLogoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "job-portal/company-logos",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const uploadCompanyLogo = multer({ storage: companyLogoStorage });

module.exports = {  uploadCompanyLogo };

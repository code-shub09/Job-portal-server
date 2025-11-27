const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloud2");


// ⭐ 1. Store file in RAM (NOT on disk)
const storage = multer.memoryStorage();

// ⭐ 2. Filter only PDF/DOC/DOCX
const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only PDF, DOC, and DOCX files allowed"), false);
  }

  cb(null, true);
};


// ⭐ 3. Multer upload middleware
const uploadResumePdf = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB
}).single("resume");


// ⭐ 4. Cloudinary upload stream
const uploadResumeToCloudinary = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const baseName = fileName.split(".")[0];     // dummy
    const ext = fileName.split(".").pop();        // pdf
    const uniqueName = Date.now() + "-" + baseName; // 123-dummy

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "job-portal/resumes",
        resource_type: "raw",
        public_id: uniqueName,
        format: ext  // ⭐ MUST: add pdf/doc/docx
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = { uploadResumePdf, uploadResumeToCloudinary };
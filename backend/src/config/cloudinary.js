const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Memory storage — files are buffered, then streamed to Cloudinary
const memoryStorage = multer.memoryStorage();

// Upload a buffer to Cloudinary and return the result
const uploadToCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });

// Per-resource multer middleware (memory storage)
const upload = multer({ storage: memoryStorage, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadBlog = multer({ storage: memoryStorage, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadTeam = multer({ storage: memoryStorage, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadCarousel = multer({ storage: memoryStorage, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadResume = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    cb(null, allowed.includes(file.mimetype));
  },
});

module.exports = { cloudinary, upload, uploadBlog, uploadTeam, uploadCarousel, uploadResume, uploadToCloudinary };

// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Create uploads directory if it doesn't exist
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     let folder = 'general/';
    
//     if (file.mimetype.startsWith('video/')) {
//       folder = 'videos/';
//     } else if (file.mimetype.startsWith('audio/')) {
//       folder = 'audios/';
//     } else if (file.mimetype === 'application/pdf') {
//       folder = 'pdfs/';
//     } else if (file.mimetype.startsWith('image/')) {
//       folder = 'images/';
//     }
    
//     const fullPath = path.join(uploadDir, folder);
//     if (!fs.existsSync(fullPath)) {
//       fs.mkdirSync(fullPath, { recursive: true });
//     }
    
//     cb(null, fullPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//   }
// });

// // File filter
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     'video/mp4', 'video/webm', 'video/ogg',
//     'audio/mpeg', 'audio/wav', 'audio/ogg',
//     'application/pdf',
//     'text/plain',
//     'application/vnd.ms-powerpoint',
//     'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//     'image/jpeg', 'image/png', 'image/gif'
//   ];
  
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only video, audio, PDF, text, and presentation files are allowed.'), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 100 * 1024 * 1024 // 100MB limit
//   }
// });

// // Middleware for different file types
// exports.uploadVideo = upload.single('video');
// exports.uploadAudio = upload.single('audio');
// exports.uploadPdf = upload.single('pdf');
// exports.uploadImage = upload.single('image');
// exports.uploadMultiple = upload.array('files', 10); // Max 10 files

// module.exports = upload;

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Root upload folder
const UPLOAD_ROOT = path.join(__dirname, '..', 'uploads');

// Ensure base folder exists
if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let subfolder = 'general';

    if (file.mimetype.startsWith('video/')) subfolder = 'videos';
    else if (file.mimetype.startsWith('audio/')) subfolder = 'audios';
    else if (file.mimetype === 'application/pdf') subfolder = 'pdfs';
    else if (file.mimetype.startsWith('image/')) subfolder = 'images';

    const folderPath = path.join(UPLOAD_ROOT, subfolder);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },

  filename: function (req, file, cb) {
    const uniq = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniq}${path.extname(file.originalname)}`);
  }
});

const allowed = [
  'video/mp4', 'video/webm', 'video/ogg',
  'audio/mpeg', 'audio/wav', 'audio/ogg',
  'application/pdf',
  'text/plain',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg', 'image/png', 'image/gif'
];

const fileFilter = (req, file, cb) => {
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type.'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// Export everything properly
module.exports = {
  upload,
  uploadVideo: upload.single('video'),
  uploadAudio: upload.single('audio'),
  uploadPdf: upload.single('pdf'),
  uploadImage: upload.single('image'),
  uploadMultiple: upload.array('files', 10)
};

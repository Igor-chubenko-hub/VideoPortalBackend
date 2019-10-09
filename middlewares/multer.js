const path = require('path');
const multer = require('multer');

const fileFilter = (req, file, cb) => {
  const isMimeTypeSupported = /jpeg|jpg|png|gif|svg/.test(file.mimetype);
  const isExtensionValid = /jpeg|jpg|png|gif|svg/.test(path.extname(file.originalname).toLowerCase());
  if (isMimeTypeSupported && isExtensionValid) return cb(null, true);
  const error = new Error('File type not supported.');
  error.status = 400;
  return cb(error);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

exports.upload = multer({
  storage,
  fileFilter,
  limits: {
    filename: 1024 * 1024 * 5,
  },
}).single('image');

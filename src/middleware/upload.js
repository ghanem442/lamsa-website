const multer = require('multer');

// Memory storage (files stored in buffer, not disk)
const storage = multer.memoryStorage();

// File filter for images and CSV
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('الرجاء رفع صورة فقط (JPG, PNG, WebP)'), false);
    }
  } else if (file.fieldname === 'csv') {
    // Accept CSV only
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('الرجاء رفع ملف CSV فقط'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

module.exports = upload;

const express = require('express');
const router = express.Router();
// internal
const uploader = require('../middleware/uploder');
const { cloudinaryController } = require('../controller/cloudinary.controller');
const verifyToken = require('../middleware/verifyToken');
const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('File filter - mimetype:', file.mimetype);
    
    // Allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Add debugging middleware
router.use('/add-img', (req, res, next) => {
  console.log('=== IMAGE UPLOAD DEBUG ===');
  console.log('Method:', req.method);
  console.log('Headers:', {
    'content-type': req.headers['content-type'],
    'content-length': req.headers['content-length']
  });
  console.log('Body keys:', Object.keys(req.body || {}));
  next();
});

//add image
router.post('/add-img', verifyToken, upload.single('image'), (req, res, next) => {
  console.log('=== MULTER PROCESSING ===');
  console.log('File received:', !!req.file);
  if (req.file) {
    console.log('File details:', {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      hasBuffer: !!req.file.buffer,
      bufferLength: req.file.buffer ? req.file.buffer.length : 0
    });
  } else {
    console.log('No file in req.file');
    console.log('req.files:', req.files);
    console.log('req.body:', req.body);
  }
  next();
}, cloudinaryController.saveImageCloudinary);

//add image
router.post('/add-multiple-img', verifyToken, upload.array('images',5), cloudinaryController.addMultipleImageCloudinary);

//delete image
router.delete('/img-delete', verifyToken, cloudinaryController.cloudinaryDeleteController);

module.exports = router;
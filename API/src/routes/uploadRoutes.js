const express = require('express');
const router = express.Router();
const { uploadPhotoByLink, uploadPhoto } = require('../controllers/uploadController');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });

router.post('/upload-by-link', uploadPhotoByLink);
router.post('/upload', uploadMiddleware.array('photos', 100), uploadPhoto);

module.exports = router; 
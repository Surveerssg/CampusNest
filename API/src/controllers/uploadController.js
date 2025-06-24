const imageDownloader = require('image-downloader');
const path = require('path');
const fs = require('fs');

const uploadPhotoByLink = async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  const uploadDir = path.join(__dirname, '..', '..', 'uploads');
  console.log('Upload directory:', uploadDir);

  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  try {
    await imageDownloader.image({
      url: link,
      dest: path.join(uploadDir, newName),
    });
    res.json(newName);
  } catch (error) {
    console.error('Error downloading image:', error);
    res.status(500).json({ error: 'Failed to download image' });
  }
};

const uploadPhoto = (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path: tempPath, originalname } = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = tempPath + '.' + ext;
    fs.renameSync(tempPath, newPath);
    uploadedFiles.push(path.basename(newPath));
  }
  res.json(uploadedFiles);
};

module.exports = {
  uploadPhotoByLink,
  uploadPhoto,
}; 
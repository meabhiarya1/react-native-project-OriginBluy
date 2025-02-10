const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const admin = require('../firebase');
const router = express.Router();

// Middleware to check authentication
const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
    req.user = decodedToken; // Add decoded user info to the request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to check file extension
const isValidFile = (fileName, mimeType) => {
  const ext = fileName.toLowerCase().split('.').pop();
  return (
    (ext === 'jpg' || ext === 'jpeg') && mimeType.startsWith('image/') ||
    (ext === 'mp4') && mimeType === 'video/mp4'
  );
};

// Upload Media
router.post('/media/upload', checkAuth, upload.single('media'), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User must be authenticated to upload media' });
    }

    const { buffer, mimetype, originalname } = req.file;
    const userId = req.user.id; // Use user ID from the decoded token

    // Validate file
    if (!isValidFile(originalname, mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only .jpg, .jpeg, and .mp4 files are allowed.' });
    }

    const fileExt = originalname.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`; // Maintain original file extension
    const bucket = admin.storage().bucket(); // Access storage bucket
    const file = bucket.file(`media/${userId}/${fileName}`); // Store file in user-specific folder

    await file.save(buffer, {
      metadata: { contentType: mimetype },
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/media/${userId}/${fileName}`;
    res.status(200).json({ url: publicUrl });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

// List Media
router.get('/media/:userId', checkAuth, async (req, res) => {
  try {
    const userId = req.params.userId; // Retrieve userId from request parameters

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const bucket = admin.storage().bucket(); // Access storage bucket
    const [files] = await bucket.getFiles({ prefix: `media/${userId}/` });
    const urls = await Promise.all(
      files.map(async (file) => {
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: '03-09-2491',
        });
        return { url };
      })
    );
    res.status(200).json(urls);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// Delete Media
router.delete('/delete', checkAuth, async (req, res) => {
  console.log('Received DELETE request:', req.body); // Log request body
  try {
    const { uris } = req.body;
    const userId = req.user.id; // Use user ID from the decoded token

    if (!Array.isArray(uris) || uris.length === 0) {
      return res.status(400).json({ error: 'No media URLs provided' });
    }

    const bucket = admin.storage().bucket(); // Access storage bucket

    // Track errors
    let deleteErrors = [];

    // Extract file paths from URIs and delete files
    await Promise.all(uris.map(async (uri) => {
      try {
        const path = decodeURIComponent(uri.split(`/${bucket.name}/`)[1].split('?')[0]); // Extract file path
        const file = bucket.file(path);
        await file.delete();
      } catch (deleteError) {
        console.error('Error deleting file:', deleteError);
        deleteErrors.push(uri);
      }
    }));

    if (deleteErrors.length > 0) {
      return res.status(500).json({ error: `Failed to delete some files: ${deleteErrors.join(', ')}` });
    }

    res.status(200).json({ message: 'Media files deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

module.exports = router;

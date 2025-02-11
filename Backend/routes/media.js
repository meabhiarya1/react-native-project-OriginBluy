const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const admin = require("../firebase");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Middleware to check authentication
const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authentication required" });
    a;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
    req.user = decodedToken; // Add decoded user info to the request
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to check file extension
const isValidFile = (fileName, mimeType) => {
  const ext = fileName.toLowerCase().split(".").pop();
  return (
    ((ext === "jpg" || ext === "jpeg") && mimeType.startsWith("image/")) ||
    (ext === "mp4" && mimeType === "video/mp4")
  );
};

// Upload Media Route
router.post(
  "/media/upload",
  checkAuth,
  upload.single("media"),
  async (req, res) => {
    try {
      // Ensure user is authenticated (added by checkAuth middleware)
      if (!req.user) {
        return res
          .status(401)
          .json({ error: "User must be authenticated to upload media" });
      }

      const { buffer, mimetype, originalname } = req.file;
      const userId = req.user.id; // Extract user ID from decoded JWT token

      // Validate file type
      if (!isValidFile(originalname, mimetype)) {
        return res.status(400).json({
          error:
            "Invalid file type. Only .jpg, .jpeg, and .mp4 files are allowed.",
        });
      }

      const fileExt = path.extname(originalname); // Get file extension
      const fileName = `${Date.now()}${fileExt}`; // Unique filename with extension
      const userUploadDir = path.join(
        __dirname,
        "..",
        "uploads",
        userId.toString()
      ); // User-specific folder

      // Create user's upload directory if it does not exist
      if (!fs.existsSync(userUploadDir)) {
        fs.mkdirSync(userUploadDir, { recursive: true });
      }

      const filePath = path.join(userUploadDir, fileName);

      // Write file to the uploads directory
      fs.writeFileSync(filePath, buffer);

      // Construct public file path
      // const publicUrl = `${BACKEND_API}/uploads/${userId}/${fileName}`;

      res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
      console.error("Error uploading media:", error);
      res.status(500).json({ error: "Failed to upload media" });
    }
  }
);

// List Media Route
router.get("/media/:userId", checkAuth, async (req, res) => {
  try {
    const userId = req.params.userId; // Retrieve userId from request parameters

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userUploadDir = path.join(
      __dirname,
      "..",
      "uploads",
      userId.toString()
    );

    // Check if user folder exists
    if (!fs.existsSync(userUploadDir)) {
      return res.status(404).json({ error: "No media found for this user" });
    }

    // Read all files in the user's upload directory
    const files = fs.readdirSync(userUploadDir);

    // Generate URLs for each file
    const fileUrls = files.map((file) => ({
      url: `api/uploads/${userId}/${file}`,
    }));

    res.status(200).json(fileUrls);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

// Delete Media
router.delete("/delete", checkAuth, async (req, res) => {
  console.log("Received DELETE request:", req.body); // Log request body
  try {
    const { uris } = req.body;
    const userId = req.user.id; // Use user ID from the decoded token

    if (!Array.isArray(uris) || uris.length === 0) {
      return res.status(400).json({ error: "No media URLs provided" });
    }

    const bucket = admin.storage().bucket(); // Access storage bucket

    // Track errors
    let deleteErrors = [];

    // Extract file paths from URIs and delete files
    await Promise.all(
      uris.map(async (uri) => {
        try {
          const path = decodeURIComponent(
            uri.split(`/${bucket.name}/`)[1].split("?")[0]
          ); // Extract file path
          const file = bucket.file(path);
          await file.delete();
        } catch (deleteError) {
          console.error("Error deleting file:", deleteError);
          deleteErrors.push(uri);
        }
      })
    );

    if (deleteErrors.length > 0) {
      return res.status(500).json({
        error: `Failed to delete some files: ${deleteErrors.join(", ")}`,
      });
    }

    res.status(200).json({ message: "Media files deleted successfully" });
  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).json({ error: "Failed to delete media" });
  }
});

module.exports = router;

const { isValidFile } = require("../helper/helperFunctions");
const path = require("path");
const fs = require("fs");

const mediaUploadControllerFunction = async (req, res) => {
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
};

const mediaGetUploadsControllerFunction = async (req, res) => {
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
      return res.status(404).json({ error: "No media found !!!" });
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
};

const mediaDeleteControllerFunction = async (req, res) => {
  try {
    console.log("Received DELETE request:", req.body); // Debugging log

    const { uris } = req.body;
    const userId = req.user.id; // Get user ID from JWT token

    // Validate request body
    if (!Array.isArray(uris) || uris.length === 0) {
      return res.status(400).json({ error: "No media URLs provided" });
    }

    // Track errors for failed deletions
    let deleteErrors = [];

    // Loop through URIs and delete files
    uris.forEach((uri) => {
      try {
        // Extract file name from the given URI
        const fileName = path.basename(uri); // Extracts "1707631234567.jpg"
        const userUploadDir = path.join(
          __dirname,
          "..",
          "uploads",
          userId.toString()
        );
        const filePath = path.join(userUploadDir, fileName);

        // Check if file exists before deleting
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Delete file
          console.log(`Deleted file: ${filePath}`);
        } else {
          console.warn(`File not found: ${filePath}`);
          deleteErrors.push(uri);
        }
      } catch (deleteError) {
        console.error("Error deleting file:", deleteError);
        deleteErrors.push(uri);
      }
    });

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
};

module.exports = {
  mediaUploadControllerFunction,
  mediaGetUploadsControllerFunction,
  mediaDeleteControllerFunction,
};

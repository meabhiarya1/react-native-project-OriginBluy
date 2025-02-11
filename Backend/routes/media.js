const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  mediaUploadControllerFunction,
  mediaGetUploadsControllerFunction,
  mediaDeleteControllerFunction,
} = require("../controller/mediaController");
const { checkAuth } = require("../middleware/checkAuth");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Media Route
router.post(
  "/media/upload",
  checkAuth,
  upload.single("media"),
  mediaUploadControllerFunction
);

// List Media Route
router.get("/media/:userId", checkAuth, mediaGetUploadsControllerFunction);

// Delete Media
router.delete("/media/delete", checkAuth, mediaDeleteControllerFunction);

module.exports = router;

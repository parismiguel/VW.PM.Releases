const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const Release = require("../models/Release");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Get all screenshots for a release
router.get("/:id/screenshots", async (req, res) => {
  try {
    const release = await Release.findById(req.params.id);
    if (!release) return res.status(404).json({ message: "Release not found" });

    res.status(200).json(release.screenshots);
  } catch (err) {
    console.error("Error fetching screenshots:", err);
    res.status(500).json({ message: "Error fetching screenshots" });
  }
});

// Upload screenshots for a release
router.post("/:id/screenshots", upload.array("screenshots"), async (req, res) => {
  try {
    const release = await Release.findById(req.params.id);
    if (!release)
      return res.status(404).json({ message: "Release not found" });

    const serverUrl = `${req.protocol}://${req.get("host")}`; // Get the server URL base

    const screenshots = req.files.map((file) => ({
      filename: file.filename,
      url: `${serverUrl}/uploads/${file.filename}`, // Include the server URL base
    }));

    release.screenshots.push(...screenshots);
    await release.save();

    res.status(200).json(release.screenshots);
  } catch (err) {
    console.error("Error uploading screenshots:", err);
    res.status(500).json({ message: "Error uploading screenshots" });
  }
});

// Delete a screenshot for a release
router.delete("/:id/screenshots/:filename", async (req, res) => {
  try {
    const { id, filename } = req.params;
    const release = await Release.findById(id);
    if (!release) return res.status(404).json({ message: "Release not found" });

    // Remove the screenshot from the database
    release.screenshots = release.screenshots.filter(
      (screenshot) => screenshot.filename !== filename
    );

    await release.save();

    // Delete the file from the uploads directory
    const filePath = `uploads/${filename}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json(release.screenshots);
  } catch (err) {
    console.error("Error deleting screenshot:", err);
    res.status(500).json({ message: "Error deleting screenshot" });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.js"); 
const Album = require("../models/album.js"); 

router.patch("/update/:id", upload.single("jacket"), async (req, res) => {
  try {
    const albumId = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const updatedAlbum = await Album.findByIdAndUpdate(
      albumId,
      { jacket: file.filename },
      { new: true }
    );

    if (!updatedAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.json(updatedAlbum);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

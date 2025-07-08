import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Album from "./Model/Album.js";

// Load environment variables
dotenv.config();

// Setup express app
const app = express();

// Convert __filename and __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "frontend/dist")));

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest =
      process.env.NODE_ENV === "development"
        ? "frontend/public"
        : "frontend/dist";
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const prefix = file.originalname.slice(0, Math.min(3, file.originalname.length));
    const timestamp = Date.now().toString().slice(-5);
    cb(null, `${prefix}${timestamp}`);
  },
});

// Multer middleware
const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 }, // 150 KB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpeg, and .jpg files are allowed"));
    }
  },
});

// Routes

// GET all albums
app.get("/albums", async (req, res, next) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (err) {
    next(err);
  }
});

// DELETE an album by ID
app.delete("/delete/:id", async (req, res, next) => {
  try {
    await Album.findByIdAndDelete(req.params.id);
    res.status(200).send("Deleted!");
  } catch (err) {
    next(err);
  }
});

// POST create a new album with image
app.post("/add", upload.single("jacket"), async (req, res, next) => {
  try {
    const newAlbum = new Album({
      ...req.body,
      jacket: req.file?.filename,
    });
    await newAlbum.save();
    res.status(200).json(newAlbum);
  } catch (err) {
    next(err);
  }
});

// PATCH update album image
app.patch("/update/:id", upload.single("jacket"), async (req, res, next) => {
  try {
    if (!req.file) throw new Error("No file uploaded.");
    const updated = await Album.findByIdAndUpdate(
      req.params.id,
      { jacket: req.file.filename },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

// Catch-all for frontend routing (React SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ error: "File too large. Max 150KB allowed." });
  }
  res.status(err.status || 500).json({ error: err.message });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("Connected to MongoDB");

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
};

startServer();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Album from "./Model/Album.js";

const app = express();

//* MongoDB connection
try {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  console.log("Connected to MongoDB");
} catch (err) {
  console.error("MongoDB connection failed:", err.message);
}

//* Middleware setup
app.use(express.json());
app.use(cors());


//* Multer config
//? Our goal: Create a middleware function `upload()` using multer to parse the incoming file (from the client side) and save it on disk!

//* Storage setup
// multer.diskStorage(): Tells multer to store the uploaded files on disk (instead of memory). => We get a full control over where and how the files are saved

//* Two main storage options
// 	destination: A function that tells multer where to save the file
//	filename: A function that defines what to name the file when saving



//* Routes
//? GET /albums - fetch all albums

//? DELETE /delete:id - Delete album by ID

//? POST /add - Add new album

//? PATCH /update:id - Update album image 


//* Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
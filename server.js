import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import albumRoutes from "./backend/routes/albums.js";

dotenv.config();
const app = express();

// File path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "backend/uploads"))); // Serve images

// Routes
app.use("/", albumRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

app.get("/", (req, res) => {
  res.send("Server is running ");
});


// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(` Server running at http://localhost:${PORT}`));

const express = require("express");
const mongoose = require("mongoose");
const albumsRoute = require("./routes/albums");
const path = require("path");

const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve images statically
app.use("/", albumsRoute);

mongoose.connect("mongodb://localhost:27017/albumsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.listen(3000, () => console.log("Server running on port 3000"));

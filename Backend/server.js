const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const mediaRoutes = require("./routes/media"); // Import media routes
const path = require("path");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the uploads folder
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 9000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api", mediaRoutes); // Use media routes

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

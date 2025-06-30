const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173"||"https://uniformmanagementproject.onrender.com ",
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Routes
const authRoutes = require("./routes/auth");
const uniformRoutes = require("./routes/uniformRoutes");

// Public routes
const signupLoginRoutes = require('./routes/auth');
app.use("/", signupLoginRoutes);

// Protected routes
app.use("/api/uniforms",  uniformRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🎉 Uniform Distribution API is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import allotmentRoutes from "./routes/allotment.js";
const app = express();
const PORT = process.env.PORT || 5000;



app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
dotenv.config();
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));
import { errorHandler } from "./middleware/errorHandler.js";
app.use(errorHandler);

import uniformRoutes from "./routes/uniformRoutes.js";

// Public routes
import signupLoginRoutes from "./routes/auth.js";
app.use("/", signupLoginRoutes);

// Protected routes
app.use("/api/uniforms",  uniformRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🎉 Uniform Distribution API is running!");
});
app.use("/api/allotments", allotmentRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

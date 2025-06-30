const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();
// SIGNUP
router.post("/api/sign-up", async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    // 🔒 Prevent signup if user is not admin
    // (e.g. through a secret key, or allow only pre-approved emails, OR simply disable public signup)
    return res.status(403).json({ error: "Signup not allowed. Admins only." });

    // If you want to allow only one hardcoded admin signup:
    /*
    if (email !== "admin@yourdomain.com") {
      return res.status(403).json({ error: "Only admin signup is allowed." });
    }
    */

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      isAdmin: true, // 👈 allow signup only as admin
    });

    const user = await newUser.save();

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      "SECRET_KEY",
      { expiresIn: "3d" }
    );

    res.status(200).json({
      message: "Signup successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
      },
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Failed to sign up user", details: err.message });
  }
});


// LOGIN
router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    // 🔒 Block login for non-admins
    if (!user.isAdmin) {
      return res.status(403).json({ error: "Access denied. Only admins can login." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      "SECRET_KEY",
      { expiresIn: "3d" }
    );

    res.json({
      token,
      user: { email: user.email, isAdmin: user.isAdmin },
    });

  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

module.exports = router;

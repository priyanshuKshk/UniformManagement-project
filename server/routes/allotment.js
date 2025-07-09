// routes/allotment.routes.js
import express from "express";
import {Allotment} from "../models/Allotment.js";
import Uniform from "../models/Uniform.js";

const router = express.Router();

// ✅ POST: Allot uniform to person
router.post("/", async (req, res) => {
  try {
    const { personName, personId, quantity, uniformId } = req.body;

    const uniform = await Uniform.findById(uniformId);
    if (!uniform) {
      return res.status(404).json({ success: false, message: "Uniform not found" });
    }

    if (uniform.quantity < quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock" });
    }

    
// Decrease stock and increase allotted
uniform.quantity -= quantity;
uniform.allotted = (uniform.allotted || 0) + quantity;
await uniform.save();


    // Save allotment
    const allotment = new Allotment({
      personName,
      personId,
      quantity,
      uniformId,
    });

    await allotment.save();

    res.status(201).json({ success: true, message: "Allotted successfully" });
  } catch (err) {
    console.error("Allotment Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ✅ GET: All allotments list (with populated uniform details)
router.get("/", async (req, res) => {
  try {
    const allotments = await Allotment.find()
      .populate("uniformId")
      .sort({ allottedOn: -1 });

    res.json({ success: true, data: allotments });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ success: false, message: "Could not fetch data" });
  }
});

export default router;

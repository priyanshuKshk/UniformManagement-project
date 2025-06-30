const express = require('express');
const router = express.Router();
const Uniform = require('../models/Uniform');

router.post('/', async (req, res) => {
  try {
    const uniform = new Uniform(req.body);
    await uniform.save();
    res.status(201).json(uniform);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const uniforms = await Uniform.find();
  res.json(uniforms);
});
router.delete("/:id", async (req, res) => {
  try {
    await Uniform.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Uniform.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

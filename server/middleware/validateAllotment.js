export const validateAllotment = (req, res, next) => {
  const { uniformId, personName, personId, quantity } = req.body;

  // Required field checks
  if (!uniformId || typeof uniformId !== "string" || uniformId.trim().length === 0) {
    return res.status(400).json({ message: "Uniform ID is required and must be a valid string" });
  }

  if (!personName || typeof personName !== "string" || personName.trim().length < 2) {
    return res.status(400).json({ message: "Person name is required and must be at least 2 characters long" });
  }

  if (typeof quantity !== "number" || isNaN(quantity)) {
    return res.status(400).json({ message: "Quantity must be a valid number" });
  }

  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than 0" });
  }

  

  // Optional: personId validation (if provided)
  if (personId && typeof personId !== "string") {
    return res.status(400).json({ message: "Person ID must be a string" });
  }

  // Sanitize/format data
  req.body.personName = personName.trim();
  req.body.personId = personId?.trim() || "";
  req.body.uniformId = uniformId.trim();

  next();
};

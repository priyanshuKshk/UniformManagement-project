export const validateAllotment = (req, res, next) => {
  const { uniformId, personName, quantity } = req.body;
  if (!uniformId || !personName || !quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than 0" });
  }
  next();
};

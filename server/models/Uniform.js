const mongoose = require('mongoose');
const UniformSchema = new mongoose.Schema({
  itemName: String,
  size: String,
  costPrice: Number,
  quantity: Number,
  available: {
  type: Number,
  default: 0,
},
allotted: {
  type: Number,
  default: 0,
}
,
  lastUpdated: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Uniform', UniformSchema);
import mongoose from "mongoose";

const allotmentSchema = new mongoose.Schema({
  uniformId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Uniform",
    required: true,
  },
  personName: {
    type: String,
    required: true,
  },
  personId: {
    type: String, // roll no, employee ID etc.
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
  },
  allottedOn: {
    type: Date,
    default: Date.now,
  },
});

export const Allotment = mongoose.model("Allotment", allotmentSchema);

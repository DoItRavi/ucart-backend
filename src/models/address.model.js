// File: src/models/address.model.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one “last used” per user
    },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String }, // added phone field
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false, // we track updatedAt manually
  }
);

module.exports = mongoose.model("Address", addressSchema);

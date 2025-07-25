// src/models/product.model.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    default: null,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  variants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// You can add indexes, virtuals, or helper methods here if needed

// ensure Mongo treats title case‑insensitively
productSchema.index(
  { title: 1, category: 1 },
  {
    unique: true,
    collation: { locale: "en", strength: 2 },
    // strength:2 makes it case‑insensitive on title
  }
);

module.exports = mongoose.model("Product", productSchema);

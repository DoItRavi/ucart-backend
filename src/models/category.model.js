// src/models/Category.js

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
    lowercase: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // refers to Category model
    default: null,
  },
  level: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Category", categorySchema);

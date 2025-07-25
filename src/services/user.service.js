// src/services/user.service.js

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const JWT_SECRET = process.env.SECRET_KEY;

/**
 * Given a JWT, verify it and return the user (sans password).
 */
async function getProfile(token) {
  // 1) Decode & verify token
  const payload = jwt.verify(token, JWT_SECRET);
  // console.log("Decoded payload:", payload);
  // 2) Fetch user by ID and exclude password
  const user = await User.findById(payload.id).select("-password");
  // console.log("Fetched user:", user);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return user;
}

/**
 * Return all users (excluding passwords).
 */
async function getAllUsers() {
  return await User.find().select("-password");
}

module.exports = { getProfile, getAllUsers };

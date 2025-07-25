// src/services/auth.service.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const SALT_ROUNDS = 8; // For bcrypt hashing
const JWT_SECRET = process.env.SECRET_KEY;
const JWT_EXPIRES = "10h"; // Token validity duration

/**
 * Registers a new user.
 * - Checks if email already exists
 * - Hashes the password
 * - Saves the user
 * - Returns the user (without password) and a JWT
 */
async function register({ firstName, lastName, email, password }) {
  // 1) Duplicate email check
  if (await User.findOne({ email })) {
    const err = new Error("Email already in use");
    err.status = 400;
    throw err;
  }

  // 2) Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 3) Create user record
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  // 4) Generate JWT
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });

  // 5) Remove password before returning
  const safeUser = user.toObject();
  delete safeUser.password;

  return { user: safeUser, token };
}

/**
 * Logs in an existing user.
 * - Verifies email & password
 * - Returns the user (without password) and a JWT
 */
async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });

  const safeUser = user.toObject();
  delete safeUser.password;

  return { user: safeUser, token };
}

module.exports = { register, login };

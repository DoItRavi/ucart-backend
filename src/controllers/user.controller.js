// src/controllers/user.controller.js

const userService = require("../services/user.service");

async function getUserProfile(req, res) {
  try {
    // auth.middleware put the raw token payload into req.user,
    // but we need the original token string:
    const token = req.headers.authorization.split(" ")[1];
    // console.log("Token:", token);
    const user = await userService.getProfile(token);
    // console.log("User profile:", user);
    res.json(user);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { getUserProfile, getAllUsers };

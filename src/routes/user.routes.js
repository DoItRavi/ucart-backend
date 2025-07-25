const express = require("express");
const router = express.Router();
const userCtl = require("../controllers/user.controller");
const authMw = require("../middleware/auth.middleware");

// GET all users (protected; only authenticated requests)
router.get("/", authMw(), userCtl.getAllUsers);

// GET profile of the logged‑in user
router.get("/profile", authMw(), userCtl.getUserProfile);

module.exports = router;

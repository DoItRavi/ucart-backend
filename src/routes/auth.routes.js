const express = require("express");
const router = express.Router();
const authCtl = require("../controllers/auth.controller");

// User registration route
router.post("/signup", authCtl.register);

// User login route
router.post("/signin", authCtl.login);

module.exports = router;

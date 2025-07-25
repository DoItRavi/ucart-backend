// file: src/routes/address.routes.js

const express = require("express");
const router = express.Router();
const addressCtl = require("../controllers/address.controller");
const auth = require("../middleware/auth.middleware");

// All address endpoints require authentication
router.get("/", auth(), addressCtl.getAddress);
router.post("/", auth(), addressCtl.saveAddress);

module.exports = router;

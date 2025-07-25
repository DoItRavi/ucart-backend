// src/routes/product.admin.routes.js

const express = require("express");
const router = express.Router();
const productCtl = require("../controllers/product.controller");
const authMw = require("../middleware/auth.middleware");

// Protect all admin routes with JWT auth
router.post("/", authMw("ADMIN"), productCtl.createProduct);
router.put("/:id", authMw("ADMIN"), productCtl.updateProduct);
router.delete("/:id", authMw("ADMIN"), productCtl.deleteProduct);

module.exports = router;

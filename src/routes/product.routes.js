// src/routes/product.routes.js

const express = require("express");
const router = express.Router();
const productCtl = require("../controllers/product.controller");

// GET /api/products
router.get("/", productCtl.getAllProducts);

// GET /api/products/:id
router.get("/:id", productCtl.findProductById);

module.exports = router;

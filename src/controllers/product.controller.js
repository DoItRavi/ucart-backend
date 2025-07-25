// src/controllers/product.controller.js

const productService = require("../services/product.service");

/**
 * POST /api/products/admin
 * Create a new product (admin only)
 */
async function createProduct(req, res) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

/**
 * GET /api/products
 * Get all products (public)
 */
async function getAllProducts(req, res) {
  try {
    const result = await productService.getAllProducts(req.query);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
async function findProductById(req, res) {
  try {
    const product = await productService.findProductById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(err.status || 404).json({ error: err.message });
  }
}

/**
 * PUT /api/products/admin/:id
 * Update a product by ID (admin only)
 */
async function updateProduct(req, res) {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

/**
 * DELETE /api/products/admin/:id
 * Delete a product by ID (admin only)
 */
async function deleteProduct(req, res) {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(err.status || 404).json({ error: err.message });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  findProductById,
  updateProduct,
  deleteProduct,
};

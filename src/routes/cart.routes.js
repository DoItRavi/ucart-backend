// src/routes/cart.routes.js

const express = require("express");
const router = express.Router();
const cartCtl = require("../controllers/cart.controller");
const cartItemCtl = require("../controllers/cartItem.controller");
const auth = require("../middleware/auth.middleware");

// Apply authentication to all cart routes
router.use(auth());

// Fetch (or create) the authenticated user's cart
// GET /api/cart
router.get("/", cartCtl.findUserCart);

// Add a product variant to cart (quantity defaults to 1)
// POST /api/cart/items
router.post("/items", cartCtl.addItemToCart);

// Update quantity for an existing cart item
// PUT /api/cart/items/:itemId
router.put("/items/:itemId", cartItemCtl.updateCartItem);

// Remove an item from the cart
// DELETE /api/cart/items/:itemId
router.delete("/items/:itemId", cartItemCtl.removeCartItem);

module.exports = router;

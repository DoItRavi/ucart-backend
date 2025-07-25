// src/controllers/cart.controller.js
const cartService = require("../services/cart.service");
const cartItemService = require("../services/cartItem.service");

/**
 * GET /api/cart
 * Fetch (or create) the user’s cart, with items and totals.
 */
async function findUserCart(req, res, next) {
  try {
    const userId = req.user.id;
    const cart = await cartService.findUserCart(userId);
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/cart/items
 * Add a variant to the user's cart (quantity defaults to 1).
 * Body: { productId, sku, quantity? }
 */
async function addItemToCart(req, res, next) {
  try {
    const userId = req.user.id;
    const { productId, sku, quantity = 1 } = req.body;
    // service will create cart if missing
    await cartService.addCartItem(userId, { productId, sku, quantity });
    // return fresh cart
    const cart = await cartService.findUserCart(userId);
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/cart/items/:itemId
 * Update quantity of an existing cart item.
 * Body: { quantity }
 */
async function updateCartItem(req, res, next) {
  try {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    const { quantity } = req.body;
    await cartItemService.updateCartItem(userId, itemId, { quantity });
    const cart = await cartService.findUserCart(userId);
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/cart/items/:itemId
 * Remove an item from the user's cart.
 */
async function removeCartItem(req, res, next) {
  try {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    await cartItemService.removeCartItem(userId, itemId);
    const cart = await cartService.findUserCart(userId);
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  findUserCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
};

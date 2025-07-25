// src/controllers/cartItem.controller.js

const cartItemService = require("../services/cartItem.service");
const cartService = require("../services/cart.service");

/**
 * PUT /api/cart/items/:itemId
 * Updates the quantity of a cart item
 * Body: { quantity }
 */
async function updateCartItem(req, res, next) {
  try {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    const { quantity } = req.body;

    await cartItemService.updateCartItem(userId, itemId, { quantity });

    // Return updated cart after change
    const cart = await cartService.findUserCart(userId);
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/cart/items/:itemId
 * Removes a cart item from the user's cart
 */
async function removeCartItem(req, res, next) {
  try {
    const userId = req.user.id;
    const itemId = req.params.itemId;

    await cartItemService.removeCartItem(userId, itemId);

    // Return updated cart after deletion
    const cart = await cartService.findUserCart(userId);
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  updateCartItem,
  removeCartItem,
};

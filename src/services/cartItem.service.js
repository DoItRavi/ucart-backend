// src/services/cartItem.service.js

const CartItem = require("../models/cartItem.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

/**
 * Find a cart item by ID and ensure it exists
 */
async function findCartItemById(cartItemId) {
  const cartItem = await CartItem.findById(cartItemId).populate("product");
  if (!cartItem) {
    throw new Error(`Cart item not found with ID: ${cartItemId}`);
  }
  return cartItem;
}

/**
 * Update the quantity of a cart item (only by the owner)
 */
async function updateCartItem(userId, cartItemId, { quantity }) {
  if (quantity < 0) {
    throw new Error("Quantity cannot be negative");
  }

  const cartItem = await CartItem.findById(cartItemId);
  if (!cartItem) throw new Error("Cart item not found");

  if (cartItem.user.toString() !== userId.toString()) {
    throw new Error("Unauthorized to update this cart item");
  }

  if (quantity === 0) {
    // remove item if quantity becomes zero
    await CartItem.findByIdAndDelete(cartItemId);
    return null;
  }

  const product = await Product.findById(cartItem.product).populate("variants");
  if (!product) throw new Error("Product not found");

  const variant = product.variants.find((v) => v.sku === cartItem.sku);
  if (!variant) throw new Error("Variant not found");

  if (quantity > variant.stock) {
    throw new Error(`Only ${variant.stock} units available in stock`);
  }

  cartItem.quantity = quantity;
  cartItem.price = variant.price * quantity;
  cartItem.discountedPrice = Math.round(
    variant.price * (1 - product.discount / 100) * quantity
  );

  return await cartItem.save();
}

/**
 * Remove a cart item (only by the owner)
 */
async function removeCartItem(userId, cartItemId) {
  const cartItem = await findCartItemById(cartItemId);

  if (cartItem.user.toString() !== userId.toString()) {
    throw new Error("You can't delete another user's cart item");
  }

  await CartItem.findByIdAndDelete(cartItemId);
  // Also pull its ID out of the Cart.cartItems array
  await Cart.findByIdAndUpdate(cartItem.cart, {
    $pull: { cartItems: cartItemId },
  });
}

module.exports = {
  findCartItemById,
  updateCartItem,
  removeCartItem,
};

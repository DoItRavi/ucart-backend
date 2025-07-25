// src/services/cart.service.js

const Cart = require("../models/cart.model");
const CartItem = require("../models/cartItem.model");
const Product = require("../models/product.model");

/**
 * Ensure a cart exists for the user, or create one.
 */
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      cartItems: [],
    });
  }
  return cart;
}

/**
 * Add or merge a variant into the user's cart.
 * bodyFields: { productId, sku, quantity }
 */
async function addCartItem(userId, { productId, sku, quantity = 1 }) {
  if (quantity <= 0) {
    throw new Error("Quantity must be at least 1");
  }

  const cart = await getOrCreateCart(userId);

  const product = await Product.findById(productId).populate("variants");
  if (!product) throw new Error("Product not found");

  const variant = product.variants.find((v) => v.sku === sku);
  if (!variant) throw new Error("Variant not found");

  if (variant.stock < quantity) {
    throw new Error(`Only ${variant.stock} units available in stock`);
  }

  let item = await CartItem.findOne({
    cart: cart._id,
    product: product._id,
    sku,
    user: userId,
  });

  if (item) {
    const newQty = item.quantity + quantity;
    if (newQty > variant.stock) {
      throw new Error(
        `Adding ${quantity} exceeds stock. Available: ${
          variant.stock - item.quantity
        }`
      );
    }
    item.quantity = newQty;
    item.price = variant.price * newQty;
    item.discountedPrice = Math.round(
      variant.price * (1 - product.discount / 100) * newQty
    );
    await item.save();
  } else {
    item = await CartItem.create({
      cart: cart._id,
      product: product._id,
      user: userId,
      sku,
      quantity,
      price: variant.price * quantity,
      discountedPrice: Math.round(
        variant.price * (1 - product.discount / 100) * quantity
      ),
    });
    cart.cartItems.push(item._id);
    await cart.save();
  }
}

/**
 * Fetch the user's cart with populated items and totals.
 */
async function findUserCart(userId) {
  const cart = await getOrCreateCart(userId);
  await cart.populate({
    path: "cartItems",
    populate: { path: "product", select: "title brand images discount" },
  });

  let totalPrice = 0;
  let totalDiscountedPrice = 0;
  let totalItem = 0;

  for (const ci of cart.cartItems) {
    totalPrice += ci.price;
    totalDiscountedPrice += ci.discountedPrice;
    totalItem += ci.quantity;
  }

  cart.totalPrice = totalPrice;
  cart.totalDiscountedPrice = totalDiscountedPrice;
  cart.totalItem = totalItem;
  cart.discount = totalPrice - totalDiscountedPrice;

  await cart.save();
  return cart;
}

module.exports = {
  getOrCreateCart,
  addCartItem,
  findUserCart,
};

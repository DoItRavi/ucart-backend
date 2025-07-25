// File: src/services/order.service.js
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const CartItem = require("../models/cartItem.model");
const Address = require("../models/address.model");

async function createOrder(userId, addressPayload, clearCart = true) {
  // Fetch cart and fully populate each CartItem’s `product` field
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "cartItems",
    populate: {
      path: "product",
      select: "title discountedPrice",
    },
  });
  if (!cart || cart.cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  // Resolve or upsert the shipping address
  let shippingAddress;
  if (addressPayload.addressId) {
    const addr = await Address.findOne({
      _id: addressPayload.addressId,
      user: userId,
    });
    if (!addr) throw new Error("Address not found");
    shippingAddress = addr.toObject();
  } else {
    const addr = await Address.findOneAndUpdate(
      { user: userId },
      { ...addressPayload, user: userId, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    shippingAddress = {
      line1: addr.line1,
      line2: addr.line2,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone,
    };
  }

  // Build items array and compute subTotal
  let subTotal = 0;
  const items = cart.cartItems.map((ci) => {
    // Now ci.product.title and ci.discountedPrice are both defined
    const lineTotal = ci.discountedPrice;
    subTotal += lineTotal;

    return {
      productId: ci.product._id,
      sku: ci.sku,
      title: ci.product.title,
      unitPrice: ci.discountedPrice / ci.quantity,
      quantity: ci.quantity,
      lineTotal,
    };
  });

  // Compute totals
  const tax = Math.round(subTotal * 0.18);
  const shipping = 0;
  const grandTotal = subTotal + tax + shipping;

  // Create the order (payment still PENDING until confirmation)
  const order = await Order.create({
    user: userId,
    items,
    shippingAddress,
    totals: { subTotal, tax, shipping, grandTotal },
    payment: { method: "DUMMY", status: "PENDING" },
    status: "NEW",
  });

  // Only clear the cart after the order is created *and* if clearCart flag is true
  if (clearCart) {
    await CartItem.deleteMany({ cart: cart._id });
    cart.cartItems = [];
    cart.totalItem = 0;
    cart.totalPrice = 0;
    cart.totalDiscountedPrice = 0;
    cart.discount = 0;
    await cart.save();
  }

  return order;
}

async function fetchOrdersByUser(userId) {
  return await Order.find({ user: userId }).sort({ createdAt: -1 });
}

async function fetchOrderById(userId, orderId) {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new Error("Order not found");
  return order;
}

async function fetchAllOrders() {
  return await Order.find().sort({ createdAt: -1 });
}

async function updatePaymentStatus(userId, orderId, newStatus) {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new Error("Order not found");
  order.payment.status = newStatus;
  order.status = newStatus === "PAID" ? "CONFIRMED" : order.status;
  await order.save();

  if (newStatus === "PAID") {
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      await CartItem.deleteMany({ cart: cart._id });
      cart.cartItems = [];
      cart.totalItem = 0;
      cart.totalPrice = 0;
      cart.totalDiscountedPrice = 0;
      cart.discount = 0;
      await cart.save();
    }
  }

  return order;
}

async function updateOrderStatus(orderId, status) {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");
  order.status = status;
  return await order.save();
}

module.exports = {
  createOrder,
  fetchOrdersByUser,
  fetchOrderById,
  fetchAllOrders,
  updatePaymentStatus,
  updateOrderStatus,
};

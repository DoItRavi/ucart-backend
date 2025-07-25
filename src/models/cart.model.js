const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // one cart per user
  },
  cartItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartItem",
      required: true,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  totalItem: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  totalDiscountedPrice: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
});

module.exports = mongoose.model("Cart", cartSchema);

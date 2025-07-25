// File: src/models/order.model.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        sku: { type: String, required: true },
        title: { type: String, required: true },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
        lineTotal: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    totals: {
      subTotal: { type: Number, required: true },
      tax: { type: Number, required: true },
      shipping: { type: Number, required: true, default: 0 },
      grandTotal: { type: Number, required: true },
    },
    payment: {
      method: { type: String, required: true, default: "DUMMY" },
      status: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED"],
        default: "PENDING",
      },
      transactionId: { type: String },
    },
    status: {
      type: String,
      enum: ["NEW", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "NEW",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

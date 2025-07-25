// File: src/controllers/order.controller.js
const orderService = require("../services/order.service");

async function createOrder(req, res, next) {
  try {
    const order = await orderService.createOrder(req.user.id, req.body, false);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

async function getUserOrders(req, res, next) {
  try {
    const orders = await orderService.fetchOrdersByUser(req.user.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function getOrderById(req, res, next) {
  try {
    const order = await orderService.fetchOrderById(
      req.user.id,
      req.params.orderId
    );
    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function confirmPayment(req, res, next) {
  try {
    const order = await orderService.updatePaymentStatus(
      req.user.id,
      req.params.orderId,
      "PAID"
    );
    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function getAllOrders(req, res, next) {
  try {
    const orders = await orderService.fetchAllOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { orderId, status } = req.params;
    const order = await orderService.updateOrderStatus(orderId, status);
    res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  confirmPayment,
  getAllOrders,
  updateOrderStatus,
};

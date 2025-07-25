// File: src/routes/adminOrder.routes.js
const express = require("express");
const router = express.Router();
const orderCtl = require("../controllers/order.controller");
const auth = require("../middleware/auth.middleware");

// Admin: list all orders
router.get("/", auth(), orderCtl.getAllOrders);
// Admin: update status, e.g. PUT /api/admin/orders/:orderId/:status
router.put("/:orderId/:status", auth(), orderCtl.updateOrderStatus);

module.exports = router;

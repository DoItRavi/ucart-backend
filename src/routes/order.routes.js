// File: src/routes/order.routes.js
const express = require("express");
const router = express.Router();
const orderCtl = require("../controllers/order.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth(), orderCtl.createOrder);
router.get("/user", auth(), orderCtl.getUserOrders);
router.get("/:orderId", auth(), orderCtl.getOrderById);
router.post("/:orderId/confirm", auth(), orderCtl.confirmPayment);

module.exports = router;

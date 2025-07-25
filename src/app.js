// app.js

const express = require("express");
const cors = require("cors");

// Import route modules
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const productAdminRoutes = require("./routes/product.admin.routes");
const cartRoutes = require("./routes/cart.routes"); // merged cart + cart‑item routes

// Existing requires...
const orderRoutes = require("./routes/order.routes");
const adminOrderRoutes = require("./routes/adminOrder.routes");

// Error handler
const errorHandler = require("./middleware/error.middleware");

// after existing imports
const addressRoutes = require("./routes/address.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to UCart API");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);
app.use("/api/products/admin", productAdminRoutes);

// Consolidated cart routes under /api/cart
app.use("/api/cart", cartRoutes);

// then, below your other `app.use("/api/…")` calls:
app.use("/api/addresses", addressRoutes);

// After other app.use(...) calls:
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;

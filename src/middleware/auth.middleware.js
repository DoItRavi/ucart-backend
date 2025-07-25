// src/middleware/auth.middleware.js

const jwt = require("jsonwebtoken");

/**
 * Returns an Express middleware that:
 *  1. Verifies a Bearer JWT.
 *  2. Optionally enforces that payload.role === requiredRole.
 *
 * @param {string|null} requiredRole  e.g. 'ADMIN', or null for any authenticated user
 */
module.exports = (requiredRole = null) => {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: "No token provided" });
    }

    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const token = parts[1];
    try {
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      // Enforce role if specified
      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({ error: "Access denied" });
      }
      // Attach user info to request for downstream handlers
      req.user = payload; // { id, role, iat, exp }
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
};

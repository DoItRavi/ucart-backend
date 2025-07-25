// src/middleware/error.middleware.js

module.exports = (err, req, res, next) => {
  console.error(err); // log to console (or send to your log service)
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
};

// File: src/controllers/address.controller.js
const addressService = require("../services/address.service");

/**
 * GET /api/addresses
 * Return the user’s last-used address (or null).
 */
async function getAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const address = await addressService.getAddressByUser(userId);
    // Send the raw address object (or null)
    return res.json(address || null);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/addresses
 * Save or update the user’s last-used address.
 * Body: { line1, line2?, city, state, postalCode, country, phone? }
 */
async function saveAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const payload = {
      line1: req.body.line1,
      line2: req.body.line2,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      country: req.body.country,
      phone: req.body.phone, // include phone
    };
    const address = await addressService.upsertAddress(userId, payload);
    // Return the raw address object
    return res.status(201).json(address);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAddress,
  saveAddress,
};

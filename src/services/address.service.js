// File: src/services/address.service.js

const Address = require("../models/address.model");

/**
 * Upsert the user’s “last used” address.
 * If an Address exists for this user, update it; otherwise create one.
 */
async function upsertAddress(userId, payload) {
  const now = new Date();
  const updated = await Address.findOneAndUpdate(
    { user: userId },
    { ...payload, user: userId, updatedAt: now },
    { upsert: true, new: true }
  );
  return updated;
}

/**
 * Fetch the user’s “last used” address (or null).
 */
async function getAddressByUser(userId) {
  return await Address.findOne({ user: userId });
}

module.exports = {
  upsertAddress,
  getAddressByUser,
};

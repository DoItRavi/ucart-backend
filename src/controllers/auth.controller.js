const authService = require("../services/auth.service");

async function register(req, res) {
  try {
    // req.body should contain: firstName, lastName, email, password
    const { user, token } = await authService.register(req.body);
    // Return the created user (without password) and the JWT
    res.status(201).json({ user, token });
  } catch (err) {
    // If err.status is set, use it; otherwise default to 500
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    // req.body should contain: email, password
    const { user, token } = await authService.login(req.body);
    // Return the authenticated user and a fresh JWT
    res.json({ user, token });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { register, login };

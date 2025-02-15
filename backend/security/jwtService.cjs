const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key'; // Ensure this is set in .env

/**
 * Generate a JWT token.
 * @param {Object} payload - The data to encode in the token.
 * @param {string} expiresIn - Token expiration time (e.g., '1h', '7d').
 * @returns {string} - The generated JWT token.
 */
const createToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

/**
 * Verify and decode a JWT token.
 * @param {string} token - The token to verify.
 * @returns {Object|null} - Decoded payload if valid, otherwise null.
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error('Invalid token:', error.message);
    return null;
  }
};

module.exports = { createToken, verifyToken };

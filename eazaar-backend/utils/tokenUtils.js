const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { secret } = require('../config/secret');

/**
 * Generate JWT Access Token (short-lived)
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
const generateAccessToken = (user) => {
  const payload = {
    _id: user._id,  // Changed from 'id' to '_id' to match middleware expectation
    email: user.email,
    role: user.role,
    status: user.status,
    type: 'access'
  };

  return jwt.sign(payload, secret.token_secret, {
    expiresIn: '24h', // 24 hours
    issuer: 'eazaar-api',
    audience: 'eazaar-client'
  });
};

/**
 * Generate JWT Refresh Token (long-lived)
 * @param {Object} user - User object
 * @param {String} deviceInfo - Device information
 * @returns {String} JWT token
 */
const generateRefreshToken = (user, deviceInfo = 'unknown') => {
  const payload = {
    id: user._id,
    email: user.email,
    type: 'refresh',
    deviceInfo,
    tokenId: crypto.randomBytes(16).toString('hex') // Unique token ID
  };

  return jwt.sign(payload, secret.jwt_secret_for_verify, {
    expiresIn: '30d', // 30 days
    issuer: 'eazaar-api',
    audience: 'eazaar-client'
  });
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @param {String} deviceInfo - Device information
 * @returns {Object} Object containing both tokens
 */
const generateTokenPair = (user, deviceInfo = 'unknown') => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, deviceInfo);
  
  return {
    accessToken,
    refreshToken,
    expiresIn: 24 * 60 * 60, // 24 hours in seconds
    tokenType: 'Bearer'
  };
};

/**
 * Verify JWT Token
 * @param {String} token - JWT token
 * @param {String} type - Token type ('access' or 'refresh')
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token, type = 'access') => {
  try {
    const secret_key = type === 'access' ? secret.token_secret : secret.jwt_secret_for_verify;
    
    const decoded = jwt.verify(token, secret_key, {
      issuer: 'eazaar-api',
      audience: 'eazaar-client'
    });

    // Verify token type matches expected type
    if (decoded.type !== type) {
      throw new Error(`Invalid token type. Expected ${type}, got ${decoded.type}`);
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw error;
    }
  }
};

/**
 * Extract token from Authorization header
 * @param {String} authHeader - Authorization header value
 * @returns {String|null} Extracted token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

/**
 * Generate secure random token for email verification, password reset, etc.
 * @param {Number} length - Token length in bytes (default: 32)
 * @returns {String} Random token
 */
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Hash token for database storage
 * @param {String} token - Plain token
 * @returns {String} Hashed token
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generate API key for external integrations
 * @param {String} prefix - API key prefix
 * @returns {String} API key
 */
const generateApiKey = (prefix = 'eazaar') => {
  const randomPart = crypto.randomBytes(24).toString('hex');
  return `${prefix}_${randomPart}`;
};

/**
 * Validate token expiration
 * @param {Number} exp - Expiration timestamp
 * @returns {Boolean} True if token is still valid
 */
const isTokenValid = (exp) => {
  return Date.now() < exp * 1000; // Convert to milliseconds
};

/**
 * Get token expiration time in human readable format
 * @param {Number} exp - Expiration timestamp
 * @returns {String} Human readable expiration time
 */
const getTokenExpirationTime = (exp) => {
  const expirationDate = new Date(exp * 1000);
  return expirationDate.toISOString();
};

/**
 * Generate CSRF token
 * @returns {String} CSRF token
 */
const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('base64');
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyToken,
  extractTokenFromHeader,
  generateSecureToken,
  hashToken,
  generateApiKey,
  isTokenValid,
  getTokenExpirationTime,
  generateCSRFToken
};
const User = require('../models/UserNew');
const { verifyToken, extractTokenFromHeader } = require('../utils/tokenUtils');

// Simple rate limiting implementation (since express-rate-limit is not installed)
const rateLimitStore = new Map();

const createRateLimit = (windowMs, max, message) => {
  return (req, res, next) => {
    const key = `${req.ip}-${req.get('User-Agent')}`;
    const now = Date.now();
    
    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const record = rateLimitStore.get(key);
    
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }
    
    if (record.count >= max) {
      return res.status(429).json(message);
    }
    
    record.count++;
    next();
  };
};

/**
 * Authentication middleware to verify JWT tokens
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        error: 'MISSING_TOKEN'
      });
    }

    // Verify the access token
    const decoded = verifyToken(token, 'access');

    // Find user and check if account is still active
    const user = await User.findById(decoded.id).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.',
        error: 'USER_NOT_FOUND'
      });
    }

    // Check if user account is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active. Please verify your email.',
        error: 'ACCOUNT_INACTIVE'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts.',
        error: 'ACCOUNT_LOCKED'
      });
    }

    // Attach user to request object (exclude sensitive fields)
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status
    };

    // Update last login info
    user.lastLogin = new Date();
    user.lastLoginIP = req.ip || req.connection.remoteAddress;
    await user.save({ validateBeforeSave: false });

    next();
  } catch (error) {
    if (error.message === 'Token has expired') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please refresh your token.',
        error: 'TOKEN_EXPIRED'
      });
    } else if (error.message === 'Invalid token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token provided.',
        error: 'INVALID_TOKEN'
      });
    } else {
      console.error('Authentication error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during authentication.',
        error: 'AUTH_ERROR'
      });
    }
  }
};

/**
 * Authorization middleware to check user roles
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        error: 'NOT_AUTHENTICATED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to access this resource.',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyToken(token, 'access');
      const user = await User.findById(decoded.id);
      
      if (user && user.status === 'active' && !user.isLocked) {
        req.user = {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

/**
 * Rate limiting middleware for authentication endpoints
 */
const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests max
  {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
    error: 'RATE_LIMIT_EXCEEDED'
  }
);

/**
 * Rate limiting for password reset requests
 */
const passwordResetRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  3, // 3 requests max
  {
    success: false,
    message: 'Too many password reset attempts. Please try again later.',
    error: 'PASSWORD_RESET_RATE_LIMIT'
  }
);

/**
 * Rate limiting for email verification requests
 */
const emailVerificationRateLimit = createRateLimit(
  10 * 60 * 1000, // 10 minutes
  3, // 3 requests max
  {
    success: false,
    message: 'Too many email verification attempts. Please try again later.',
    error: 'EMAIL_VERIFICATION_RATE_LIMIT'
  }
);

/**
 * Middleware to check if user owns the resource
 */
const checkResourceOwnership = (resourceIdParam = 'id') => {
  return (req, res, next) => {
    const resourceId = req.params[resourceIdParam];
    const userId = req.user.id;

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    if (resourceId !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.',
        error: 'RESOURCE_ACCESS_DENIED'
      });
    }

    next();
  };
};

/**
 * Middleware to validate refresh token
 */
const validateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required.',
        error: 'MISSING_REFRESH_TOKEN'
      });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, 'refresh');

    // Find user and check if refresh token exists
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token. User not found.',
        error: 'USER_NOT_FOUND'
      });
    }

    // Check if refresh token exists in user's token list
    const tokenExists = user.refreshTokens.some(
      tokenObj => tokenObj.token === refreshToken && tokenObj.expiresAt > new Date()
    );

    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token.',
        error: 'INVALID_REFRESH_TOKEN'
      });
    }

    req.user = user;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token.',
      error: 'INVALID_REFRESH_TOKEN'
    });
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  authRateLimit,
  passwordResetRateLimit,
  emailVerificationRateLimit,
  checkResourceOwnership,
  validateRefreshToken
};
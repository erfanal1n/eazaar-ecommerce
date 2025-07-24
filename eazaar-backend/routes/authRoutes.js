const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
  authenticate, 
  authRateLimit, 
  passwordResetRateLimit, 
  emailVerificationRateLimit,
  validateRefreshToken 
} = require('../middleware/authMiddleware');

// Public routes (no authentication required)

/**
 * @route   GET /api/auth/health
 * @desc    Authentication service health check
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication service is healthy',
    timestamp: new Date().toISOString(),
    routes: {
      register: '/api/auth/register',
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      refresh: '/api/auth/refresh-token',
      verify: '/api/auth/verify-email/:token'
    }
  });
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @rateLimit 5 requests per 15 minutes
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 * @rateLimit 5 requests per 15 minutes
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public (but requires valid refresh token)
 */
router.post('/refresh-token', validateRefreshToken, authController.refreshToken);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify user email address
 * @access  Public
 * @rateLimit 3 requests per 10 minutes
 */
router.get('/verify-email/:token', emailVerificationRateLimit, authController.verifyEmail);

// Protected routes (authentication required)

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate refresh token)
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const User = require('../models/UserNew');
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        error: 'USER_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          avatar: user.avatar,
          phone: user.phone,
          address: user.address,
          bio: user.bio,
          emailNotifications: user.emailNotifications,
          twoFactorEnabled: user.twoFactorEnabled,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile.',
      error: 'PROFILE_ERROR'
    });
  }
});

/**
 * @route   POST /api/auth/logout-all
 * @desc    Logout from all devices (invalidate all refresh tokens)
 * @access  Private
 */
router.post('/logout-all', authenticate, async (req, res) => {
  try {
    const User = require('../models/UserNew');
    const user = await User.findById(req.user.id);
    
    if (user) {
      user.refreshTokens = [];
      await user.save({ validateBeforeSave: false });
    }

    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully.'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout from all devices.',
      error: 'LOGOUT_ALL_ERROR'
    });
  }
});

/**
 * @route   GET /api/auth/sessions
 * @desc    Get active sessions (refresh tokens)
 * @access  Private
 */
router.get('/sessions', authenticate, async (req, res) => {
  try {
    const User = require('../models/UserNew');
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        error: 'USER_NOT_FOUND'
      });
    }

    // Filter out expired tokens and format response
    const activeSessions = user.refreshTokens
      .filter(tokenObj => tokenObj.expiresAt > new Date())
      .map(tokenObj => ({
        id: tokenObj._id,
        deviceInfo: tokenObj.deviceInfo,
        createdAt: tokenObj.createdAt,
        expiresAt: tokenObj.expiresAt
      }));

    res.status(200).json({
      success: true,
      message: 'Active sessions retrieved successfully.',
      data: {
        sessions: activeSessions,
        totalSessions: activeSessions.length
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve active sessions.',
      error: 'SESSIONS_ERROR'
    });
  }
});

/**
 * @route   DELETE /api/auth/sessions/:sessionId
 * @desc    Revoke a specific session (refresh token)
 * @access  Private
 */
router.delete('/sessions/:sessionId', authenticate, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const User = require('../models/UserNew');
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        error: 'USER_NOT_FOUND'
      });
    }

    // Remove the specific session
    const initialLength = user.refreshTokens.length;
    user.refreshTokens = user.refreshTokens.filter(
      tokenObj => tokenObj._id.toString() !== sessionId
    );

    if (user.refreshTokens.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.',
        error: 'SESSION_NOT_FOUND'
      });
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Session revoked successfully.'
    });
  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke session.',
      error: 'REVOKE_SESSION_ERROR'
    });
  }
});

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification
 * @access  Public
 * @rateLimit 3 requests per 10 minutes
 */
router.post('/resend-verification', emailVerificationRateLimit, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
        error: 'MISSING_EMAIL'
      });
    }

    const User = require('../models/UserNew');
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
        error: 'USER_NOT_FOUND'
      });
    }

    if (user.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified.',
        error: 'EMAIL_ALREADY_VERIFIED'
      });
    }

    // Generate new verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    const { sendEmail } = require('../config/email');
    const { secret } = require('../config/secret');
    
    const verificationUrl = `${secret.client_url}/email-verify/${verificationToken}`;
    
    const emailData = {
      from: secret.email_user,
      to: user.email,
      subject: 'Verify Your Email - EAZAAR',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2>Email Verification</h2>
          <p>Hello ${user.name},</p>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}" style="background: #0989FF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
          <p>This link will expire in 24 hours.</p>
        </div>
      `
    };

    await sendEmail(emailData);

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully.'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email.',
      error: 'RESEND_VERIFICATION_ERROR'
    });
  }
});

module.exports = router;
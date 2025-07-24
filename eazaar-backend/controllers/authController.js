const User = require('../models/UserNew');
const { generateTokenPair, verifyToken, hashToken } = require('../utils/tokenUtils');
const { sendEmail } = require('../config/email');
const { secret } = require('../config/secret');
const validator = require('validator');
const crypto = require('crypto');

/**
 * User Registration
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
        error: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
        error: 'INVALID_EMAIL'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
        error: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      status: 'active' // No email verification required
    });

    // Save user
    await user.save();

    // Skip email verification - user is immediately active
    // Generate email verification token
    // const verificationToken = user.generateEmailVerificationToken();

    // Skip email verification - user is immediately active
    // Send verification email
    // const verificationUrl = `${secret.client_url}/email-verify/${verificationToken}`;
    
    // Skip email sending since verification is disabled
    /*
    const emailData = {
      from: secret.email_user,
      to: user.email,
      subject: 'Verify Your Email - EAZAAR',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0989FF; margin: 0;">Welcome to EAZAAR!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${user.name}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for creating an account with EAZAAR. To complete your registration and start shopping, 
              please verify your email address by clicking the button below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: #0989FF; color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 5px; font-weight: bold; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 0;">
              <strong>Important:</strong> This verification link will expire in 24 hours for security reasons.
            </p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; color: #666; font-size: 14px;">
            <p>If you didn't create this account, please ignore this email.</p>
            <p>If you're having trouble clicking the button, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #0989FF;">${verificationUrl}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>© 2025 EAZAAR. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      await sendEmail(emailData);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail registration if email fails, but log it
    }
    */

    res.status(201).json({
      success: true,
      message: 'Registration successful! You can now login with your credentials.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          status: user.status
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors,
        error: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: 'REGISTRATION_ERROR'
    });
  }
};

/**
 * User Login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
        error: 'MISSING_CREDENTIALS'
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.',
        error: 'ACCOUNT_LOCKED'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Check if account is verified
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email address before logging in.',
        error: 'EMAIL_NOT_VERIFIED'
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Generate tokens
    const deviceInfo = req.get('User-Agent') || 'Unknown Device';
    const tokens = generateTokenPair(user, deviceInfo);

    // Store refresh token in database
    user.refreshTokens.push({
      token: tokens.refreshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      deviceInfo
    });

    // Clean up old refresh tokens (keep only last 5)
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }

    // Update last login
    user.lastLogin = new Date();
    user.lastLoginIP = req.ip || req.connection.remoteAddress;

    await user.save({ validateBeforeSave: false });

    // Set secure HTTP-only cookie for refresh token
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          avatar: user.avatar,
          lastLogin: user.lastLogin
        },
        tokens: {
          accessToken: tokens.accessToken,
          expiresIn: tokens.expiresIn,
          tokenType: tokens.tokenType
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: 'LOGIN_ERROR'
    });
  }
};

/**
 * Refresh Access Token
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: clientRefreshToken } = req.body;
    const cookieRefreshToken = req.cookies.refreshToken;
    
    const refreshToken = clientRefreshToken || cookieRefreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required.',
        error: 'MISSING_REFRESH_TOKEN'
      });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, 'refresh');
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token.',
        error: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Check if refresh token exists and is valid
    const tokenIndex = user.refreshTokens.findIndex(
      tokenObj => tokenObj.token === refreshToken && tokenObj.expiresAt > new Date()
    );

    if (tokenIndex === -1) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token.',
        error: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Generate new tokens
    const deviceInfo = req.get('User-Agent') || 'Unknown Device';
    const newTokens = generateTokenPair(user, deviceInfo);

    // Update refresh token in database
    user.refreshTokens[tokenIndex] = {
      token: newTokens.refreshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo
    };

    await user.save({ validateBeforeSave: false });

    // Update cookie
    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully.',
      data: {
        tokens: {
          accessToken: newTokens.accessToken,
          expiresIn: newTokens.expiresIn,
          tokenType: newTokens.tokenType
        }
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token.',
      error: 'TOKEN_REFRESH_ERROR'
    });
  }
};

/**
 * Logout User
 */
const logout = async (req, res) => {
  try {
    const { refreshToken: clientRefreshToken } = req.body;
    const cookieRefreshToken = req.cookies.refreshToken;
    
    const refreshToken = clientRefreshToken || cookieRefreshToken;

    if (refreshToken && req.user) {
      // Remove refresh token from database
      const user = await User.findById(req.user.id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(
          tokenObj => tokenObj.token !== refreshToken
        );
        await user.save({ validateBeforeSave: false });
      }
    }

    // Clear cookie
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logout successful.'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed.',
      error: 'LOGOUT_ERROR'
    });
  }
};

/**
 * Verify Email
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required.',
        error: 'MISSING_TOKEN'
      });
    }

    // Find user by verification token
    const user = await User.findByEmailVerificationToken(token);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token.',
        error: 'INVALID_TOKEN'
      });
    }

    // Activate user account
    user.status = 'active';
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save({ validateBeforeSave: false });

    // Generate tokens for immediate login
    const deviceInfo = req.get('User-Agent') || 'Unknown Device';
    const tokens = generateTokenPair(user, deviceInfo);

    // Store refresh token
    user.refreshTokens.push({
      token: tokens.refreshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo
    });

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You are now logged in.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        },
        tokens: {
          accessToken: tokens.accessToken,
          expiresIn: tokens.expiresIn,
          tokenType: tokens.tokenType
        }
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed.',
      error: 'VERIFICATION_ERROR'
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail
};
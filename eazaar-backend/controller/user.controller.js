const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserNew");
const { sendEmail } = require("../config/email");
const { generateToken, tokenForVerify } = require("../utils/token");
const { secret } = require("../config/secret");

// register user
// sign up
exports.signup = async (req, res,next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.send({ status: "failed", message: "Email already exists" });
    } else {
      const saved_user = await User.create(req.body);
      const token = saved_user.generateConfirmationToken();

      await saved_user.save({ validateBeforeSave: false });

      const mailData = {
        from: secret.email_user,
        to: `${req.body.email}`,
        subject: "Email Activation",
        subject: "Verify Your Email",
        html: `<h2>Hello ${req.body.name}</h2>
        <p>Verify your email address to complete the signup and login into your <strong>shofy</strong> account.</p>
  
          <p>This link will expire in <strong> 10 minute</strong>.</p>
  
          <p style="margin-bottom:20px;">Click this link for active your account</p>
  
          <a href="${secret.client_url}/email-verify/${token}" style="background:#0989FF;color:white;border:1px solid #0989FF; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Verify Account</a>
  
          <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@shofy.com</p>
  
          <p style="margin-bottom:0px;">Thank you</p>
          <strong>shofy Team</strong>
           `,
      };
      const message = "Please check your email to verify!";
      sendEmail(mailData, res, message);
    }
  } catch (error) {
    next(error)
  }
};

/**
 * 1. Check if Email and password are given
 * 2. Load user with email
 * 3. if not user send res
 * 4. compare password
 * 5. if password not correct send res
 * 6. check if user is active
 * 7. if not active send res
 * 8. generate token
 * 9. send user and token
 */
module.exports.login = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        error: "No user found. Please create an account",
      });
    }

    const isPasswordValid = user.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        status: "fail",
        error: "Password is not correct",
      });
    }

    if (user.status != "active") {
      return res.status(401).json({
        status: "fail",
        error: "Your account is not active yet.",
      });
    }

    const token = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res.status(200).json({
      status: "success",
      message: "Successfully logged in",
      data: {
        user: others,
        tokens: {
          accessToken: token,
        },
      },
    });
  } catch (error) {
    next(error)
  }
};

// confirmEmail
exports.confirmEmail = async (req, res,next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
      });
    }

    user.status = "active";
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    const accessToken = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res.status(200).json({
      status: "success",
      message: "Successfully activated your account.",
      data: {
        user: others,
        token: accessToken,
      },
    });
  } catch (error) {
    next(error)
  }
};

// forgetPassword
exports.forgetPassword = async (req, res,next) => {
  try {
    const { verifyEmail } = req.body;
    const user = await User.findOne({ email: verifyEmail });
    if (!user) {
      return res.status(404).send({
        message: "User Not found with this email!",
      });
    } else {
      const token = tokenForVerify(user);
      const body = {
        from: secret.email_user,
        to: `${verifyEmail}`,
        subject: "Password Reset",
        html: `<h2>Hello ${verifyEmail}</h2>
        <p>A request has been received to change the password for your <strong>Shofy</strong> account </p>

        <p>This link will expire in <strong> 10 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>

        <a href=${secret.client_url}/forget-password/${token} style="background:#0989FF;color:white;border:1px solid #0989FF; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password</a>

        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@shofy.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Shofy Team</strong>
        `,
      };
      user.confirmationToken = token;
      const date = new Date();
      date.setDate(date.getDate() + 1);
      user.confirmationTokenExpires = date;
      await user.save({ validateBeforeSave: false });
      const message = "Please check your email to reset password!";
      sendEmail(body, res, message);
    }
  } catch (error) {
    next(error)
  }
};

// confirm-forget-password
exports.confirmForgetPassword = async (req, res,next) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
      });
    } else {
      const newPassword = bcrypt.hashSync(password);
      await User.updateOne(
        { confirmationToken: token },
        { $set: { password: newPassword } }
      );

      user.confirmationToken = undefined;
      user.confirmationTokenExpires = undefined;

      await user.save({ validateBeforeSave: false });

      res.status(200).json({
        status: "success",
        message: "Password reset successfully",
      });
    }
  } catch (error) {
    next(error)
  }
};

// change password
exports.changePassword = async (req, res,next) => {
  try {
    const {email,password,googleSignIn,newPassword} = req.body || {};
    
    // Validate required fields
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }
    
    const user = await User.findOne({ email: email }).select('+password');
    
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Debug: Check user data
    console.log("User data:", {
      email: user.email,
      hasPassword: !!user.password,
      passwordValue: user.password ? "exists" : "missing",
      passwordType: typeof user.password,
      passwordLength: user.password ? user.password.length : 0,
      passwordActualValue: user.password ? user.password.substring(0, 10) + "..." : "null",
      googleSignIn: user.googleSignIn,
      isGoogleUser: user.isGoogleUser,
      requestPassword: password ? "provided" : "missing",
      requestPasswordType: typeof password,
      userObject: JSON.stringify(user, null, 2)
    });
    
    // For Google sign-in users, skip current password validation
    if(googleSignIn){
      const hashedPassword = bcrypt.hashSync(newPassword, 12);
      await User.updateOne({email:email},{password:hashedPassword})
      return res.status(200).json({ message: "Password changed successfully for Google account" });
    }
    
    // For regular users, validate current password
    if (!password) {
      return res.status(400).json({ message: "Current password is required" });
    }
    
    if (!user.password) {
      return res.status(400).json({ message: "User has no password set. Please use forgot password feature." });
    }
    
    // Compare current password - both values are guaranteed to exist here
    const isCurrentPasswordValid = bcrypt.compareSync(password, user.password);
    if(!isCurrentPasswordValid){
      return res.status(401).json({ message: "Incorrect current password" });
    }
    
    // Update with new password
    const hashedPassword = bcrypt.hashSync(newPassword, 12);
    await User.updateOne({email:email},{password:hashedPassword})
    res.status(200).json({ message: "Password changed successfully" });
    
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Internal server error during password change" });
  }
};

// update a profile
exports.updateUser = async (req, res,next) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    // Handle address field - can be string or object
    if (req.body.address) {
      if (typeof req.body.address === 'string') {
        // If frontend sends address as string, store it in street field
        user.address = {
          street: req.body.address,
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        };
      } else if (typeof req.body.address === 'object') {
        // If frontend sends address as object, merge with existing
        user.address = {
          ...user.address,
          ...req.body.address
        };
      }
    }
    
    user.bio = req.body.bio || user.bio; 
    
    const updatedUser = await user.save();
    const token = generateToken(updatedUser);
    res.status(200).json({
      status: "success",
      message: "Successfully updated profile",
      data: {
        user: updatedUser,
        token,
      },
    });
  } catch (error) {
    next(error)
  }
};

// get current user profile
exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    // Format user data for frontend compatibility
    const userData = {
      ...user.toObject(),
      // Convert address object to string for frontend compatibility
      address: user.address?.street || ''
    };

    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

// signUpWithProvider
exports.signUpWithProvider = async (req, res,next) => {
  try {
    const user = jwt.decode(req.params.token);
    const isAdded = await User.findOne({ email: user.email });
    if (isAdded) {
      const token = generateToken(isAdded);
      res.status(200).send({
        status: "success",
        data: {
          token,
          user: {
            _id: isAdded._id,
            name: isAdded.name,
            email: isAdded.email,
            address: isAdded.address,
            phone: isAdded.phone,
            imageURL: isAdded.imageURL,
            googleSignIn:true,
          },
        },
      });
    } else {
      const newUser = new User({
        name: user.name,
        email: user.email,
        imageURL: user.picture,
        status: 'active'
      });

      const signUpUser = await newUser.save();
      // console.log(signUpUser)
      const token = generateToken(signUpUser);
      res.status(200).send({
        status: "success",
        data: {
          token,
          user: {
            _id: signUpUser._id,
            name: signUpUser.name,
            email: signUpUser.email,
            imageURL: signUpUser.imageURL,
            googleSignIn:true,
          }
        },
      });
    }
  } catch (error) {
    next(error)
  }
};

// Get all users for admin (excluding passwords)
exports.getAllUsers = async (req, res) => {
  try {
    const Order = require("../model/Order");
    
    // Get all users with order counts
    const users = await User.aggregate([
      {
        $match: { role: "user" } // Only get regular users, not admins
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "user",
          as: "orders"
        }
      },
      {
        $addFields: {
          orderCount: { $size: "$orders" }
        }
      },
      {
        $project: {
          password: 0, // Exclude password
          confirmationToken: 0,
          confirmationTokenExpires: 0,
          passwordResetToken: 0,
          passwordResetExpires: 0,
          orders: 0 // Don't send full order data
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user by admin
exports.updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Don't allow password updates through this endpoint
    delete updateData.password;
    delete updateData.role; // Prevent role changes for security
    
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password -confirmationToken -confirmationTokenExpires -passwordResetToken -passwordResetExpires");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Block/Unblock user
exports.toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'block' or 'unblock'
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.status = action === "block" ? "blocked" : "active";
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${action}ed successfully`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


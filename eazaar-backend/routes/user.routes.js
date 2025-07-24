const express = require('express');
const router = express.Router();
const userController= require('../controller/user.controller');
const verifyToken = require('../middleware/verifyToken');


// add a user
router.post("/signup", userController.signup);
// login
router.post("/login", userController.login);
// get current user profile
router.get("/me", verifyToken, userController.getCurrentUser);
// forget-password
router.patch('/forget-password', userController.forgetPassword);
// confirm-forget-password
router.patch('/confirm-forget-password', userController.confirmForgetPassword);
// change password
router.patch('/change-password', userController.changePassword);
// confirmEmail
router.get('/confirmEmail/:token', userController.confirmEmail);
// updateUser
router.put('/update-user/:id', verifyToken, userController.updateUser);
// register or login with google
router.post("/register/:token", userController.signUpWithProvider);

// Admin routes for user management
router.get("/admin/all-users", userController.getAllUsers);
router.put("/admin/update-user/:id", userController.updateUserByAdmin);
router.delete("/admin/delete-user/:id", userController.deleteUser);
router.patch("/admin/toggle-block/:id", userController.toggleUserBlock);

module.exports = router;
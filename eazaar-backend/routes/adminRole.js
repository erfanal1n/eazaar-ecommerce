const express = require("express");
const router = express.Router();
const {
  createAdminRole,
  getAllAdminRoles,
  getAdminRoleById,
  updateAdminRole,
  deleteAdminRole,
  getAvailablePagesForRole,
} = require("../controller/adminRoleController");

// Get available pages for role creation
router.get("/available-pages", getAvailablePagesForRole);

// Create a new admin role
router.post("/create", createAdminRole);

// Get all admin roles
router.get("/all", getAllAdminRoles);

// Get admin role by ID
router.get("/:id", getAdminRoleById);

// Update admin role
router.put("/:id", updateAdminRole);

// Delete admin role
router.delete("/:id", deleteAdminRole);

module.exports = router;
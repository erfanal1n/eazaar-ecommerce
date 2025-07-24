const express = require("express");
const verifyToken = require("../middleware/verifyToken");

// Import controller functions
const controller = require("../controller/invoice-settings.controller");
const { getInvoiceSettings, updateInvoiceSettings, resetInvoiceSettings } = controller;

const router = express.Router();

// Get invoice settings (public - needed for displaying invoices)
router.get("/", getInvoiceSettings);

// Update invoice settings (admin only)
router.put("/", verifyToken, updateInvoiceSettings);

// Reset invoice settings (admin only)
router.delete("/reset", verifyToken, resetInvoiceSettings);

module.exports = router;
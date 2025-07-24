const InvoiceSettings = require("../model/InvoiceSettings");

// Get invoice settings
const getInvoiceSettings = async (req, res) => {
  try {
    // Get the latest invoice settings (there should only be one record)
    let settings = await InvoiceSettings.findOne().sort({ updatedAt: -1 });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new InvoiceSettings({});
      await settings.save();
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error("Error getting invoice settings:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving invoice settings",
      error: error.message
    });
  }
};

// Update invoice settings
const updateInvoiceSettings = async (req, res) => {
  try {
    const updateData = req.body;
    
    // Add admin ID if available
    if (req.user && req.user.id) {
      updateData.adminId = req.user.id;
    }

    // Find existing settings or create new one
    let settings = await InvoiceSettings.findOne().sort({ updatedAt: -1 });
    
    if (settings) {
      // Update existing settings
      settings = await InvoiceSettings.findByIdAndUpdate(
        settings._id,
        updateData,
        { 
          new: true, 
          runValidators: true 
        }
      );
    } else {
      // Create new settings
      settings = new InvoiceSettings(updateData);
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: "Invoice settings updated successfully",
      data: settings
    });
  } catch (error) {
    console.error("Error updating invoice settings:", error);
    res.status(500).json({
      success: false,
      message: "Error updating invoice settings",
      error: error.message
    });
  }
};

// Reset invoice settings to default
const resetInvoiceSettings = async (req, res) => {
  try {
    // Delete existing settings
    await InvoiceSettings.deleteMany({});
    
    // Create new default settings
    const defaultSettings = new InvoiceSettings({});
    if (req.user && req.user.id) {
      defaultSettings.adminId = req.user.id;
    }
    await defaultSettings.save();

    res.status(200).json({
      success: true,
      message: "Invoice settings reset to default successfully",
      data: defaultSettings
    });
  } catch (error) {
    console.error("Error resetting invoice settings:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting invoice settings",
      error: error.message
    });
  }
};

module.exports = {
  getInvoiceSettings,
  updateInvoiceSettings,
  resetInvoiceSettings
};
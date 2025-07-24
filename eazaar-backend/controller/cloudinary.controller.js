const fs = require("fs");
const { cloudinaryServices } = require("../services/cloudinary.service");

// add image
const saveImageCloudinary = async (req, res, next) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    // Log file info for debugging
    console.log('File info:', {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      hasBuffer: !!req.file.buffer
    });

    // Check if buffer exists
    if (!req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "File buffer is missing",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinaryServices.cloudinaryImageUpload(
      req.file.buffer,
      {
        folder: 'coupons', // Organize uploads in folders
        resource_type: 'image',
        format: 'webp', // Convert to webp for better performance
        quality: 'auto:good',
        width: 500,
        height: 500,
        crop: 'limit'
      }
    );

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: result.secure_url,
        id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      },
    });
  } catch (err) {
    console.error('Cloudinary upload error:', {
      message: err.message,
      stack: err.stack,
      details: err
    });
    
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// add image
const addMultipleImageCloudinary = async (req, res) => {
  try {
    const files = req.files;

    // Array to store Cloudinary image upload responses
    const uploadResults = [];

    for (const file of files) {
      // Upload image to Cloudinary
      const result = await cloudinaryServices.cloudinaryImageUpload(file.path);

      // Store the Cloudinary response in the array
      uploadResults.push(result);
    }

    // Delete temporary local files
    for (const file of files) {
      fs.unlinkSync(file.path);
    }

    res.status(200).json({
      success: true,
      message: "image uploaded successfully",
      data:
        uploadResults.length > 0
          ? uploadResults.map((res) => ({
              url: res.secure_url,
              id: res.public_id,
            }))
          : [],
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Failed to upload image",
    });
  }
};

// cloudinary ImageDelete
const cloudinaryDeleteController = async (req, res) => {
  try {
    const { folder_name, id } = req.query;
    const public_id = `${folder_name}/${id}`;
    const result = await cloudinaryServices.cloudinaryImageDelete(public_id);
    res.status(200).json({
      success: true,
      message: "delete image successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Failed to delete image",
    });
  }
};

exports.cloudinaryController = {
  cloudinaryDeleteController,
  saveImageCloudinary,
  addMultipleImageCloudinary,
};

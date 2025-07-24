const { secret } = require("../config/secret");
const cloudinary = require("../utils/cloudinary");
const { Readable } = require('stream');

// cloudinary Image Upload
// const cloudinaryImageUpload = async (image) => {
//   console.log('image service',image)
//   const uploadRes = await cloudinary.uploader.upload(image, {
//     upload_preset: secret.cloudinary_upload_preset,
//   });
//   return uploadRes;
// };

const cloudinaryImageUpload = async (imageBuffer, uploadOptions = {}) => {
  try {
    // Validate buffer
    if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
      throw new Error('Invalid image buffer provided');
    }

    // Check Cloudinary configuration
    if (!secret.cloudinary_name) {
      throw new Error('Cloudinary cloud name is missing');
    }

    // Convert buffer to base64 data URL
    const base64String = imageBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64String}`;

    // Merge default options with provided options - use unsigned upload to bypass timestamp issues
    const options = {
      upload_preset: secret.cloudinary_upload_preset || 'ml_default',
      ...uploadOptions
    };

    console.log('Cloudinary upload options:', {
      ...options,
      api_key: secret.cloudinary_api_key ? 'present' : 'missing',
      api_secret: secret.cloudinary_api_secret ? 'present' : 'missing',
      cloud_name: secret.cloudinary_name || 'missing'
    });

    // Use signed upload for more reliable uploads
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: options.folder || 'products',
      resource_type: 'image',
      quality: 'auto:good',
      width: 800,
      height: 800,
      crop: 'limit'
    });

    console.log('Cloudinary upload success:', {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height
    });

    return result;

  } catch (error) {
    console.error('Cloudinary upload error:', {
      message: error.message,
      http_code: error.http_code || 'unknown',
      name: error.name,
      stack: error.stack
    });
    
    // Provide more specific error messages
    if (error.http_code === 401) {
      throw new Error('Cloudinary authentication failed - check API credentials');
    } else if (error.http_code === 400) {
      throw new Error(`Cloudinary request error: ${error.message}`);
    } else if (error.message.includes('timeout')) {
      throw new Error('Cloudinary upload timeout - please try again');
    } else {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }
};


// cloudinaryImageDelete
const cloudinaryImageDelete = async (public_id) => {
  const deletionResult = await cloudinary.uploader.destroy(public_id);
  return deletionResult;
};

exports.cloudinaryServices = {
  cloudinaryImageDelete,
  cloudinaryImageUpload,
};

'use client';
import React, { useState } from 'react';
// import { useUploadSliderAssetsMutation, useDeleteImageFromCloudinaryMutation } from '@/redux/testHeroBanner/testHeroBannerApi';
import { notifySuccess, notifyError } from '@/utils/toast';

interface ImageUploadFieldProps {
  label: string;
  currentImage?: {
    url: string;
    cloudinaryId: string;
    width: number;
    height: number;
  };
  onImageUpload: (imageData: any) => void;
  onImageDelete: () => void;
  imageType?: string;
  device?: string;
  placeholder?: string;
  allowUrlInput?: boolean;
  showSizeGuide?: boolean;
  bannerId?: string; // For Cloudinary cleanup
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  currentImage,
  onImageUpload,
  onImageDelete,
  imageType = 'background',
  device = 'desktop',
  placeholder = 'Upload image',
  allowUrlInput = false,
  showSizeGuide = true,
  bannerId
}) => {
  // const [uploadAssets, { isLoading: isUploading }] = useUploadSliderAssetsMutation();
  const isUploading = false;
  const uploadAssets = async (formData: any) => ({ unwrap: () => null });
  // const [deleteImage, { isLoading: isDeleting }] = useDeleteImageFromCloudinaryMutation();
  const isDeleting = false;
  const deleteImage = async () => null;
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Get recommended image size based on type and device
  const getRecommendedSize = () => {
    if (imageType === 'background') {
      switch (device) {
        case 'desktop': return '1920×1080px';
        case 'tablet': return '1024×768px';
        case 'mobile': return '768×1024px';
        default: return '1920×1080px';
      }
    } else {
      switch (device) {
        case 'desktop': return '800×600px';
        case 'tablet': return '600×450px';
        case 'mobile': return '400×300px';
        default: return '800×600px';
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('imageType', imageType);
      formData.append('device', device);
      if (bannerId) {
        formData.append('bannerId', bannerId);
      }

      const result = await uploadAssets(formData).unwrap();
      
      if (result.success && result.data) {
        onImageUpload(result.data);
        notifySuccess('Image uploaded successfully');
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      notifyError(error?.data?.message || 'Failed to upload image');
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    
    // Basic URL validation
    try {
      new URL(urlInput);
      onImageUpload({
        url: urlInput,
        cloudinaryId: '',
        width: 0,
        height: 0
      });
      setUrlInput('');
      setShowUrlInput(false);
      notifySuccess('Image URL added successfully');
    } catch {
      notifyError('Please enter a valid image URL');
    }
  };

  const handleImageDelete = async () => {
    if (!currentImage?.cloudinaryId && !bannerId) {
      notifyError('Cannot delete image: missing banner ID or cloudinary ID');
      return;
    }

    try {
      await deleteImage({ cloudinaryId: currentImage?.cloudinaryId, bannerId }).unwrap();
      onImageDelete();
      notifySuccess('Image deleted successfully');
    } catch (error: any) {
      console.error('Delete error:', error);
      const errorMessage = error?.data?.message || 'Failed to delete image';
      notifyError(errorMessage);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      {showSizeGuide && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Recommended size: <strong>{getRecommendedSize()}</strong>
              </p>
              <p className="text-xs text-blue-500 mt-1">
                Higher resolution images will be automatically optimized. Max file size: 5MB
              </p>
            </div>
          </div>
        </div>
      )}
      
      {currentImage?.url && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <img
            src={currentImage.url}
            alt={label}
            className="w-32 h-20 object-cover rounded-lg border border-gray-300 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {label}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentImage.width} × {currentImage.height}px
            </p>
          </div>
          <button
            type="button"
            onClick={handleImageDelete}
            disabled={isDeleting}
            className="flex-shrink-0 bg-red-500 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
            title="Delete image from Cloudinary and database"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      )}

      <div className="space-y-2">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id={`file-upload-${imageType}-${device}`}
          />
          <label
            htmlFor={`file-upload-${imageType}-${device}`}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Image
              </>
            )}
          </label>
        </div>

        {allowUrlInput && (
          <div>
            {!showUrlInput ? (
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Or enter image URL
              </button>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors duration-200"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUrlInput(false);
                    setUrlInput('');
                  }}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {placeholder && (
        <p className="text-xs text-gray-500">{placeholder}</p>
      )}
    </div>
  );
};

export default ImageUploadField;
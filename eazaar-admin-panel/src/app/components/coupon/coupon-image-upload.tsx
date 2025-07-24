import React, { useEffect, useState } from "react";
import Image from "next/image";
import useUploadImage from "@/hooks/useUploadImg";
import upload_default from "@assets/img/icons/upload.png";
import Loading from "../common/loading";
import { notifyError, notifySuccess } from "@/utils/toast";

// prop type
type IPropType = {
  setImage: React.Dispatch<React.SetStateAction<string>>;
  isSubmitted: boolean;
  image?: string;
  setIsSubmitted?: React.Dispatch<React.SetStateAction<boolean>>;
};

const CouponImageUpload = ({ setImage, isSubmitted, image, setIsSubmitted }: IPropType) => {
  const { handleImageUpload, uploadData, isError, isLoading, error } = useUploadImage();
  const [previewImage, setPreviewImage] = useState<string>("");

  // Handle file selection and upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      notifyError('Please select a valid image file (PNG, JPG, JPEG, WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notifyError('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to cloudinary
    await handleImageUpload(e);
  };

  // Set upload image
  useEffect(() => {
    if (isLoading && setIsSubmitted) {
      setIsSubmitted(false);
    }
  }, [isLoading, setIsSubmitted]);

  useEffect(() => {
    if (uploadData && !isError && !isLoading) {
      setImage(uploadData.data.url);
      setPreviewImage(uploadData.data.url);
      notifySuccess('Image uploaded successfully!');
    }
  }, [uploadData, isError, isLoading, setImage]);

  useEffect(() => {
    if (isError && error) {
      console.error('Upload error:', error);
      
      // Extract error message from different error formats
      let errorMessage = 'Failed to upload image. Please try again.';
      
      if (typeof error === 'object' && error !== null) {
        if ('data' in error && error.data && typeof error.data === 'object') {
          errorMessage = error.data.message || error.data.error || errorMessage;
        } else if ('message' in error && error.message) {
          errorMessage = error.message;
        } else if ('error' in error && error.error) {
          errorMessage = error.error;
        }
      }
      
      notifyError(errorMessage);
      setPreviewImage("");
    }
  }, [isError, error]);

  // Reset preview when form is submitted
  useEffect(() => {
    if (isSubmitted) {
      setPreviewImage("");
    }
  }, [isSubmitted]);

  const displayImage = () => {
    if (isLoading) {
      return <Loading loading={isLoading} spinner="scale" />;
    }
    
    if (previewImage) {
      return (
        <div className="relative">
          <Image 
            src={previewImage} 
            alt="Coupon logo preview" 
            width={100} 
            height={100} 
            className="object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => {
              setPreviewImage("");
              setImage("");
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
          >
            ×
          </button>
        </div>
      );
    }
    
    return (
      <Image 
        src={upload_default} 
        alt="Upload placeholder" 
        width={100} 
        height={100}
        className="opacity-50"
      />
    );
  };

  return (
    <div className="mb-6">
      <p className="mb-2 text-base text-black">
        Coupon Logo <span className="text-red-500">*</span>
      </p>
      <div className="text-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
        {displayImage()}
        <div className="mt-4">
          <input
            onChange={handleFileChange}
            type="file"
            name="image"
            id="couponImage"
            className="hidden"
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label
            htmlFor="couponImage"
            className="inline-block py-2 px-4 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            {previewImage ? 'Change Image' : 'Upload Logo'}
          </label>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Supported formats: PNG, JPG, JPEG, WEBP (Max: 5MB)
      </p>
      {isError && (
        <p className="text-red-500 text-sm mt-2 text-center">
          Upload failed. Please try again.
        </p>
      )}
    </div>
  );
};

export default CouponImageUpload;
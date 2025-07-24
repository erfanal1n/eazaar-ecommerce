import { useUploadImageMutation } from "@/redux/cloudinary/cloudinaryApi";

const useUploadImage = () => {
  const [uploadImage, { data: uploadData, isError, isLoading, error }] =
    useUploadImageMutation();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("=== IMAGE UPLOAD DEBUG START ===");
    console.log("1. Input change event triggered");
    
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log("2. File selected:");
      console.log("   - Name:", file.name);
      console.log("   - Size:", file.size, "bytes");
      console.log("   - Type:", file.type);
      console.log("   - Last modified:", new Date(file.lastModified));
      
      const formData = new FormData();
      formData.append("image", file);
      console.log("3. FormData created and file appended");
      console.log("4. Calling uploadImage API...");
      
      try {
        const result = await uploadImage(formData);
        console.log("5. Upload API response:", result);
      } catch (error) {
        console.log("5. Upload API error:", error);
      }
    } else {
      console.log("2. ❌ No file selected or invalid input");
    }
    console.log("=== IMAGE UPLOAD DEBUG END ===");
  };
  

  return {
    handleImageUpload,
    uploadData,
    isError,
    isLoading,
    error,
  };
};

export default useUploadImage;

import { notifySuccess, notifyError } from "@/utils/toast";
import { 
  useAddProductTypeMutation, 
  useEditProductTypeMutation 
} from "@/redux/product-type/productTypeApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';

const useProductTypeSubmit = () => {
  const [productTypeImg, setProductTypeImg] = useState<string>("");
  const [selectStatus, setSelectStatus] = useState<{ value: string; label: string } | null>({
    value: "active",
    label: "Active"
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const router = useRouter();

  // add product type
  const [
    addProductType,
    { data: productTypeData, isError, isLoading, error: addProdTypeErr },
  ] = useAddProductTypeMutation();

  // edit product type
  const [
    editProductType,
    { data: editProdTypeData, isError: editErr, isLoading: editLoading, error: editProdTypeErr },
  ] = useEditProductTypeMutation();

  // react hook form
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm();

  // handle submit product type
  const handleSubmitProductType = async (data: any) => {
    try {
      const productTypeData = {
        name: data?.name,
        description: data?.description || "",
        icon: productTypeImg || "",
        status: data?.status || "active",
      };

      const res = await addProductType({ ...productTypeData });
      
      if ("error" in res) {
        if ("data" in res.error) {
          const errorData = res.error.data as { message?: string };
          if (typeof errorData.message === "string") {
            return notifyError(errorData.message);
          }
        }
        return notifyError("Failed to add product type");
      } else {
        setIsSubmitted(true);
        reset();
        setProductTypeImg("");
        setSelectStatus({ value: "active", label: "Active" });
        notifySuccess("Product type added successfully!");
        router.push('/product-type');
      }
    } catch (error) {
      console.error("Error adding product type:", error);
      notifyError("An error occurred while adding the product type");
    }
  };

  // handle edit product type
  const handleEditProductType = async (data: any, id: string) => {
    try {
      const updateData: any = {};

      if (data?.name) updateData.name = data.name;
      if (data?.description !== undefined) updateData.description = data.description;
      if (productTypeImg) updateData.icon = productTypeImg;
      if (data?.status) updateData.status = data.status;

      const res = await editProductType({ id, data: updateData });
      
      if ("error" in res) {
        if ("data" in res.error) {
          const errorData = res.error.data as { message?: string };
          if (typeof errorData.message === "string") {
            return notifyError(errorData.message);
          }
        }
        return notifyError("Failed to update product type");
      } else {
        notifySuccess("Product type updated successfully!");
        router.push('/product-type');
      }
    } catch (error) {
      console.error("Error updating product type:", error);
      notifyError("An error occurred while updating the product type");
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    control,
    errors,
    reset,
    productTypeImg,
    setProductTypeImg,
    selectStatus,
    setSelectStatus,
    isSubmitted,
    setIsSubmitted,
    handleSubmitProductType,
    handleEditProductType,
    isLoading,
    editLoading,
  };
};

export default useProductTypeSubmit;
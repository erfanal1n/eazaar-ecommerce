"use client";
import React, { useEffect } from "react";
import useProductTypeSubmit from "@/hooks/useProductTypeSubmit";
import ProductTypeTables from "./product-type-tables";
import ProductTypeImgUpload from "./product-type-img-upload";
import ProductTypeName from "./product-type-name";
import ProductTypeDescription from "./product-type-description";
import ProductTypeStatus from "./product-type-status";
import ErrorMsg from "../common/error-msg";
import { useGetProductTypeQuery } from "@/redux/product-type/productTypeApi";

const EditProductType = ({ id }: { id: string }) => {
  const { data: productTypeData, isError, isLoading } = useGetProductTypeQuery(id);
  const {
    errors,
    control,
    register,
    handleSubmit,
    setProductTypeImg,
    productTypeImg,
    isSubmitted,
    selectStatus,
    setSelectStatus,
    handleEditProductType,
    setValue,
  } = useProductTypeSubmit();

  // Set default values when data is loaded
  useEffect(() => {
    if (productTypeData?.result) {
      const data = productTypeData.result;
      setValue("name", data.name);
      setValue("description", data.description || "");
      setValue("status", data.status);
      setProductTypeImg(data.icon || "");
      setSelectStatus(
        data.status === "active" 
          ? { value: "active", label: "Active" }
          : { value: "inactive", label: "Inactive" }
      );
    }
  }, [productTypeData, setValue, setProductTypeImg, setSelectStatus]);

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="bg-white px-8 py-8 rounded-md">
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !productTypeData?.result) {
    return (
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="bg-white px-8 py-8 rounded-md">
            <ErrorMsg msg="Product Type not found" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4">
        <form onSubmit={handleSubmit((data) => handleEditProductType(data, id))}>
          <div className="mb-6 bg-white px-8 py-8 rounded-md">
            {/* product type image upload */}
            <ProductTypeImgUpload
              isSubmitted={isSubmitted}
              setImage={setProductTypeImg}
              default_img={productTypeData.result.icon}
              image={productTypeImg}
            />
            {/* product type image upload */}

            {/* product type name */}
            <ProductTypeName register={register} errors={errors} />
            {/* product type name */}

            {/* Product Type Description */}
            <ProductTypeDescription register={register} />
            {/* Product Type Description */}

            {/* Product Type Status */}
            <ProductTypeStatus
              selectStatus={selectStatus}
              setSelectStatus={setSelectStatus}
              control={control}
              errors={errors}
            />
            {/* Product Type Status */}

            <button className="tp-btn px-7 py-2">Update Product Type</button>
          </div>
        </form>
      </div>
      <div className="col-span-12 lg:col-span-8">
        <ProductTypeTables />
      </div>
    </div>
  );
};

export default EditProductType;
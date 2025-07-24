"use client";
import React from "react";
import useProductTypeSubmit from "@/hooks/useProductTypeSubmit";
import ProductTypeTables from "./product-type-tables";
import ProductTypeImgUpload from "./product-type-img-upload";
import ProductTypeName from "./product-type-name";
import ProductTypeDescription from "./product-type-description";
import ProductTypeStatus from "./product-type-status";

const AddProductType = () => {
  const {
    errors,
    control,
    register,
    handleSubmit,
    handleSubmitProductType,
    setProductTypeImg,
    productTypeImg,
    isSubmitted,
    selectStatus,
    setSelectStatus,
  } = useProductTypeSubmit();

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4">
        <form onSubmit={handleSubmit(handleSubmitProductType)}>
          <div className="mb-6 bg-white px-8 py-8 rounded-md">
            {/* product type image upload */}
            <ProductTypeImgUpload
              isSubmitted={isSubmitted}
              setImage={setProductTypeImg}
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

            <button className="tp-btn px-7 py-2">Add Product Type</button>
          </div>
        </form>
      </div>
      <div className="col-span-12 lg:col-span-8">
        <ProductTypeTables />
      </div>
    </div>
  );
};

export default AddProductType;
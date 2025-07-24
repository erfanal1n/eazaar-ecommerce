"use client";
import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

type IProps = {
  register: UseFormRegister<any>;
  errors: FieldErrors;
};

const ProductTypeName = ({ register, errors }: IProps) => {
  return (
    <div className="mb-6">
      <p className="mb-0 text-base text-black">Product Type Name</p>
      <input
        {...register("name", {
          required: "Product Type Name is required!",
          maxLength: {
            value: 100,
            message: "Name cannot exceed 100 characters"
          }
        })}
        className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
        type="text"
        placeholder="Enter product type name"
      />
      {errors?.name && (
        <span className="text-sm text-red-500 mt-1 block">
          {errors.name.message as string}
        </span>
      )}
    </div>
  );
};

export default ProductTypeName;
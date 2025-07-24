"use client";
import React from "react";
import { UseFormRegister } from "react-hook-form";

type IProps = {
  register: UseFormRegister<any>;
};

const ProductTypeDescription = ({ register }: IProps) => {
  return (
    <div className="mb-6">
      <p className="mb-0 text-base text-black">Description</p>
      <textarea
        {...register("description", {
          maxLength: {
            value: 500,
            message: "Description cannot exceed 500 characters"
          }
        })}
        className="input w-full h-[120px] rounded-md border border-gray6 px-6 py-4 text-base resize-none"
        placeholder="Enter product type description (optional)"
      />
      <p className="text-xs text-gray-500 mt-1">
        Optional description to help identify this product type
      </p>
    </div>
  );
};

export default ProductTypeDescription;
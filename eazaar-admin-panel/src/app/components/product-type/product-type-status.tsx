"use client";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import Select from "react-select";

type IProps = {
  selectStatus: { value: string; label: string } | null;
  setSelectStatus: (status: { value: string; label: string } | null) => void;
  control: Control<any>;
  errors: FieldErrors;
};

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const ProductTypeStatus = ({ selectStatus, setSelectStatus, control, errors }: IProps) => {
  return (
    <div className="mb-6">
      <p className="mb-0 text-base text-black">Status</p>
      <div className="category-add-select select-bordered">
        <Controller
          name="status"
          control={control}
          rules={{ required: "Status is required!" }}
          render={({ field: { onChange, value } }) => (
            <Select
              value={selectStatus}
              onChange={(selectedOption) => {
                setSelectStatus(selectedOption);
                onChange(selectedOption?.value);
              }}
              options={statusOptions}
              placeholder="Select status"
              className="react-select-container"
              classNamePrefix="react-select"
              isClearable={false}
              isSearchable={false}
            />
          )}
        />
      </div>
      {errors?.status && (
        <span className="text-sm text-red-500 mt-1 block">
          {errors.status.message as string}
        </span>
      )}
    </div>
  );
};

export default ProductTypeStatus;
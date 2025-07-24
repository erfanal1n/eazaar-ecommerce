import React, { useEffect } from "react";
import ReactSelect from "react-select";
import { FieldErrors, Controller, Control } from "react-hook-form";
import ErrorMsg from "../common/error-msg";
import { useGetActiveProductTypesQuery } from "@/redux/product-type/productTypeApi";

// prop type
type IPropType = {
  errors: FieldErrors<any>;
  control: Control;
  setSelectProductType: React.Dispatch<React.SetStateAction<string[]>>;
  default_value?: string[] | string;
  isMultiple?: boolean;
};

const CouponProductType = ({
  errors,
  control,
  default_value,
  setSelectProductType,
  isMultiple = true,
}: IPropType) => {
  // Fetch active product types from API
  const { data: productTypesData, isLoading, isError } = useGetActiveProductTypesQuery();

  // handleSelectProduct for multiple selection
  const handleSelectProduct = (selectedOptions: any) => {
    if (isMultiple) {
      if (selectedOptions) {
        // Check if "All" is selected
        const allOption = selectedOptions.find((option: any) => option.value === "all");
        if (allOption) {
          setSelectProductType(["all"]);
        } else {
          const values = selectedOptions.map((option: any) => option.value);
          setSelectProductType(values);
        }
      } else {
        setSelectProductType([]);
      }
    } else {
      setSelectProductType(selectedOptions ? [selectedOptions.value] : []);
    }
  };

  // set default product
  useEffect(() => {
    if (default_value) {
      if (Array.isArray(default_value)) {
        setSelectProductType(default_value);
      } else {
        setSelectProductType([default_value]);
      }
    }
  }, [default_value, setSelectProductType]);

  // Prepare options for react-select
  const productTypeOptions = [
    // Add "All" option first
    { value: "all", label: "All Products" },
    // Add individual product types
    ...(productTypesData?.result?.map((productType) => ({
      value: productType.slug,
      label: productType.name,
    })) || [])
  ];

  // Get default value for react-select
  const getDefaultValue = () => {
    if (default_value) {
      if (Array.isArray(default_value)) {
        return default_value.map(val => 
          productTypeOptions.find(option => option.value === val)
        ).filter(Boolean);
      } else {
        const option = productTypeOptions.find(option => option.value === default_value);
        return isMultiple ? [option] : option;
      }
    }
    return isMultiple ? [] : null;
  };

  return (
    <>
      <Controller
        name="productType"
        control={control}
        rules={{
          required: default_value ? false : "Product type is required!",
        }}
        render={({ field }) => (
          <ReactSelect
            {...field}
            value={field.value}
            defaultValue={getDefaultValue()}
            onChange={(selectedOption) => {
              field.onChange(selectedOption);
              handleSelectProduct(selectedOption);
            }}
            options={productTypeOptions}
            isMulti={isMultiple}
            isLoading={isLoading}
            isDisabled={isLoading || isError}
            placeholder={
              isLoading 
                ? "Loading product types..." 
                : isError 
                  ? "Error loading product types" 
                  : isMultiple 
                    ? "Select product types (or All)..."
                    : "Select product type..."
            }
            closeMenuOnSelect={!isMultiple}
            hideSelectedOptions={false}
            isClearable={true}
            styles={{
              control: (provided, state) => ({
                ...provided,
                minHeight: '44px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                '&:hover': {
                  borderColor: '#9ca3af',
                },
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 9999,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: '200px',
                overflowY: 'auto',
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected 
                  ? '#3b82f6' 
                  : state.isFocused 
                    ? '#f3f4f6' 
                    : 'white',
                color: state.isSelected ? 'white' : '#374151',
                padding: '8px 12px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: state.isSelected ? '#3b82f6' : '#f9fafb',
                },
              }),
              multiValue: (provided) => ({
                ...provided,
                backgroundColor: '#dbeafe',
                borderRadius: '4px',
                border: '1px solid #93c5fd',
              }),
              multiValueLabel: (provided) => ({
                ...provided,
                color: '#1e40af',
                fontSize: '14px',
                fontWeight: '500',
              }),
              multiValueRemove: (provided) => ({
                ...provided,
                color: '#6b7280',
                borderRadius: '0 4px 4px 0',
                '&:hover': {
                  backgroundColor: '#ef4444',
                  color: 'white',
                },
              }),
              placeholder: (provided) => ({
                ...provided,
                color: '#9ca3af',
                fontSize: '14px',
              }),
              input: (provided) => ({
                ...provided,
                color: '#374151',
              }),
              singleValue: (provided) => ({
                ...provided,
                color: '#374151',
              }),
            }}
          />
        )}
      />
      <ErrorMsg msg={errors?.productType?.message as string} />
    </>
  );
};

export default CouponProductType;
import React, { useEffect } from "react";
import ReactSelect from "react-select";
import { FieldErrors, Controller, Control } from "react-hook-form";
import ErrorMsg from "../../common/error-msg";
import { useGetActiveProductTypesQuery } from "@/redux/product-type/productTypeApi";

// prop type
type IPropType = {
  errors: FieldErrors<any>;
  control: Control;
  setSelectProductType: React.Dispatch<React.SetStateAction<string>>;
  default_value?:string;
};

const ProductType = ({
  errors,
  control,
  default_value,
  setSelectProductType,
}: IPropType) => {
  // Fetch active product types from API
  const { data: productTypesData, isLoading, isError } = useGetActiveProductTypesQuery();

  // handleSelectProduct
  const handleSelectProduct = (value: string) => {
    setSelectProductType(value);
  };
  
  // set default product
  useEffect(() => {
    if(default_value){
      setSelectProductType(default_value)
    }
  }, [default_value, setSelectProductType])

  // Prepare options for react-select
  const productTypeOptions = productTypesData?.result?.map((productType) => ({
    value: productType.slug,
    label: productType.name,
  })) || [];
  
  return (
    <>
      <Controller
        name="productType"
        control={control}
        rules={{
          required: default_value
            ? false
            : "productType is required!",
        }}
        render={({ field }) => (
          <ReactSelect
            {...field}
            value={field.value}
            defaultValue={
              default_value
                ? {
                    label: default_value,
                    value: default_value,
                  }
                : {
                    label: isLoading ? "Loading..." : "Select..",
                    value: 0,
                  }
            }
            onChange={(selectedOption) => {
              field.onChange(selectedOption);
              handleSelectProduct(selectedOption?.value);
            }}
            options={productTypeOptions}
            isLoading={isLoading}
            isDisabled={isLoading || isError}
            placeholder={
              isLoading 
                ? "Loading product types..." 
                : isError 
                  ? "Error loading product types" 
                  : "Select product type..."
            }
          />
        )}
      />
      <ErrorMsg msg={errors?.productType?.message as string} />
    </>
  );
};

export default ProductType;

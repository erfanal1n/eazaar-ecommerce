import React, { useState, useEffect } from "react";
import {
  FieldErrors,
  UseFormRegister,
  Controller,
  Control,
} from "react-hook-form";
import { useGetAllBrandsQuery } from "@/redux/brand/brandApi";

import ReactSelect, { GroupBase } from "react-select";
import ErrorMsg from "../../common/error-msg";
import Loading from "../../common/loading";
import ProductType from "./product-type";
// prop type
type IPropType = {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control;
  setSelectProductType: React.Dispatch<React.SetStateAction<string>>;
  setSelectBrand: React.Dispatch<
    React.SetStateAction<{ name: string; id: string }>
  >;
  default_value?: {
    brand: string;
    product_type: string;
    unit: string;
  };
};

const ProductTypeBrand = ({
  register,
  errors,
  control,
  setSelectProductType,
  setSelectBrand,
  default_value,
}: IPropType) => {
  const { data: brands, isError, isLoading } = useGetAllBrandsQuery();

  const [hasDefaultValues, setHasDefaultValues] = useState<boolean>(false);
  // default value set
  useEffect(() => {
    if (
      default_value?.product_type &&
      default_value.brand &&
      !hasDefaultValues
    ) {
      const brand = brands?.result.find((b) => b.name === default_value.brand);
      if (brand) {
        setSelectBrand({ id: brand._id as string, name: default_value.brand });
        setSelectProductType(default_value.product_type);
        setHasDefaultValues(true);
      }
    }
  }, [
    default_value,
    brands,
    hasDefaultValues,
    setSelectBrand,
    setSelectProductType,
  ]);

  // decide what to render
  let content = null;
  if (isLoading) {
    content = (
      <div className="mb-5">
        <p className="mb-0 text-base text-black">Loading...</p>
        <Loading loading={isLoading} spinner="scale" />
      </div>
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && isError && brands?.result.length === 0) {
    content = <ErrorMsg msg="No Category Found" />;
  }

  if (!isLoading && !isError && brands?.success) {
    const brandItems = brands.result;

    // handleBrandChange
    const handleBrandChange = (selectBrand: string) => {
      console.log("=== BRAND SELECTION DEBUG ===");
      console.log("1. Brand selected:", selectBrand);
      
      const brand = brandItems.find((b) => b.name === selectBrand);
      console.log("2. Found brand object:", brand);
      
      if (brand) {
        const brandData = { id: brand._id as string, name: selectBrand };
        console.log("3. Setting brand state:", brandData);
        setSelectBrand(brandData);
      } else {
        console.log("3. ❌ Brand not found in brandItems");
      }
      console.log("=== BRAND SELECTION DEBUG END ===");
    };
    const option = brandItems.map((b) => ({
      value: b.name,
      label: b.name,
    })) as unknown as readonly (string | GroupBase<string>)[];

    content = (
      <div className="mb-5">
        <p className="mb-0 text-base text-black">Brands</p>
        <Controller
          name="brand"
          control={control}
          rules={{
            required: default_value?.brand ? false : "Brand is required!",
          }}
          render={({ field }) => (
            <ReactSelect
              {...field}
              value={field.value}
              defaultValue={
                default_value
                  ? {
                      label: default_value.brand,
                      value: default_value.brand,
                    }
                  : {
                      label: "Select..",
                      value: 0,
                    }
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption);
                handleBrandChange(selectedOption?.value);
              }}
              options={option}
            />
          )}
        />
        <ErrorMsg msg={errors?.brand?.message as string} />
        <span className="text-tiny leading-4">Set the product Brand.</span>
      </div>
    );
  }
  return (
    <div className="bg-white px-8 py-8 rounded-md mb-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-x-6">
        <div className="mb-5">
          <p className="mb-0 text-base text-black">ProductType</p>
          <ProductType
            control={control}
            errors={errors}
            default_value={default_value?.product_type}
            setSelectProductType={setSelectProductType}
          />
          <span className="text-tiny leading-4">
            Set the product ProductType.
          </span>
        </div>

        {content}

        <div className="mb-5">
          <p className="mb-0 text-base text-black">
            Unit <span className="text-red">*</span>
          </p>
          <input
            id="unit"
            {...register("unit", { required: `unit is required!` })}
            defaultValue={default_value?.unit}
            className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
            type="text"
            placeholder="Product unit"
          />
          <ErrorMsg msg={errors?.unit?.message as string} />
          <span className="text-tiny leading-4">Set the unit of product.</span>
        </div>
      </div>
    </div>
  );
};

export default ProductTypeBrand;

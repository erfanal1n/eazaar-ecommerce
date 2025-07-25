import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useAddCouponMutation, useEditCouponMutation, useGetCouponQuery } from "@/redux/coupon/couponApi";
import dayjs from "dayjs";

const useCouponSubmit = () => {
  const [logo, setLogo] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [selectProductType, setSelectProductType] = useState<string[]>([]);
  const [editId, setEditId] = useState<string>("");
  const router = useRouter();

  // add coupon
  const [addCoupon, { }] = useAddCouponMutation();
  // edit coupon
  const [editCoupon, { }] = useEditCouponMutation();
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();


  useEffect(() => {
    if (!openSidebar) {
      setLogo("")
      setSelectProductType([]);
      reset();
    }
  }, [openSidebar, reset])
  // submit handle
  const handleCouponSubmit = async (data: any) => {
    try {
      // Validate required fields
      if (!logo) {
        return notifyError("Please upload a coupon logo");
      }
      if (!selectProductType.length) {
        return notifyError("Please select at least one product type");
      }

      const coupon_data = {
        logo: logo,
        title: data?.name,
        couponCode: data?.code,
        endTime: dayjs(data.endtime).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        discountPercentage: Number(data?.discountpercentage),
        minimumAmount: Number(data?.minimumamount),
        productType: selectProductType,
      };

      console.log(coupon_data)
      const res = await addCoupon({ ...coupon_data });
      if ("error" in res) {
        if ("data" in res.error) {
          const errorData = res.error.data as { message?: string };
          if (typeof errorData.message === "string") {
            return notifyError(errorData.message);
          }
        }
      } else {
        notifySuccess("Coupon added successfully");
        setIsSubmitted(true);
        setLogo("")
        setOpenSidebar(false);
        setSelectProductType([]);
        reset();
      }
    } catch (error) {
      console.log(error);
      notifyError("Something went wrong");
    }
  };

   //handle Submit edit Category
   const handleSubmitEditCoupon = async (data: any, id: string) => {
    try {
      // Validate required fields
      if (!logo) {
        return notifyError("Please upload a coupon logo");
      }
      if (!selectProductType.length) {
        return notifyError("Please select at least one product type");
      }

      const coupon_data = {
        logo: logo,
        title: data?.name,
        couponCode: data?.code,
        endTime: dayjs(data.endtime).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        discountPercentage: Number(data?.discountpercentage),
        minimumAmount: Number(data?.minimumamount),
        productType: selectProductType,
      };
      const res = await editCoupon({ id, data: coupon_data });
      if ("error" in res) {
        if ("data" in res.error) {
          const errorData = res.error.data as { message?: string };
          if (typeof errorData.message === "string") {
            return notifyError(errorData.message);
          }
        }
      } else {
        notifySuccess("Coupon update successfully");
        router.push('/coupon')
        setIsSubmitted(true);
        reset();
      }
    } catch (error) {
      console.log(error);
      notifyError("Something went wrong");
    }
  };

  return {
    handleCouponSubmit,
    isSubmitted,
    setIsSubmitted,
    logo,
    setLogo,
    register,
    handleSubmit,
    errors,
    openSidebar,
    setOpenSidebar,
    control,
    selectProductType,
    setSelectProductType,
    handleSubmitEditCoupon,
    setEditId,
  };
};

export default useCouponSubmit;

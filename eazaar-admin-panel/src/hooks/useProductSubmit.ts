"use client";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { useForm } from "react-hook-form";
import {useRouter} from 'next/navigation';
import { useAddProductMutation, useEditProductMutation } from "@/redux/product/productApi";
import { notifyError, notifySuccess } from "@/utils/toast";

// ImageURL type
export interface ImageURL {
  color: {
    name?: string;
    clrCode?: string;
  };
  img: string;
  sizes?: string[];
}
type IBrand = {
  name: string;
  id: string;
};
type ICategory = {
  name: string;
  id: string;
};

type status = "in-stock" | "out-of-stock" | "discontinued";

const useProductSubmit = (productData?: any, refetchProduct?: () => void) => {
  const [sku, setSku] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [imageURLs, setImageURLs] = useState<ImageURL[]>([]);
  const [parent, setParent] = useState<string>("");
  const [children, setChildren] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [brand, setBrand] = useState<IBrand>({ name: "", id: "" });
  const [category, setCategory] = useState<ICategory>({ name: "", id: "" });
  const [status, setStatus] = useState<status>("in-stock");
  const [productType, setProductType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("");
  const [offerDate, setOfferDate] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [additionalInformation, setAdditionalInformation] = useState<
    {
      key: string;
      value: string;
    }[]
  >([]);
  const [tags, setTags] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const router = useRouter();

  // Initialize state with product data when editing
  useEffect(() => {
    if (productData) {
      console.log('Initializing form with product data:', productData);
      setSku(productData.sku || "");
      setImg(productData.img || "");
      setTitle(productData.title || "");
      setSlug(productData.slug || "");
      setUnit(productData.unit || "");
      setImageURLs(productData.imageURLs || []);
      setParent(productData.parent || "");
      setChildren(productData.children || "");
      setPrice(productData.price || 0);
      setDiscount(productData.discount || 0);
      setQuantity(productData.quantity || 0);
      setBrand(productData.brand || { name: "", id: "" });
      setCategory(productData.category || { name: "", id: "" });
      setStatus(productData.status || "in-stock");
      setProductType(productData.productType || "");
      setDescription(productData.description || "");
      setVideoId(productData.videoId || "");
      setOfferDate(productData.offerDate || { startDate: null, endDate: null });
      setAdditionalInformation(productData.additionalInformation || []);
      setTags(productData.tags || []);
      console.log('State initialized with:', {
        brand: productData.brand,
        category: productData.category,
        unit: productData.unit,
        videoId: productData.videoId,
        offerDate: productData.offerDate
      });
    }
  }, [productData]);


  // useAddProductMutation
  const [addProduct, { data: addProductData, isError, isLoading }] =
    useAddProductMutation();
  // useAddProductMutation
  const [editProduct, { data: editProductData, isError: editErr, isLoading: editLoading }] =
    useEditProductMutation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm();
  // resetForm
  const resetForm = () => {
    setSku("");
    setImg("");
    setTitle("");
    setSlug("");
    setUnit("");
    setImageURLs([]);
    setParent("");
    setChildren("");
    setPrice(0);
    setDiscount(0);
    setQuantity(0);
    setBrand({ name: "", id: "" });
    setCategory({ name: "", id: "" });
    setStatus("in-stock");
    setProductType("");
    setDescription("");
    setVideoId("");
    setOfferDate({
      startDate: null,
      endDate: null,
    });
    setAdditionalInformation([]);
    setTags([]);
    setSizes([]);
    reset();
  };

  // handle submit product
  const handleSubmitProduct = async (data: any) => {
    console.log("=== ADD PRODUCT DEBUG START ===");
    console.log("1. RAW FORM DATA RECEIVED:", data);
    console.log("2. FORM DATA KEYS:", Object.keys(data));
    console.log("3. CURRENT STATE VALUES:");
    console.log("   - img:", img);
    console.log("   - imageURLs:", imageURLs);
    console.log("   - parent:", parent);
    console.log("   - children:", children);
    console.log("   - brand:", brand);
    console.log("   - category:", category);
    console.log("   - status:", status);
    console.log("   - productType:", productType);
    console.log("   - offerDate:", offerDate);
    console.log("   - additionalInformation:", additionalInformation);
    console.log("   - tags:", tags);

    // product data
    const productData = {
      sku: data.SKU || "",
      img: img,
      title: data.title,
      slug: slugify(data.title, { replacement: "-", lower: true }),
      unit: data.unit || "pcs", // Default unit
      imageURLs: imageURLs,
      parent: parent || "", // Default empty parent
      children: children || "", // Default empty children
      price: Number(data.price),
      discount: Number(data.discount_percentage || 0),
      quantity: Number(data.quantity),
      brand: brand,
      category: category,
      status: status,
      offerDate: {
        startDate: offerDate.startDate,
        endDate: offerDate.endDate,
      },
      productType: productType,
      description: data.description || "",
      videoId: data.youtube_video_Id || "",
      additionalInformation: additionalInformation,
      tags: tags,
    };

    console.log('4. FINAL PRODUCT DATA TO SEND:', JSON.stringify(productData, null, 2));


    console.log("5. VALIDATION CHECKS:");
    if (!img) {
      console.log("   ❌ VALIDATION FAILED: Product image is required");
      return notifyError("Product image is required");
    }
    console.log("   ✅ Image validation passed");
    
    if (!category.name) {
      console.log("   ❌ VALIDATION FAILED: Category is required");
      return notifyError("Category is required");
    }
    console.log("   ✅ Category validation passed");
    
    if (Number(data.discount) > Number(data.price)) {
      console.log("   ❌ VALIDATION FAILED: Discount higher than price");
      return notifyError("Product price must be gether than discount");
    }
    console.log("   ✅ Price validation passed");
    
    console.log("6. SENDING API REQUEST...");
    try {
      const res = await addProduct(productData);
      console.log("7. API RESPONSE RECEIVED:", res);
      
      if ("error" in res) {
        console.log("8. API ERROR DETECTED:");
        console.log("   - Error object:", res.error);
        
        if ("data" in res.error) {
          const errorData = res.error.data as { message?: string };
          console.log("   - Error data:", errorData);
          
          if (typeof errorData.message === "string") {
            console.log("   - Error message:", errorData.message);
            return notifyError(errorData.message);
          }
        }
        console.log("   - Generic error occurred");
        return notifyError("An error occurred during product creation");
      } else {
        console.log("8. ✅ API SUCCESS!");
        console.log("   - Response data:", res.data);
        notifySuccess("Product created successFully");
        setIsSubmitted(true);
        resetForm();
        router.push('/product-grid')
      }
    } catch (error) {
      console.log("8. ❌ API EXCEPTION CAUGHT:");
      console.log("   - Error:", error);
      notifyError("Network error occurred");
    }
    
    console.log("=== ADD PRODUCT DEBUG END ===");
  };
  // handle edit product
  const handleEditProduct = async (data: any, id: string) => {
    console.log('FORM DEBUG - Raw form data received:', data);
    console.log('FORM DEBUG - All form keys:', Object.keys(data));
    console.log('FORM DEBUG - Discount variations:', {
      'discount_percentage': data.discount_percentage,
      'discount percentage': data["discount percentage"], 
      'discount': data.discount
    });
    console.log('FORM DEBUG - Current state values:', {
      img, brand, category, status, productType, 
      offerDate, additionalInformation, tags, imageURLs, parent, children
    });
    
    // product data
    const productData = {
      sku: data.SKU || data.sku,
      img: img,
      title: data.title,
      slug: slugify(data.title, { replacement: "-", lower: true }),
      unit: data.unit,
      imageURLs: imageURLs,
      parent: parent,
      children: children,
      price: Number(data.price),
      discount: Number(data.discount_percentage || data["discount_percentage"] || data["discount percentage"] || data.discount || 0),
      quantity: Number(data.quantity),
      brand: brand,
      category: category,
      status: status,
      offerDate: {
        startDate: offerDate.startDate,
        endDate: offerDate.endDate,
      },
      productType: productType,
      description: data.description,
      videoId: data.youtube_video_Id || data["youtube video Id"] || data.videoId,
      additionalInformation: additionalInformation,
      tags: tags,
    };
    console.log('edit productData---->', productData);
    console.log('DISCOUNT VALUE BEING SENT:', productData.discount, typeof productData.discount);
    console.log('API CALL - Sending to:', `/api/product/edit-product/${id}`);
    console.log('API CALL - Data being sent:', productData);
    const res = await editProduct({ id: id, data: productData });
    console.log('API RESPONSE:', res);
    if ("error" in res) {
      if ("data" in res.error) {
        const errorData = res.error.data as { message?: string };
        if (typeof errorData.message === "string") {
          return notifyError(errorData.message);
        }
      }
    } else {
      notifySuccess("Product edit successFully");
      setIsSubmitted(true);
      // Refetch the product data to show updated values immediately
      if (refetchProduct) {
        refetchProduct();
      }
      // Don't redirect immediately, stay on edit page with updated data
      // router.push('/product-grid')
      // resetForm();
    }
  };

  return {
    sku,
    setSku,
    img,
    setImg,
    title,
    setTitle,
    slug,
    setSlug,
    unit,
    setUnit,
    imageURLs,
    setImageURLs,
    parent,
    setParent,
    children,
    setChildren,
    price,
    setPrice,
    discount,
    setDiscount,
    quantity,
    setQuantity,
    brand,
    setBrand,
    category,
    setCategory,
    status,
    setStatus,
    productType,
    setProductType,
    description,
    setDescription,
    videoId,
    setVideoId,
    additionalInformation,
    setAdditionalInformation,
    tags,
    setTags,
    sizes,
    setSizes,
    handleSubmitProduct,
    handleEditProduct,
    register,
    handleSubmit,
    errors,
    control,
    offerDate,
    setOfferDate,
    setIsSubmitted,
    isSubmitted,
  };
};

export default useProductSubmit;
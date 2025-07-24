import { apiSlice } from "../api/apiSlice";
import {
  ProductTypeResponse,
  SingleProductTypeResponse,
  IAddProductType,
  IAddProductTypeResponse,
  IUpdateProductType,
  IUpdateProductTypeResponse,
  IProductTypeDeleteRes,
  IToggleProductTypeStatusResponse,
  IProductTypeStatsResponse,
  IProductTypeItem,
} from "@/types/product-type-management";

export const productTypeApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get all product types
    getAllProductTypes: builder.query<ProductTypeResponse, void>({
      query: () => `/product-type/all`,
      providesTags: ["AllProductType"],
      keepUnusedDataFor: 600,
    }),
    
    // get active product types
    getActiveProductTypes: builder.query<ProductTypeResponse, void>({
      query: () => `/product-type/active`,
      providesTags: ["ActiveProductType"],
      keepUnusedDataFor: 600,
    }),
    
    // get single product type
    getProductType: builder.query<SingleProductTypeResponse, string>({
      query: (id) => `/product-type/get/${id}`,
      providesTags: ["getProductType"],
    }),
    
    // get product type by slug
    getProductTypeBySlug: builder.query<SingleProductTypeResponse, string>({
      query: (slug) => `/product-type/slug/${slug}`,
      providesTags: ["getProductTypeBySlug"],
    }),
    
    // add product type
    addProductType: builder.mutation<IAddProductTypeResponse, IAddProductType>({
      query(data: IAddProductType) {
        return {
          url: `/product-type/add`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["AllProductType", "ActiveProductType"],
    }),
    
    // update product type
    editProductType: builder.mutation<
      IUpdateProductTypeResponse,
      { id: string; data: IUpdateProductType }
    >({
      query({ id, data }) {
        return {
          url: `/product-type/edit/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["AllProductType", "ActiveProductType", "getProductType"],
    }),
    
    // delete product type
    deleteProductType: builder.mutation<IProductTypeDeleteRes, string>({
      query(id: string) {
        return {
          url: `/product-type/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AllProductType", "ActiveProductType"],
    }),
    
    // toggle product type status
    toggleProductTypeStatus: builder.mutation<IToggleProductTypeStatusResponse, string>({
      query(id: string) {
        return {
          url: `/product-type/toggle-status/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["AllProductType", "ActiveProductType", "getProductType"],
    }),
    
    // get product type statistics
    getProductTypeStats: builder.query<IProductTypeStatsResponse, void>({
      query: () => `/product-type/stats`,
      providesTags: ["ProductTypeStats"],
      keepUnusedDataFor: 300,
    }),
    
    // add all product types (bulk)
    addAllProductTypes: builder.mutation<any, IProductTypeItem[]>({
      query(data: IProductTypeItem[]) {
        return {
          url: `/product-type/add-all`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["AllProductType", "ActiveProductType"],
    }),
  }),
});

export const {
  useGetAllProductTypesQuery,
  useGetActiveProductTypesQuery,
  useGetProductTypeQuery,
  useGetProductTypeBySlugQuery,
  useAddProductTypeMutation,
  useEditProductTypeMutation,
  useDeleteProductTypeMutation,
  useToggleProductTypeStatusMutation,
  useGetProductTypeStatsQuery,
  useAddAllProductTypesMutation,
} = productTypeApi;
import { apiSlice } from "../api/apiSlice";
import { BrandDelResponse, BrandResponse, IBrandAddResponse, IAddBrand } from "@/types/brand-type";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get all brands
    getAllBrands: builder.query<BrandResponse, void>({
      query: () => `/brand/all`,
      providesTags: ["AllBrands"],
      keepUnusedDataFor: 600,
    }),
    // add category
    addBrand: builder.mutation<IBrandAddResponse, IAddBrand>({
      query(data: IAddBrand) {
        return {
          url: `/brand/add`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["AllBrands"],
    }),
    // editCategory
    editBrand: builder.mutation<IBrandAddResponse, { id: string; data: Partial<IAddBrand> }>({
      query({ id, data }) {
        return {
          url: `/brand/edit/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["AllBrands", "getBrand"],
    }),
    // get single product
    getBrand: builder.query<IAddBrand, string>({
      query: (id) => `/brand/get/${id}`,
      providesTags: ['getBrand']
    }),
    // delete brand
    deleteBrand: builder.mutation<BrandDelResponse, string>({
      query(id: string) {
        return {
          url: `/brand/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AllBrands"],
    }),
  }),
});

export const {
  useGetAllBrandsQuery,
  useDeleteBrandMutation,
  useAddBrandMutation,
  useEditBrandMutation,
  useGetBrandQuery,
} = authApi;

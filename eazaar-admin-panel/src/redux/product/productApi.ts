import { apiSlice } from "../api/apiSlice";
import { IAddProduct,IReviewProductRes, ProductResponse } from "@/types/product-type";

interface IProductResponse {
  success: boolean;
  status: string;
  message: string;
  data: any;
}

interface IProductEditResponse {
  data: IAddProduct;
  message: string;
}

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // getUserOrders
    getAllProducts: builder.query<ProductResponse, void>({
      query: () => `/product/all`,
      providesTags: ["AllProducts"],
      keepUnusedDataFor: 600,
    }),
    // add product
    addProduct: builder.mutation<IProductResponse, IAddProduct>({
      query(data: IAddProduct) {
        return {
          url: `/product/add`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["AllProducts"],
    }),
    // edit product
    editProduct: builder.mutation<
      IProductEditResponse,
      { id: string; data: Partial<IAddProduct> }
    >({
      query({ id, data }) {
        return {
          url: `/product/edit-product/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["AllProducts"],
      // Optimistically update the cache
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate the specific product query to refetch fresh data
          dispatch(authApi.util.invalidateTags([{ type: 'Product', id }]));
        } catch {}
      },
    }),
    // get single product
    getProduct: builder.query<IAddProduct, string>({
      query: (id) => `/product/single-product/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    // get single product
    getReviewProducts: builder.query<IReviewProductRes, void>({
      query: () => `/product/review-product`,
      providesTags: ["ReviewProducts"]
    }),
    // get single product
    getStockOutProducts: builder.query<IReviewProductRes, void>({
      query: () => `/product/stock-out`,
      providesTags: ["StockOutProducts"]
    }),
     // adjust inventory
     adjustInventory: builder.mutation<
       { success: boolean; message: string; data: IAddProduct },
       { id: string; quantity: number; operation: 'add' | 'set' }
     >({
       query({ id, quantity, operation }) {
         return {
           url: `/product/adjust-inventory/${id}`,
           method: "PATCH",
           body: { quantity, operation },
         };
       },
       invalidatesTags: ["AllProducts"],
     }),
     // delete category
     deleteProduct: builder.mutation<{message:string}, string>({
      query(id: string) {
        return {
          url: `/product/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AllProducts"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useAddProductMutation,
  useEditProductMutation,
  useGetProductQuery,
  useGetReviewProductsQuery,
  useGetStockOutProductsQuery,
  useAdjustInventoryMutation,
  useDeleteProductMutation,
} = authApi;

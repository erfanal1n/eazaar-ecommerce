import { apiSlice } from "../api/apiSlice";
import {
  IOrderAmounts,
  ISalesReport,
  IMostSellingCategory,
  IDashboardRecentOrders,
  IGetAllOrdersRes,
  IUpdateStatusOrderRes,
  Order,
} from "@/types/order-amount-type";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // getUserOrders
    getDashboardAmount: builder.query<IOrderAmounts, void>({
      query: () => `/user-order/dashboard-amount`,
      providesTags: ["DashboardAmount"],
      keepUnusedDataFor: 600,
    }),
    // get sales report
    getSalesReport: builder.query<ISalesReport, void>({
      query: () => `/user-order/sales-report`,
      providesTags: ["DashboardSalesReport"],
      keepUnusedDataFor: 600,
    }),
    // get selling category
    getMostSellingCategory: builder.query<IMostSellingCategory, void>({
      query: () => `/user-order/most-selling-category`,
      providesTags: ["DashboardMostSellingCategory"],
      keepUnusedDataFor: 600,
    }),
    // get recent orders
    getRecentOrders: builder.query<IDashboardRecentOrders, void>({
      query: () => `/user-order/dashboard-recent-order?timestamp=${Date.now()}`,
      providesTags: ["DashboardRecentOrders"],
      keepUnusedDataFor: 30, // Reduced cache time to 30 seconds
    }),
    // get recent orders
    getAllOrders: builder.query<IGetAllOrdersRes, void>({
      query: () => `/order/orders`,
      providesTags: ["AllOrders"],
      keepUnusedDataFor: 600,
    }),
    // get recent orders
    getSingleOrder: builder.query<Order, string>({
      query: (id) => `/order/${id}`,
      keepUnusedDataFor: 600,
    }),
    // get recent orders
    updateStatus: builder.mutation<IUpdateStatusOrderRes, { id: string, status: { status: string } }>({
      query({ id, status }) {
        return {
          url: `/order/update-status/${id}`,
          method: "PATCH",
          body: status,
        };
      },
      invalidatesTags: ["AllOrders","DashboardRecentOrders"],
    }),
  }),
});

export const {
  useGetDashboardAmountQuery,
  useGetSalesReportQuery,
  useGetMostSellingCategoryQuery,
  useGetRecentOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateStatusMutation,
  useGetSingleOrderQuery,
} = authApi;

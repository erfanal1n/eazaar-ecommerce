import { apiSlice } from "../api/apiSlice";
import { InvoiceSettings } from "@/types/invoice-type";

export const invoiceSettingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get invoice settings
    getInvoiceSettings: builder.query<{success: boolean, data: InvoiceSettings}, void>({
      query: () => ({
        url: "/invoice-settings",
        method: "GET",
      }),
      providesTags: ["InvoiceSettings"],
    }),

    // Update invoice settings
    updateInvoiceSettings: builder.mutation<
      {success: boolean, message: string, data: InvoiceSettings}, 
      Partial<InvoiceSettings>
    >({
      query: (data) => ({
        url: "/invoice-settings",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["InvoiceSettings"],
    }),

    // Reset invoice settings
    resetInvoiceSettings: builder.mutation<
      {success: boolean, message: string, data: InvoiceSettings}, 
      void
    >({
      query: () => ({
        url: "/invoice-settings/reset",
        method: "DELETE",
      }),
      invalidatesTags: ["InvoiceSettings"],
    }),
  }),
});

export const {
  useGetInvoiceSettingsQuery,
  useUpdateInvoiceSettingsMutation,
  useResetInvoiceSettingsMutation,
} = invoiceSettingsApi;
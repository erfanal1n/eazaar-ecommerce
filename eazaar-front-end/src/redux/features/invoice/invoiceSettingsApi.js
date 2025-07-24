import { apiSlice } from "../../api/apiSlice";

export const invoiceSettingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get invoice settings
    getInvoiceSettings: builder.query({
      query: () => ({
        url: "invoice-settings",
        method: "GET",
      }),
      providesTags: ["InvoiceSettings"],
    }),
  }),
});

export const {
  useGetInvoiceSettingsQuery,
} = invoiceSettingsApi;
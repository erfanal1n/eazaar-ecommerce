import { apiSlice } from "../api/apiSlice";

export const currencyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get default currency (public endpoint)
    getDefaultCurrency: builder.query({
      query: () => '/currencies/default',
      providesTags: ['Currency'],
    }),

    // Get all active currencies
    getActiveCurrencies: builder.query({
      query: () => '/currencies/active?active=true',
      providesTags: ['Currency'],
    }),

    // Format amount with currency
    formatAmount: builder.mutation({
      query: (data) => ({
        url: '/currencies/format',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetDefaultCurrencyQuery,
  useGetActiveCurrenciesQuery,
  useFormatAmountMutation,
} = currencyApi;
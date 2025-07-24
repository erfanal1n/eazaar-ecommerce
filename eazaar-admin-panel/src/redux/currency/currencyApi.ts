import { apiSlice } from "@/redux/api/apiSlice";

export interface Currency {
  _id: string;
  name: string;
  code: string;
  symbol: string;
  position: 'before' | 'after';
  decimals: number;
  thousandsSeparator: string;
  decimalSeparator: string;
  isActive: boolean;
  isDefault: boolean;
  exchangeRate: number;
  description?: string;
  country?: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyResponse {
  success: boolean;
  message: string;
  data: Currency[];
  timestamp: string;
}

export interface SingleCurrencyResponse {
  success: boolean;
  message: string;
  data: Currency;
  timestamp: string;
}

export interface DefaultCurrencyResponse {
  success: boolean;
  message: string;
  data: Currency;
  timestamp: string;
}

export interface CreateCurrencyRequest {
  name: string;
  code: string;
  symbol: string;
  position: 'before' | 'after';
  decimals: number;
  thousandsSeparator: string;
  decimalSeparator: string;
  isActive: boolean;
  isDefault: boolean;
  exchangeRate: number;
  description?: string;
  country?: string;
  locale: string;
}

export interface UpdateCurrencyRequest extends Partial<CreateCurrencyRequest> {
  id: string;
}

export const currencyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all currencies
    getCurrencies: builder.query<CurrencyResponse, { active?: boolean }>({
      query: ({ active } = {}) => ({
        url: `/currencies${active ? '?active=true' : ''}`,
        method: 'GET',
      }),
      providesTags: ['Currency'],
    }),

    // Get default currency
    getDefaultCurrency: builder.query<DefaultCurrencyResponse, void>({
      query: () => ({
        url: '/currencies/default',
        method: 'GET',
      }),
      providesTags: ['Currency'],
    }),

    // Get currency by ID
    getCurrencyById: builder.query<SingleCurrencyResponse, string>({
      query: (id) => ({
        url: `/currencies/${id}`,
        method: 'GET',
      }),
      providesTags: ['Currency'],
    }),

    // Create new currency
    createCurrency: builder.mutation<SingleCurrencyResponse, CreateCurrencyRequest>({
      query: (data) => ({
        url: '/currencies',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Currency'],
    }),

    // Update currency
    updateCurrency: builder.mutation<SingleCurrencyResponse, UpdateCurrencyRequest>({
      query: ({ id, ...data }) => ({
        url: `/currencies/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Currency'],
    }),

    // Delete currency
    deleteCurrency: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/currencies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Currency'],
    }),

    // Set default currency
    setDefaultCurrency: builder.mutation<SingleCurrencyResponse, string>({
      query: (id) => ({
        url: `/currencies/${id}/set-default`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Currency'],
    }),

    // Toggle currency status
    toggleCurrencyStatus: builder.mutation<SingleCurrencyResponse, string>({
      query: (id) => ({
        url: `/currencies/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Currency'],
    }),

    // Format amount with currency
    formatAmount: builder.mutation<
      { success: boolean; message: string; data: { amount: number; formattedAmount: string; currency: { code: string; symbol: string; name: string } } },
      { amount: number; currencyId?: string }
    >({
      query: (data) => ({
        url: '/currencies/format',
        method: 'POST',
        body: data,
      }),
    }),

    // Seed default currencies
    seedDefaultCurrencies: builder.mutation<CurrencyResponse, {}>({
      query: () => ({
        url: '/currencies/seed-defaults',
        method: 'POST',
      }),
      invalidatesTags: ['Currency'],
    }),
  }),
});

export const {
  useGetCurrenciesQuery,
  useGetDefaultCurrencyQuery,
  useGetCurrencyByIdQuery,
  useCreateCurrencyMutation,
  useUpdateCurrencyMutation,
  useDeleteCurrencyMutation,
  useSetDefaultCurrencyMutation,
  useToggleCurrencyStatusMutation,
  useFormatAmountMutation,
  useSeedDefaultCurrenciesMutation,
} = currencyApi;
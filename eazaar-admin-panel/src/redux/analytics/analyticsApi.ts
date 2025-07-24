import { apiSlice } from "../api/apiSlice";

// Types for analytics data
export interface IBusinessOverviewKPIs {
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  monthlyOrders: number;
  activeCustomers: number;
  totalCustomers: number;
  conversionRate: number;
  revenueGrowth: number;
}

export interface IRevenueTrendItem {
  month: string;
  revenue: number;
  orders: number;
}

export interface IOrdersTrendItem {
  date: string;
  orders: number;
  revenue: number;
}

export interface IBusinessOverviewData {
  kpis: IBusinessOverviewKPIs;
  charts: {
    revenueTrend: IRevenueTrendItem[];
    ordersTrend: IOrdersTrendItem[];
  };
}

export interface ITopProduct {
  id: string;
  name: string;
  sold: number;
  revenue: number;
  image: string;
}

export interface ISalesByCategory {
  category: string;
  sales: number;
  quantity: number;
}

export interface ISalesProductsData {
  metrics: {
    totalProducts: number;
    activeProducts: number;
    outOfStockProducts: number;
    averageOrderValue: number;
  };
  topProducts: ITopProduct[];
  salesByCategory: ISalesByCategory[];
}

export interface ICustomerSegment {
  segment: string;
  customers: number;
  avgSpent: number;
}

export interface ICustomerGrowth {
  month: string;
  newCustomers: number;
}

export interface IOrderFrequency {
  frequency: string;
  customers: number;
}

export interface ITopCustomer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  orderCount: number;
  avgOrderValue: number;
}

export interface IAcquisitionTrend {
  month: string;
  acquired: number;
}

export interface ICustomerInsightsData {
  metrics: {
    totalCustomers: number;
    newCustomers: number;
    activeCustomers: number;
    monthlyActiveCustomers: number;
    retentionRate: number;
    avgLifetimeValue: number;
    avgOrdersPerCustomer: number;
    customerGrowthRate: number;
    customersWithOrders: number;
  };
  segments: ICustomerSegment[];
  customerGrowth: ICustomerGrowth[];
  orderFrequency: IOrderFrequency[];
  topCustomers: ITopCustomer[];
  acquisitionTrend: IAcquisitionTrend[];
}

export interface IReportItem {
  id: string;
  name: string;
  description: string;
  lastGenerated: string;
}

export interface IReportsData {
  summary: {
    totalRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    monthlyOrders: number;
    yearlyOrders: number;
  };
  availableReports: IReportItem[];
}

export const analyticsApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get business overview analytics
    getBusinessOverview: builder.query<IBusinessOverviewData, void>({
      query: () => `/analytics/business-overview`,
      transformResponse: (response: { success: boolean; data: IBusinessOverviewData }) => response.data,
      providesTags: ["Analytics"],
      keepUnusedDataFor: 300, // 5 minutes cache
    }),

    // Get sales and products analytics
    getSalesProducts: builder.query<ISalesProductsData, void>({
      query: () => `/analytics/sales-products`,
      transformResponse: (response: { success: boolean; data: ISalesProductsData }) => response.data,
      providesTags: ["Analytics"],
      keepUnusedDataFor: 300,
    }),

    // Get customer insights analytics
    getCustomerInsights: builder.query<ICustomerInsightsData, void>({
      query: () => `/analytics/customer-insights`,
      transformResponse: (response: { success: boolean; data: ICustomerInsightsData }) => response.data,
      providesTags: ["Analytics"],
      keepUnusedDataFor: 300,
    }),

    // Get reports data
    getReportsData: builder.query<IReportsData, void>({
      query: () => `/analytics/reports-data`,
      transformResponse: (response: { success: boolean; data: IReportsData }) => response.data,
      providesTags: ["Analytics"],
      keepUnusedDataFor: 300,
    }),

    // Get real sales data for reports
    getSalesReportData: builder.query<any, { dateRange: string }>({
      query: ({ dateRange }) => `/analytics/sales-report?dateRange=${dateRange}`,
      transformResponse: (response: { success: boolean; data: any }) => response.data,
      providesTags: ["Analytics"],
    }),

    // Get real customer data for reports
    getCustomerReportData: builder.query<any, { dateRange: string }>({
      query: ({ dateRange }) => `/analytics/customer-report?dateRange=${dateRange}`,
      transformResponse: (response: { success: boolean; data: any }) => response.data,
      providesTags: ["Analytics"],
    }),

    // Get real product data for reports
    getProductReportData: builder.query<any, { dateRange: string }>({
      query: ({ dateRange }) => `/analytics/product-report?dateRange=${dateRange}`,
      transformResponse: (response: { success: boolean; data: any }) => response.data,
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetBusinessOverviewQuery,
  useGetSalesProductsQuery,
  useGetCustomerInsightsQuery,
  useGetReportsDataQuery,
  useGetSalesReportDataQuery,
  useGetCustomerReportDataQuery,
  useGetProductReportDataQuery,
} = analyticsApi;
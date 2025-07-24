'use client';
import React, { useEffect } from 'react';
import { registerLicense } from '@syncfusion/ej2-base';
import { 
  ChartComponent, 
  SeriesCollectionDirective, 
  SeriesDirective, 
  Inject, 
  Legend, 
  Category, 
  Tooltip, 
  DataLabel, 
  LineSeries,
  AreaSeries,
  ColumnSeries,
  PieSeries,
  AccumulationChartComponent,
  AccumulationSeriesCollectionDirective,
  AccumulationSeriesDirective,
  AccumulationLegend,
  AccumulationDataLabel,
  AccumulationTooltip,
  MultiColoredLineSeries,
  MultiColoredAreaSeries,
  ColumnSeries3D,
  Highlight,
  Selection
} from '@syncfusion/ej2-react-charts';
import Wrapper from '@/layout/wrapper';
import Breadcrumb from '@/app/components/breadcrumb/breadcrumb';
import { useGetCustomerInsightsQuery } from '@/redux/analytics/analyticsApi';
import ErrorMsg from '@/app/components/common/error-msg';

const CustomerInsightsPage = () => {
  const { data: customerData, isLoading, isError } = useGetCustomerInsightsQuery();

  // Register Syncfusion license
  useEffect(() => {
    registerLicense('Ngo9BigBOggjHTQxAR8/V1JEaF5cXmRCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXhed3VWRWhcVEV+X0JWYEk=');
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value}%`;
  };

  if (isLoading) {
    return (
      <Wrapper>
        <div className="body-content px-8 py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
          <Breadcrumb title="Customer Insights" subtitle="Customer Insights" />
          <div className="text-center p-8">
            <h2 className="text-lg">Loading customer insights...</h2>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (isError) {
    return (
      <Wrapper>
        <div className="body-content px-8 py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
          <Breadcrumb title="Customer Insights" subtitle="Customer Insights" />
          <ErrorMsg msg="Failed to load customer insights data" />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        {/* breadcrumb start */}
        <Breadcrumb title="Customer Insights" subtitle="Customer Insights" />
        {/* breadcrumb end */}


        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          <div className="widget-item bg-white dark:bg-slate-800 p-6 flex justify-between rounded-md shadow-sm">
            <div>
              <h4 className="text-xl font-semibold text-slate-700 dark:text-white mb-1 leading-none">
                {formatNumber(customerData?.metrics?.totalCustomers || 0)}
              </h4>
              <p className="text-tiny leading-4">Total Customers</p>
              <div className="badge space-x-1 bg-blue-100 text-blue-600 mt-2">
                <div className="flex text-center font-normal text-sm">
                  <div className="px-1">
                    {customerData?.metrics?.customersWithOrders || 0} with orders
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-lg text-white rounded-full flex items-center justify-center h-12 w-12 shrink-0 bg-blue-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </span>
            </div>
          </div>

          <div className="widget-item bg-white dark:bg-slate-800 p-6 flex justify-between rounded-md shadow-sm">
            <div>
              <h4 className="text-xl font-semibold text-slate-700 dark:text-white mb-1 leading-none">
                {formatNumber(customerData?.metrics?.newCustomers || 0)}
              </h4>
              <p className="text-tiny leading-4">New Customers</p>
              <div className="badge space-x-1 bg-green-100 text-green-600 mt-2">
                <div className="flex text-center font-normal text-sm">
                  <div className="px-1">
                    {formatPercentage(customerData?.metrics?.customerGrowthRate || 0)} vs last month
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-lg text-white rounded-full flex items-center justify-center h-12 w-12 shrink-0 bg-green-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
              </span>
            </div>
          </div>

          <div className="widget-item bg-white dark:bg-slate-800 p-6 flex justify-between rounded-md shadow-sm">
            <div>
              <h4 className="text-xl font-semibold text-slate-700 dark:text-white mb-1 leading-none">
                {customerData?.metrics?.retentionRate || 0}%
              </h4>
              <p className="text-tiny leading-4">Customer Retention</p>
              <div className="badge space-x-1 bg-purple-100 text-purple-600 mt-2">
                <div className="flex text-center font-normal text-sm">
                  <div className="px-1">
                    {customerData?.metrics?.activeCustomers || 0} active customers
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-lg text-white rounded-full flex items-center justify-center h-12 w-12 shrink-0" style={{backgroundColor: '#8B5CF6'}}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </span>
            </div>
          </div>

          <div className="widget-item bg-white dark:bg-slate-800 p-6 flex justify-between rounded-md shadow-sm">
            <div>
              <h4 className="text-xl font-semibold text-slate-700 dark:text-white mb-1 leading-none">
                {formatCurrency(customerData?.metrics?.avgLifetimeValue || 0)}
              </h4>
              <p className="text-tiny leading-4">Avg Lifetime Value</p>
              <div className="badge space-x-1 bg-orange-100 text-orange-600 mt-2">
                <div className="flex text-center font-normal text-sm">
                  <div className="px-1">
                    {customerData?.metrics?.avgOrdersPerCustomer ? `${customerData.metrics.avgOrdersPerCustomer.toFixed(1)} avg orders` : ''}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-lg text-white rounded-full flex items-center justify-center h-12 w-12 shrink-0 bg-orange-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-12 lg:col-span-8">
            <div className="chart-single bg-white dark:bg-slate-800 py-3 px-3 sm:py-10 sm:px-10 h-fit rounded-md">
              <h3 className="text-xl">Customer Acquisition Trend</h3>
              <p className="text-sm text-slate-600 mb-4">Monthly customer acquisition over the last 12 months</p>
              <div className="h-[400px]">
                <ChartComponent
                  id="acquisition-trend-chart"
                  primaryXAxis={{ 
                    valueType: 'Category',
                    title: 'Month',
                    labelStyle: { color: '#6B7280' },
                    titleStyle: { color: '#374151' },
                    majorGridLines: { width: 0 },
                    lineStyle: { width: 0 }
                  }}
                  primaryYAxis={{ 
                    title: 'New Customers',
                    labelStyle: { color: '#6B7280' },
                    titleStyle: { color: '#374151' },
                    majorGridLines: { width: 1, color: '#E5E7EB' },
                    lineStyle: { width: 0 }
                  }}
                  tooltip={{ enable: true, format: '${point.x}: ${point.y} customers' }}
                  background="transparent"
                  height="100%"
                  chartArea={{ border: { width: 0 } }}
                >
                  <Inject services={[MultiColoredAreaSeries, Legend, Tooltip, DataLabel, Category]} />
                  <SeriesCollectionDirective>
                    <SeriesDirective
                      dataSource={customerData?.acquisitionTrend?.map((item, index) => ({
                        ...item,
                        color: index % 2 === 0 ? '#3B82F6' : '#10B981'
                      })) || []}
                      xName="month"
                      yName="acquired"
                      name="New Customers"
                      type="MultiColoredArea"
                      segmentAxis="X"
                      segments={[
                        { value: customerData?.acquisitionTrend?.[Math.floor((customerData?.acquisitionTrend?.length || 0) / 2)]?.month, color: '#3B82F6' },
                        { color: '#10B981' }
                      ]}
                      opacity={0.7}
                      border={{ width: 2 }}
                    />
                  </SeriesCollectionDirective>
                </ChartComponent>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="chart-widget bg-white dark:bg-slate-800 p-4 sm:p-10 rounded-md">
              <h3 className="text-xl mb-8">Customer Segments</h3>
              <p className="text-sm text-slate-600 mb-4">Distribution by spending amount</p>
              <div className="md:h-[252px] 2xl:h-[454px] w-full">
                <AccumulationChartComponent
                  id="customer-segments-chart"
                  tooltip={{ enable: true, format: '${point.x}: ${point.y} customers' }}
                  background="transparent"
                  height="100%"
                  width="100%"
                  legendSettings={{ visible: true, position: 'Bottom' }}
                >
                  <Inject services={[PieSeries, AccumulationLegend, AccumulationDataLabel, AccumulationTooltip]} />
                  <AccumulationSeriesCollectionDirective>
                    <AccumulationSeriesDirective
                      dataSource={customerData?.segments?.map((item, index) => ({
                        ...item,
                        radius: `${70 + index * 5}%`
                      })) || []}
                      xName="segment"
                      yName="customers"
                      type="Pie"
                      radius="70%"
                      innerRadius="0%"
                      dataLabel={{ 
                        visible: true, 
                        name: 'segment',
                        position: 'Outside',
                        font: { fontWeight: '600', size: '12px' },
                        connectorStyle: { length: '10px' }
                      }}
                      palettes={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']}
                      explode={true}
                      explodeOffset="10px"
                      explodeIndex={0}
                    />
                  </AccumulationSeriesCollectionDirective>
                </AccumulationChartComponent>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-12 lg:col-span-6">
            <div className="chart-single bg-white dark:bg-slate-800 py-3 px-3 sm:py-10 sm:px-10 h-fit rounded-md">
              <h3 className="text-xl">Customer Growth (6 Months)</h3>
              <p className="text-sm text-slate-600 mb-4">New customer registrations trend</p>
              <div className="h-[350px]">
                <ChartComponent
                  id="customer-growth-chart"
                  primaryXAxis={{ 
                    valueType: 'Category',
                    title: 'Month',
                    labelStyle: { color: '#6B7280' },
                    titleStyle: { color: '#374151' },
                    majorGridLines: { width: 0 },
                    lineStyle: { width: 0 }
                  }}
                  primaryYAxis={{ 
                    title: 'New Customers',
                    labelStyle: { color: '#6B7280' },
                    titleStyle: { color: '#374151' },
                    majorGridLines: { width: 1, color: '#E5E7EB' },
                    lineStyle: { width: 0 }
                  }}
                  tooltip={{ enable: true, format: '${point.x}: ${point.y} new customers' }}
                  background="transparent"
                  height="100%"
                  chartArea={{ border: { width: 0 } }}
                >
                  <Inject services={[MultiColoredLineSeries, Legend, Tooltip, DataLabel, Category]} />
                  <SeriesCollectionDirective>
                    <SeriesDirective
                      dataSource={customerData?.customerGrowth || []}
                      xName="month"
                      yName="newCustomers"
                      name="New Customers"
                      type="MultiColoredLine"
                      segmentAxis="X"
                      segments={[
                        { value: customerData?.customerGrowth?.[Math.floor((customerData?.customerGrowth?.length || 0) / 3)]?.month, color: '#FF6B6B' },
                        { value: customerData?.customerGrowth?.[Math.floor((customerData?.customerGrowth?.length || 0) * 2 / 3)]?.month, color: '#4ECDC4' },
                        { color: '#45B7D1' }
                      ]}
                      marker={{ 
                        visible: true, 
                        width: 10, 
                        height: 10,
                        shape: 'Circle',
                        border: { width: 2, color: '#ffffff' }
                      }}
                      width={4}
                    />
                  </SeriesCollectionDirective>
                </ChartComponent>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="chart-single bg-white dark:bg-slate-800 py-3 px-3 sm:py-10 sm:px-10 h-fit rounded-md">
              <h3 className="text-xl">Order Frequency Distribution</h3>
              <p className="text-sm text-slate-600 mb-4">How many orders customers typically place</p>
              <div className="h-[350px]">
                <ChartComponent
                  id="order-frequency-chart"
                  primaryXAxis={{ 
                    valueType: 'Category',
                    title: 'Order Frequency',
                    labelStyle: { color: '#6B7280' },
                    titleStyle: { color: '#374151' },
                    majorGridLines: { width: 0 },
                    lineStyle: { width: 0 }
                  }}
                  primaryYAxis={{ 
                    title: 'Number of Customers',
                    labelStyle: { color: '#6B7280' },
                    titleStyle: { color: '#374151' },
                    majorGridLines: { width: 1, color: '#E5E7EB' },
                    lineStyle: { width: 0 }
                  }}
                  tooltip={{ enable: true, format: '${point.x}: ${point.y} customers' }}
                  background="transparent"
                  height="100%"
                  chartArea={{ border: { width: 0 } }}
                  enableSideBySidePlacement={false}
                >
                  <Inject services={[ColumnSeries, Legend, Tooltip, DataLabel, Category, Highlight]} />
                  <SeriesCollectionDirective>
                    <SeriesDirective
                      dataSource={customerData?.orderFrequency || []}
                      xName="frequency"
                      yName="customers"
                      name="Customers"
                      type="Column"
                      columnFacet="Cylinder"
                      fill="url(#gradient1)"
                      cornerRadius={{ topLeft: 8, topRight: 8 }}
                      columnWidth={0.6}
                      columnSpacing={0.1}
                    />
                  </SeriesCollectionDirective>
                </ChartComponent>
                <svg style={{ height: 0 }}>
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#FF6B6B', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#4ECDC4', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Top Customers Table */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-md shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium tracking-wide text-slate-700 dark:text-white text-lg mb-0 leading-none">
              Top Customers by Spending
            </h3>
          </div>

          <div className="overflow-scroll 2xl:overflow-visible">
            <div className="w-[800px] 2xl:w-full">
              <table className="w-full text-lg text-left text-gray-500">
                <thead>
                  <tr className="border-b border-gray6">
                    <th className="text-start p-4 py-3 font-semibold text-slate-700 dark:text-white text-lg">Rank</th>
                    <th className="text-start p-4 py-3 font-semibold text-slate-700 dark:text-white text-lg">Customer</th>
                    <th className="text-start p-4 py-3 font-semibold text-slate-700 dark:text-white text-lg">Total Spent</th>
                    <th className="text-start p-4 py-3 font-semibold text-slate-700 dark:text-white text-lg">Orders</th>
                    <th className="text-start p-4 py-3 font-semibold text-slate-700 dark:text-white text-lg">Avg Order Value</th>
                  </tr>
                </thead>
                <tbody>
                  {customerData?.topCustomers?.slice(0, 10).map((customer, index) => (
                    <tr key={customer.id} className="border-b border-gray6">
                      <td className="p-4 py-3 text-lg text-slate-700 dark:text-white font-medium">
                        #{index + 1}
                      </td>
                      <td className="p-4 py-3 text-lg text-slate-700 dark:text-white font-medium">
                        <div>
                          <div className="font-medium text-slate-700 dark:text-white">{customer.name}</div>
                          <div className="text-sm text-slate-500">{customer.email}</div>
                        </div>
                      </td>
                      <td className="p-4 py-3 text-lg text-slate-700 dark:text-white font-medium">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="p-4 py-3 text-lg text-slate-700 dark:text-white font-medium">
                        {customer.orderCount}
                      </td>
                      <td className="p-4 py-3 text-lg text-slate-700 dark:text-white font-medium">
                        {formatCurrency(customer.avgOrderValue)}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={5} className="text-center p-4 text-lg">
                        No customer data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default CustomerInsightsPage;
'use client';
import React from 'react';
import { Title, Text, Grid, Col } from '@tremor/react';
import { useGetBusinessOverviewQuery } from '@/redux/analytics/analyticsApi';
import KPICards from './kpi-cards';
import RevenueChart from './revenue-chart';
import OrdersChart from './orders-chart';

const BusinessOverviewArea: React.FC = () => {
  const { data, isLoading, error } = useGetBusinessOverviewQuery();

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Title className="text-red-800">Error Loading Analytics</Title>
          <Text className="text-red-600 mt-2">
            Unable to load business overview data. Please check your connection and try again.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KPICards 
        data={data?.kpis || {
          totalRevenue: 0,
          monthlyRevenue: 0,
          totalOrders: 0,
          monthlyOrders: 0,
          activeCustomers: 0,
          totalCustomers: 0,
          conversionRate: 0,
          revenueGrowth: 0
        }} 
        isLoading={isLoading} 
      />

      {/* Charts */}
      <Grid numItems={1} numItemsLg={2} className="gap-6">
        <Col>
          <RevenueChart 
            data={data?.charts?.revenueTrend || []} 
            isLoading={isLoading} 
          />
        </Col>
        <Col>
          <OrdersChart 
            data={data?.charts?.ordersTrend || []} 
            isLoading={isLoading} 
          />
        </Col>
      </Grid>
    </div>
  );
};

export default BusinessOverviewArea;
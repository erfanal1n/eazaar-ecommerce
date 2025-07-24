'use client';
import React from 'react';
import { Card, Title, AreaChart } from '@tremor/react';
import { IRevenueTrendItem } from '@/redux/analytics/analyticsApi';

interface RevenueChartProps {
  data: IRevenueTrendItem[];
  isLoading?: boolean;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <Title>Revenue Trend</Title>
        <div className="mt-4 h-72 bg-gray-100 rounded animate-pulse"></div>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = data.map(item => ({
    month: item.month,
    Revenue: item.revenue,
    Orders: item.orders
  }));

  return (
    <Card>
      <Title>Revenue Trend (Last 12 Months)</Title>
      <AreaChart
        className="mt-4 h-72"
        data={chartData}
        index="month"
        categories={["Revenue"]}
        colors={["blue"]}
        valueFormatter={formatCurrency}
        yAxisWidth={80}
        showAnimation={true}
      />
    </Card>
  );
};

export default RevenueChart;
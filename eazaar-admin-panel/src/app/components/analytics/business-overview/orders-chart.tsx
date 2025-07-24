'use client';
import React from 'react';
import { Card, Title, BarChart } from '@tremor/react';
import { IOrdersTrendItem } from '@/redux/analytics/analyticsApi';

interface OrdersChartProps {
  data: IOrdersTrendItem[];
  isLoading?: boolean;
}

const OrdersChart: React.FC<OrdersChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <Title>Orders Trend</Title>
        <div className="mt-4 h-72 bg-gray-100 rounded animate-pulse"></div>
      </Card>
    );
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Take last 7 days for better visualization
  const chartData = data.slice(-7).map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    Orders: item.orders,
    Revenue: item.revenue
  }));

  return (
    <Card>
      <Title>Daily Orders (Last 7 Days)</Title>
      <BarChart
        className="mt-4 h-72"
        data={chartData}
        index="date"
        categories={["Orders"]}
        colors={["emerald"]}
        valueFormatter={formatNumber}
        yAxisWidth={60}
        showAnimation={true}
      />
    </Card>
  );
};

export default OrdersChart;
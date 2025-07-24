'use client';
import React from 'react';
import { Card, Title, Text, Metric, Flex, BadgeDelta, DeltaType } from '@tremor/react';
import { Grid, Col } from '@tremor/react';
import { IBusinessOverviewKPIs } from '@/redux/analytics/analyticsApi';

interface KPICardsProps {
  data: IBusinessOverviewKPIs;
  isLoading?: boolean;
}

const KPICards: React.FC<KPICardsProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Col key={i}>
            <Card className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </Card>
          </Col>
        ))}
      </Grid>
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

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getDeltaType = (value: number): DeltaType => {
    if (value > 0) return 'moderateIncrease';
    if (value < 0) return 'moderateDecrease';
    return 'unchanged';
  };

  return (
    <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
      <Col>
        <Card>
          <Flex alignItems="start">
            <div>
              <Text>Total Gross Sales</Text>
              <Metric>{formatCurrency(data.totalRevenue)}</Metric>
            </div>
            <BadgeDelta deltaType={getDeltaType(data.revenueGrowth)}>
              {data.revenueGrowth > 0 ? '+' : ''}{data.revenueGrowth}%
            </BadgeDelta>
          </Flex>
        </Card>
      </Col>

      <Col>
        <Card>
          <Text>Monthly Gross Sales</Text>
          <Metric>{formatCurrency(data.monthlyRevenue)}</Metric>
          <Text className="mt-2 text-sm text-gray-600">
            This month
          </Text>
        </Card>
      </Col>

      <Col>
        <Card>
          <Text>Total Orders</Text>
          <Metric>{formatNumber(data.totalOrders)}</Metric>
          <Text className="mt-2 text-sm text-gray-600">
            {formatNumber(data.monthlyOrders)} this month
          </Text>
        </Card>
      </Col>

      <Col>
        <Card>
          <Text>Active Customers</Text>
          <Metric>{formatNumber(data.activeCustomers)}</Metric>
          <Text className="mt-2 text-sm text-gray-600">
            {data.conversionRate}% conversion rate
          </Text>
        </Card>
      </Col>
    </Grid>
  );
};

export default KPICards;
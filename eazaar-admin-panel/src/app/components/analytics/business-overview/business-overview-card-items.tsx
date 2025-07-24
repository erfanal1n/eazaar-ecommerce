"use client";
import React from "react";
import { MonthSales, Received, Sales, TotalOrders } from "@/svg";
import { useGetBusinessOverviewQuery } from "@/redux/analytics/analyticsApi";
import ErrorMsg from "../../common/error-msg";

type IPropType = {
  title: string;
  amount: number | string;
  growth?: number;
  icon: React.ReactNode;
  clr: string;
  clr2: string;
};

function CardItem({ title, amount, growth, icon, clr, clr2 }: IPropType) {
  const formatValue = (value: number | string) => {
    if (typeof value === 'number') {
      if (title.includes('Revenue') || title.includes('Value') || title.includes('Sales')) {
        return `$${value.toLocaleString()}`;
      }
      if (title.includes('Rate') || title.includes('Growth')) {
        return `${value}%`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <div className="widget-item bg-white p-6 flex justify-between rounded-md">
      <div>
        <h4 className="text-xl font-semibold text-slate-700 mb-1 leading-none">
          {formatValue(amount)}
        </h4>
        <p className="text-tiny leading-4">{title}</p>
        {growth !== undefined && (
          <div className={`badge space-x-1 ${clr}`}>
            <div className="flex text-center font-normal text-gray-50">
              <div className="px-1">
                {growth > 0 ? '+' : ''}{growth}% vs last month
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <span
          className={`text-lg text-white rounded-full flex items-center justify-center h-12 w-12 shrink-0 ${clr2}`}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}

const BusinessOverviewCardItems = () => {
  const {
    data: businessData,
    isError,
    isLoading,
  } = useGetBusinessOverviewQuery();

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error loading business data" />;
  }

  if (!isLoading && !isError && businessData?.kpis) {
    const kpis = businessData.kpis;
    content = (
      <>
        <CardItem
          title="Total Gross Sales"
          amount={kpis.totalRevenue}
          growth={kpis.revenueGrowth}
          icon={<Received />}
          clr="text-success bg-success/10"
          clr2="bg-success"
        />
        <CardItem
          title="Monthly Gross Sales"
          amount={kpis.monthlyRevenue}
          icon={<Sales />}
          clr="text-purple bg-purple/10"
          clr2="bg-purple"
        />
        <CardItem
          title="Total Orders"
          amount={kpis.totalOrders}
          icon={<TotalOrders />}
          clr="text-info bg-info/10"
          clr2="bg-info"
        />
        <CardItem
          title="Conversion Rate"
          amount={kpis.conversionRate}
          icon={<MonthSales />}
          clr="text-warning bg-warning/10"
          clr2="bg-warning"
        />
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {content}
    </div>
  );
};

export default BusinessOverviewCardItems;
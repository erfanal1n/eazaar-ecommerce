"use client";
import React from "react";
import { useGetBusinessOverviewQuery } from "@/redux/analytics/analyticsApi";

const BusinessOverviewRecentData = () => {
  const { data: businessData, isLoading } = useGetBusinessOverviewQuery();

  const recentTrends = businessData?.charts?.ordersTrend?.slice(-7) || [];

  return (
    <div className="grid grid-cols-12 gap-6 mb-6">
      <div className="bg-white p-8 col-span-12 xl:col-span-12 2xl:col-span-12 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium tracking-wide text-slate-700 text-lg mb-0 leading-none">
            Recent Performance (Last 7 Days)
          </h3>
        </div>

        {/* table */}
        <div className="overflow-scroll 2xl:overflow-visible">
          <div className="w-[700px] 2xl:w-full">
            <table className="w-full text-lg text-left text-gray-500">
              <thead>
                <tr className="border-b border-gray6">
                  <th className="text-start p-4 py-3 font-semibold text-slate-700 text-lg">Date</th>
                  <th className="text-start p-4 py-3 font-semibold text-slate-700 text-lg">Orders</th>
                  <th className="text-start p-4 py-3 font-semibold text-slate-700 text-lg">Gross Sales</th>
                  <th className="text-start p-4 py-3 font-semibold text-slate-700 text-lg">Avg Order Value</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-lg">
                      Loading recent data...
                    </td>
                  </tr>
                ) : recentTrends.length > 0 ? (
                  recentTrends.map((trend, index) => {
                    const avgOrderValue = trend.orders > 0 ? trend.revenue / trend.orders : 0;
                    return (
                      <tr key={index} className="border-b border-gray6">
                        <td className="p-4 py-3 text-lg text-slate-700 font-medium">
                          {new Date(trend.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="p-4 py-3 text-lg text-slate-700 font-medium">{trend.orders}</td>
                        <td className="p-4 py-3 text-lg text-slate-700 font-medium">${trend.revenue.toLocaleString()}</td>
                        <td className="p-4 py-3 text-lg text-slate-700 font-medium">${avgOrderValue.toFixed(2)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-lg">
                      No recent data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessOverviewRecentData;
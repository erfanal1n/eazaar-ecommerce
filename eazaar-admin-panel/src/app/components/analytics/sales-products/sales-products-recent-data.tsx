"use client";
import React from "react";
import { useGetSalesProductsQuery } from "@/redux/analytics/analyticsApi";

const SalesProductsRecentData = () => {
  const { data: salesData, isLoading } = useGetSalesProductsQuery();

  const topProducts = salesData?.topProducts?.slice(0, 10) || [];

  return (
    <div className="grid grid-cols-12 gap-6 mb-6">
      <div className="bg-white p-8 col-span-12 xl:col-span-12 2xl:col-span-12 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium tracking-wide text-slate-700 text-lg mb-0 leading-none">
            Top Selling Products
          </h3>
        </div>

        {/* table */}
        <div className="overflow-scroll 2xl:overflow-visible">
          <div className="w-[1000px] 2xl:w-full">
            <table className="w-full text-lg text-left text-gray-500">
              <thead>
                <tr className="border-b border-gray6">
                  <th className="text-start p-4 py-3 font-semibold text-slate-700 text-lg">Rank</th>
                  <th className="text-start p-4 py-3 font-semibold text-slate-700 text-lg">Product Name</th>
                  <th className="text-start p-4 py-3 font-semibold text-slate-700 text-lg">Quantity Sold</th>
                  <th className="text-start p-4 py-3 font-semibold text-slate-700 text-lg">Total Sales Value</th>
                  <th className="text-start p-4 py-3 font-semibold text-slate-700 text-lg">Gross Revenue (40%)</th>
                  <th className="text-start p-4 py-3 font-semibold text-slate-700 text-lg">Avg Price</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-lg">
                      Loading product data...
                    </td>
                  </tr>
                ) : topProducts.length > 0 ? (
                  topProducts.map((product, index) => {
                    const avgPrice = product.sold > 0 ? ((product as any).salesValue || (product as any).revenue) / product.sold : 0;
                    return (
                      <tr key={product.id || index} className="border-b border-gray6">
                        <td className="p-4 py-3 text-lg text-slate-700 font-medium">
                          #{index + 1}
                        </td>
                        <td className="p-4 py-3 text-lg text-slate-700 font-medium">
                          <div className="flex items-center space-x-3">
                            {product.image && (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-10 h-10 rounded-md object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            )}
                            <span className="max-w-[200px] truncate">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 py-3 text-lg text-slate-700 font-medium">
                          {product.sold.toLocaleString()}
                        </td>
                        <td className="p-4 py-3 text-lg text-slate-700 font-medium">
                          ${(product.salesValue || product.revenue).toLocaleString()}
                        </td>
                        <td className="p-4 py-3 text-lg text-slate-700 font-medium">
                          ${product.revenue.toLocaleString()}
                        </td>
                        <td className="p-4 py-3 text-lg text-slate-700 font-medium">
                          ${avgPrice.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-lg">
                      No product data available
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

export default SalesProductsRecentData;
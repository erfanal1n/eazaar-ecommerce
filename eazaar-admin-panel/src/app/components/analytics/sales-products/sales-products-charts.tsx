"use client";
import React, { useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { useGetSalesProductsQuery } from "@/redux/analytics/analyticsApi";
import ErrorMsg from "../../common/error-msg";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const SalesProductsCharts = () => {
  const { data: salesData, isLoading, isError } = useGetSalesProductsQuery();
  
  const [activeButton, setActiveButton] = useState({
    title: "Top Products",
    color: "blue",
  });

  const handleClick = ({ title, color }: { title: string; color: string }) => {
    setActiveButton({ title, color });
  };

  // Prepare data for charts
  let mainChartContent = null;
  let categoryPieContent = null;

  if (isLoading) {
    mainChartContent = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    mainChartContent = <ErrorMsg msg="There was an error loading sales data" />;
  }

  if (!isLoading && !isError && salesData?.topProducts) {
    const topProducts = salesData.topProducts.slice(0, 10);
    
    const productNames = topProducts.map(product => 
      product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name
    );
    const productSales = topProducts.map(product => product.revenue);
    const productQuantities = topProducts.map(product => product.sold);
    const fullProductNames = topProducts.map(product => product.name); // Store full names for tooltip

    const chartOptions = {
      data: {
        labels: productNames,
        datasets: [
          activeButton.title === "Top Products"
            ? {
                label: "Gross Revenue ($)",
                data: productSales,
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                borderColor: "#3B82F6",
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
              }
            : {
                label: "Quantity Sold",
                data: productQuantities,
                backgroundColor: "rgba(16, 185, 129, 0.8)",
                borderColor: "#10B981",
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
              },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#3B82F6',
            borderWidth: 1,
            callbacks: {
              title: function(context: any) {
                // Show full product name in tooltip title
                const dataIndex = context[0].dataIndex;
                return fullProductNames[dataIndex];
              },
              label: function(context: any) {
                const value = context.parsed.y;
                const label = context.dataset.label;
                if (label === "Gross Revenue ($)") {
                  return `${label}: $${value.toLocaleString()}`;
                } else {
                  return `${label}: ${value.toLocaleString()} units`;
                }
              }
            }
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              color: '#6B7280',
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#6B7280',
              maxRotation: 45,
            },
          },
        },
      },
    };

    mainChartContent = (
      <div className="h-full w-full">
        <Bar {...chartOptions} />
      </div>
    );
  }

  // Category distribution pie chart
  if (isLoading) {
    categoryPieContent = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    categoryPieContent = <ErrorMsg msg="There was an error loading category data" />;
  }

  if (!isLoading && !isError && salesData?.salesByCategory) {
    const categories = salesData.salesByCategory.slice(0, 6);
    
    const pieData = {
      labels: categories.map(cat => cat.category),
      datasets: [
        {
          label: "Sales by Category",
          data: categories.map(cat => cat.sales),
          backgroundColor: [
            "#3B82F6", // Blue
            "#10B981", // Green
            "#F59E0B", // Yellow
            "#EF4444", // Red
            "#8B5CF6", // Purple
            "#06B6D4", // Cyan
          ],
          borderColor: [
            "#2563EB",
            "#059669",
            "#D97706",
            "#DC2626",
            "#7C3AED",
            "#0891B2",
          ],
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    };

    const pieOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          callbacks: {
            label: function(context: any) {
              const value = context.parsed;
              return `${context.label}: $${value.toLocaleString()}`;
            }
          }
        },
      },
    };

    categoryPieContent = (
      <div className="mx-auto md:!w-[280px] md:!h-[280px] 2xl:!w-[380px] 2xl:!h-[380px]">
        <Doughnut data={pieData} options={pieOptions} />
      </div>
    );
  }

  return (
    <>
      <div className="chart-main-wrapper mb-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 2xl:col-span-8">
          <div className="chart-single bg-white py-3 px-3 sm:py-10 sm:px-10 h-fit sm:h-full rounded-md">
            <h3 className="text-xl font-medium tracking-wide text-slate-700 mb-4">Product Performance</h3>
            
            {/* Tab buttons */}
            <div className="text-sm font-medium text-center text-gray-500 border-b border-slate-200 mb-6">
              <ul className="flex flex-wrap -mb-px">
                <li className="mr-2">
                  <button
                    onClick={() => handleClick({ title: "Top Products", color: "blue" })}
                    type="button"
                    className={`chart-tab-btn inline-block p-2 rounded-t-lg border-transparent text-lg focus:border-0 focus-visible:border-0 focus-visible:shadow-white focus-visible:outline-0 ${
                      activeButton.title === "Top Products"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "hover:text-gray-600"
                    } focus:outline-none focus:border-none`}
                  >
                    Gross Revenue
                  </button>
                </li>

                <li className="mr-2">
                  <button
                    onClick={() => handleClick({ title: "Quantities", color: "green" })}
                    type="button"
                    className={`chart-tab-btn inline-block p-2 rounded-t-lg border-transparent text-lg focus:border-0 focus-visible:border-0 focus-visible:shadow-white focus-visible:outline-0 ${
                      activeButton.title === "Quantities"
                        ? "text-green-600 border-b-2 border-green-600"
                        : "hover:text-gray-600"
                    } focus:outline-none focus:border-none`}
                  >
                    Quantity Sold
                  </button>
                </li>
              </ul>
            </div>

            <div className="h-[300px] sm:h-[400px]">
              {mainChartContent}
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 2xl:col-span-4">
          <div className="chart-widget bg-white p-4 sm:p-10 rounded-md h-full">
            <h3 className="text-xl font-medium tracking-wide text-slate-700 mb-8">Sales by Category</h3>
            <div className="md:h-[300px] 2xl:h-[400px] w-full flex items-center justify-center">
              {categoryPieContent}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesProductsCharts;
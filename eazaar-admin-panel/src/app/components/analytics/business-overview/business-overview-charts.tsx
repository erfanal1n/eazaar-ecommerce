"use client";
import React, { useState } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
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
import { useGetBusinessOverviewQuery, useGetCustomerInsightsQuery } from "@/redux/analytics/analyticsApi";
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

const BusinessOverviewCharts = () => {
  const { data: businessData, isLoading: businessLoading, isError: businessError } = useGetBusinessOverviewQuery();
  const { data: customerData, isLoading: customerLoading, isError: customerError } = useGetCustomerInsightsQuery();
  
  const [activeButton, setActiveButton] = useState({
    title: "Revenue",
    color: "green",
  });

  const handleClick = ({ title, color }: { title: string; color: string }) => {
    setActiveButton({ title, color });
  };

  // Prepare data for Chart.js - EXACTLY like dashboard
  let revenueLineContent = null;
  let customerPieContent = null;

  if (businessLoading) {
    revenueLineContent = <h2>Loading....</h2>;
  }
  if (!businessLoading && businessError) {
    revenueLineContent = <ErrorMsg msg="There was an error" />;
  }

  if (!businessLoading && !businessError && businessData?.charts?.revenueTrend) {
    const revenueData = businessData.charts.revenueTrend;
    
    // Use REAL data from database
    const months = revenueData.map(item => {
      const date = new Date(item.month + '-01');
      return date.toLocaleDateString('en-US', { month: 'short' });
    });
    const revenueValues = revenueData.map(item => item.revenue);
    const orderValues = revenueData.map(item => item.orders);

    const lineOptions = {
      data: {
        labels: months,
        datasets: [
          activeButton.title === "Revenue"
            ? {
                label: "Gross Sales",
                data: revenueValues,
                borderColor: "#10B981",
                backgroundColor: "#10B981",
                borderWidth: 3,
                tension: 0.4,
                fill: false,
              }
            : {
                label: "Orders",
                data: orderValues,
                borderColor: "#F97316",
                backgroundColor: "#F97316",
                borderWidth: 3,
                tension: 0.4,
                fill: false,
              },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    revenueLineContent = (
      <div className="h-full w-full">
        <Line {...lineOptions} />
      </div>
    );
  }

  // Customer segments pie chart - EXACTLY like dashboard
  if (customerLoading) {
    customerPieContent = <h2>Loading....</h2>;
  }
  if (!customerLoading && customerError) {
    customerPieContent = <ErrorMsg msg="There was an error" />;
  }

  if (!customerLoading && !customerError && customerData?.segments) {
    // Use REAL customer segments data from database
    const segmentLabels = customerData.segments.map(segment => segment.segment);
    const segmentValues = customerData.segments.map(segment => segment.customers);
    
    const pieData = {
      labels: segmentLabels.length > 0 ? segmentLabels : ['$0-$100', '$100-$500', '$500-$1000', '$1000+'],
      datasets: [
        {
          label: "Customers",
          data: segmentValues.length > 0 ? segmentValues : [0, 0, 0, 0],
          backgroundColor: ["#50CD89", "#F1416C", "#3E97FF", "#ff9800"],
          borderColor: ["#50CD89", "#F1416C", "#3E97FF", "#ff9800"],
          borderWidth: 1,
        },
      ],
    };

    customerPieContent = (
      <div className="mx-auto md:!w-[240px] md:!h-[240px] 2xl:!w-[360px] 2xl:!h-[380px]">
        <Doughnut data={pieData} />
      </div>
    );
  }

  return (
    <>
      <div className="chart-main-wrapper mb-6 grid grid-cols-12 gap-6">
        <div className=" col-span-12 2xl:col-span-7">
          <div className="chart-single bg-white py-3 px-3 sm:py-10 sm:px-10 h-fit sm:h-full rounded-md">
            <h3 className="text-xl">Analytics Statistics</h3>
            
            {/* Tab buttons - EXACTLY like dashboard */}
            <div className="text-sm font-medium text-center text-gray-500 border-b border-slate-200 mb-4">
              <ul className="flex flex-wrap -mb-px">
                <li className="mr-2">
                  <button
                    onClick={() => handleClick({ title: "Revenue", color: "green" })}
                    type="button"
                    className={`chart-tab-btn inline-block p-2 rounded-t-lg border-transparent text-lg focus:border-0 focus-visible:border-0 focus-visible:shadow-white focus-visible:outline-0 ${
                      activeButton.title === "Revenue"
                        ? "text-green-600"
                        : "hover:text-gray-600"
                    }   focus:outline-none focus:border-none`}
                  >
                    Gross Sales
                  </button>
                </li>

                <li className="mr-2">
                  <button
                    onClick={() => handleClick({ title: "Orders", color: "red" })}
                    type="button"
                    className={`chart-tab-btn inline-block p-2 rounded-t-lg border-transparent text-lg focus:border-0 focus-visible:border-0 focus-visible:shadow-white focus-visible:outline-0 ${
                      activeButton.title === "Orders"
                        ? "text-orange-500"
                        : "hover:text-gray-600"
                    }  focus:outline-none focus:border-none`}
                  >
                    Orders
                  </button>
                </li>
              </ul>
            </div>

            <div className="h-[300px] sm:h-[400px]">
              {revenueLineContent}
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 2xl:col-span-5 space-y-6">
          <div className="chart-widget bg-white p-4 sm:p-10 rounded-md">
            <h3 className="text-xl mb-8">Customer Segments</h3>
            <div className="md:h-[252px] 2xl:h-[454px] w-full">{customerPieContent}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessOverviewCharts;
import { useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
// internal
import ErrorMsg from "../common/error-msg";
import { useGetSalesReportQuery } from "@/redux/order/orderApi";
Chart.register(CategoryScale);

// type
type TActiveBtnType = {
  title: string;
  color: string;
};

const LineChart = () => {
  const [activeButton, setActiveButton] = useState<TActiveBtnType>({
    title: "Sales",
    color: "green",
  });

  const handleClick = ({ title, color }: TActiveBtnType) => {
    setActiveButton({ title, color });
  };

  const { data: sales, isError, isLoading } = useGetSalesReportQuery();

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError && sales?.salesReport) {
    // console.log(sales?.salesReport);
    const salesReport = sales?.salesReport;

    // Sort data chronologically (oldest to newest, so latest appears on right)
    const sortedData = salesReport
      ?.slice()
      ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const barOptions = {
      data: {
        labels: sortedData?.map((or) => {
          // Format date to be more readable (e.g., "Jul 6" instead of "2025-07-06")
          const date = new Date(or.date);
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
        }),
        datasets: [
          activeButton.title === "Sales"
            ? {
                label: "Sales ($)",
                data: sortedData?.map((or) => or.total),
                borderColor: "#10B981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#10B981",
                pointBorderColor: "#10B981",
                pointRadius: 5,
                pointHoverRadius: 7,
              }
            : {
                label: "Orders",
                data: sortedData?.map((or) => or.order),
                borderColor: "#F97316",
                backgroundColor: "rgba(249, 115, 22, 0.1)",
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#F97316",
                pointBorderColor: "#F97316",
                pointRadius: 5,
                pointHoverRadius: 7,
              },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top' as const,
            labels: {
              usePointStyle: true,
              padding: 20,
            }
          },
          tooltip: {
            mode: 'index' as const,
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date',
              color: '#6B7280',
            },
            grid: {
              display: false,
            },
            ticks: {
              color: '#6B7280',
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: activeButton.title === "Sales" ? 'Sales Amount ($)' : 'Number of Orders',
              color: '#6B7280',
            },
            grid: {
              color: 'rgba(107, 114, 128, 0.1)',
            },
            ticks: {
              color: '#6B7280',
              callback: function(value: any) {
                if (activeButton.title === "Sales") {
                  return '$' + value.toLocaleString();
                }
                return value;
              }
            }
          }
        },
        interaction: {
          mode: 'nearest' as const,
          axis: 'x' as const,
          intersect: false,
        }
      },
    };

    content = (
      <div className="h-full w-full">
        <Line {...barOptions} />
      </div>
    );
  }

  return (
    <>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-slate-200 mb-4">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => handleClick({ title: "Sales", color: "green" })}
              type="button"
              className={`chart-tab-btn inline-block p-2 rounded-t-lg border-transparent text-lg focus:border-0 focus-visible:border-0 focus-visible:shadow-white focus-visible:outline-0 ${
                activeButton.title === "Sales"
                  ? "text-green-600"
                  : "hover:text-gray-600"
              }   focus:outline-none focus:border-none`}
            >
              Sales
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

      {/* chart start */}
      {content}
      {/* chart end */}
    </>
  );
};

export default LineChart;

"use client";
import React from "react";
import LineChart from "../chart/line-chart";
import PieChart from "../chart/pie-chart";

const SalesReport = () => {
 
  return (
    <>
      <div className="chart-main-wrapper mb-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-7 2xl:col-span-7">
          <div className="chart-single bg-white dark:bg-slate-800 py-6 px-6 sm:py-8 sm:px-8 rounded-md transition-colors duration-300 h-fit sm:h-full">
            <h3 className="text-xl dark:text-white mb-6">Sales Statistics</h3>
            <div className="h-[300px] sm:h-[400px]">
              <LineChart/>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5 2xl:col-span-5">
          <div className="chart-widget bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-md transition-colors duration-300 h-full">
            <h3 className="text-xl dark:text-white mb-6">Most Selling Category</h3>
            <div className="flex items-center justify-center min-h-[250px] sm:min-h-[350px]">
              <PieChart/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesReport;

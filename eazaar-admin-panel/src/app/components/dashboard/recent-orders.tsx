"use client";
import React, { useState } from "react";
import ErrorMsg from "../common/error-msg";
import TableItem from "./table-item";
import TableHead from "./table-head";
import Pagination from "../ui/Pagination";
import { useGetRecentOrdersQuery } from "@/redux/order/orderApi";
import usePagination from "@/hooks/use-pagination";

const RecentOrders = () => {
  const { data: recentOrders, isError, isLoading } = useGetRecentOrdersQuery();
  const paginationData = usePagination(recentOrders?.orders || [], 5);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2 className="text-center py-8 text-sm sm:text-base lg:text-lg">Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError && currentItems) {
    content = (
      <>
        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <table className="w-full text-xs sm:text-sm lg:text-base text-left text-gray-500 dark:text-slate-300">
            <TableHead />
            <tbody>
              {currentItems?.map((order) => (
                  <TableItem key={order._id} order={order} />
                ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
          {currentItems?.map((order) => (
            <div key={order._id} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-gray-600 dark:text-slate-300">Invoice:</span>
                  <p className="text-gray-900 dark:text-slate-200">#{order.invoice}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-600 dark:text-slate-300">Customer:</span>
                  <p className="text-gray-900 dark:text-slate-200 truncate">{order.name}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-600 dark:text-slate-300">Method:</span>
                  <p className="text-gray-900 dark:text-slate-200">
                    {order.paymentMethod === "COD" ? "Cash" : order.paymentMethod === "Card" ? "Card" : order.paymentMethod}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-gray-600 dark:text-slate-300">Price:</span>
                  <p className="text-gray-900 dark:text-slate-200">${order.totalAmount}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-gray-600 dark:text-slate-300">Order Date:</span>
                  <p className="text-gray-900 dark:text-slate-200 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-gray-600 dark:text-slate-300">Status:</span>
                  <div className="mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-md leading-none ${
                        order.status === "pending"
                          ? "text-warning bg-warning/10"
                          : order.status === "delivered"
                          ? "text-success bg-success/10"
                          : order.status === "processing"
                          ? "text-indigo-500 bg-indigo-100"
                          : order.status === "cancel"
                          ? "text-danger bg-danger/10"
                          : ""
                      } font-medium`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="col-span-2 pt-2 border-t border-gray-200 dark:border-slate-600">
                  <TableItem key={`${order._id}-mobile`} order={order} isMobile={true} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-2 sm:px-4 pt-4 sm:pt-6 border-t border-gray6 dark:border-slate-600">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center pagination">
            <span className="flex items-center text-xs sm:text-sm uppercase dark:text-slate-300 text-center sm:text-left">
              Showing 1-{currentItems.length} of {recentOrders?.orders.length}
            </span>
            <div className="flex justify-center sm:justify-end">
              <Pagination
                handlePageClick={handlePageClick}
                pageCount={pageCount}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="grid grid-cols-12 gap-3 sm:gap-6 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 lg:p-8 col-span-12 rounded-md transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h3 className="font-medium tracking-wide text-slate-700 dark:text-white text-base sm:text-lg mb-0 leading-none">
              Recent Orders
            </h3>
            <a
              href="order-list.html"
              className="leading-none text-sm sm:text-base text-info border-b border-info border-dotted capitalize font-medium hover:text-info/60 hover:border-info/60 self-start sm:self-auto"
            >
              View All
            </a>
          </div>

          {/* Responsive table container */}
          <div className="w-full">
            {content}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentOrders;

import React, { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
// internal
import OrderActions from "./order-actions";
import { Search } from "@/svg";
import ErrorMsg from "../common/error-msg";
import Pagination from "../ui/Pagination";
import OrderStatusChange from "./status-change";
import {useGetAllOrdersQuery} from "@/redux/order/orderApi";
import usePagination from "@/hooks/use-pagination";


const OrderTable = () => {
  const { data: orders, isError, isLoading, error } = useGetAllOrdersQuery();
  const [searchVal,setSearchVal] = useState<string>("");
  const [selectVal,setSelectVal] = useState<string>("");
  const paginationData = usePagination(orders?.data || [], 5);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && orders?.data.length === 0) {
    content = <ErrorMsg msg="No Orders Found" />;
  }

  if (!isLoading && !isError && orders?.success) {
    let orderItems = [...currentItems];
    if(searchVal){
      orderItems = orderItems.filter(v => v.invoice.toString().includes(searchVal))
    }
    if(selectVal){
      orderItems = orderItems.filter(v => v.status.toLowerCase() === selectVal.toLowerCase())
    }

    content = (
      <>
        <table className="w-full min-w-[800px] text-sm sm:text-base text-left text-gray-500 dark:text-slate-300">
          <thead className="bg-white">
            <tr className="border-b border-gray6 text-tiny">
              <th
                scope="col"
                className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold w-[170px]"
              >
                INVOICE NO
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-tiny text-text2 uppercase font-semibold"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end"
              >
                QTY
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-9 py-3 text-tiny text-text2 uppercase  font-semibold w-[14%] text-end"
              >
                Action
              </th>
              <th
                scope="col"
                className="px-9 py-3 text-tiny text-text2 uppercase  font-semibold w-[4%] text-end"
              >
                Invoice
              </th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item) => (
                <tr
                  key={item._id}
                  className="bg-white border-b border-gray6 last:border-0 text-start mx-9"
                >
                  <td className="px-3 py-3 font-normal text-[#55585B]">
                    #{item.invoice}
                  </td>
                  <td className="pr-8 py-5 whitespace-nowrap">
                    <a
                      href="#"
                      className="flex items-center space-x-5 text-hover-primary text-heading"
                    >
                      {item.user?.imageURL && (
                        <Image
                          className="w-[50px] h-[50px] rounded-full"
                          src={item.user.imageURL}
                          alt="user-img"
                          width={50}
                          height={50}
                        />
                      )}
                      <span className="font-medium">{item?.user?.name}</span>
                    </a>
                  </td>

                  <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                    {item.cart.reduce(
                      (acc, curr) => acc + curr.orderQuantity,
                      0
                    )}
                  </td>
                  <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                    $
                    {item.cart
                      .reduce((acc, curr) => acc + curr.price, 0)
                      .toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-end">
                    <span
                      className={`text-[11px] ${
                        item.status === "pending"
                          ? "text-warning bg-warning/10"
                          : item.status === "delivered"
                          ? "text-success bg-success/10"
                          : item.status === "processing"
                          ? "text-indigo-500 bg-indigo-100"
                          : item.status === "cancel"
                          ? "text-danger bg-danger/10"
                          : ""
                      } px-3 py-1 rounded-md leading-none font-medium text-end`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                    {dayjs(item.createdAt).format("MMM D, YYYY")}
                  </td>

                  <td className="px-9 py-3 text-end">
                    <div className="flex items-center justify-end space-x-2">
                      <OrderStatusChange id={item._id}/>
                    </div>
                  </td>
                  {/* order actions */}
                  <OrderActions id={item._id} />
                  {/* order actions */}
                </tr>
              ))}
          </tbody>
        </table>

        {/* pagination start */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-6 lg:px-8 py-4">
          <p className="mb-0 text-tiny text-gray-600 dark:text-slate-400 text-center sm:text-left">
            Showing 1-{currentItems.length} of {orders?.data.length}
          </p>
          <div className="pagination flex justify-center sm:justify-end items-center">
            <Pagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            />
          </div>
        </div>
        {/* pagination end */}
      </>
    );
  }

  // handle change input 
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };
  // handle change input 
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectVal(e.target.value);
  };
  return (
    <>
      <div className="tp-search-box flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 sm:px-6 lg:px-8 py-6 lg:py-8 gap-4 lg:gap-0">
        <div className="search-input relative w-full lg:w-auto">
          <input
            className="input h-[44px] w-full lg:w-[300px] pl-14 text-sm"
            type="text"
            placeholder="Search by invoice no"
            onChange={handleSearchChange}
          />
          <button className="absolute top-1/2 left-5 translate-y-[-50%] hover:text-theme">
            <Search />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-start lg:justify-end gap-3 sm:gap-6 w-full lg:w-auto">
          <div className="search-select flex items-center space-x-2 sm:space-x-3">
            <span className="text-tiny inline-block leading-none whitespace-nowrap">
              Status:
            </span>
            <div className="isolated-status-select">
              <style jsx>{`
                .isolated-status-select select {
                  background-color: white !important;
                  color: #374151 !important;
                  border: 1px solid #e5e7eb !important;
                  border-radius: 6px !important;
                  min-width: 120px !important;
                  width: 120px !important;
                  height: 40px !important;
                  padding: 8px 12px !important;
                  font-size: 12px !important;
                }
                @media (min-width: 640px) {
                  .isolated-status-select select {
                    font-size: 14px !important;
                  }
                }
                @media (min-width: 1024px) {
                  .isolated-status-select select {
                    font-size: 16px !important;
                  }
                }
                .isolated-status-select select:focus {
                  background-color: white !important;
                  color: #374151 !important;
                  border-color: #0989FF !important;
                  outline: none !important;
                }
                .isolated-status-select select option {
                  background-color: #334155 !important;
                  color: white !important;
                }
                .isolated-status-select select option:hover {
                  background-color: #475569 !important;
                  color: white !important;
                }
                .isolated-status-select select:hover {
                  border-color: #0989FF !important;
                }
                /* Force override any dark mode styles */
                .dark .isolated-status-select select,
                .dark .isolated-status-select select:focus {
                  background-color: white !important;
                  color: #374151 !important;
                }
                .dark .isolated-status-select select option {
                  background-color: #334155 !important;
                  color: white !important;
                }
                .dark .isolated-status-select select option:hover {
                  background-color: #475569 !important;
                  color: white !important;
                }
              `}</style>
              <select onChange={handleSelectChange}>
                <option value="">All Status</option>
                <option value="delivered">Delivered</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="cancel">Cancel</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-2 sm:mx-4 lg:mx-8 min-h-[400px]">
        <div className="overflow-x-auto overflow-y-visible rounded-lg">
          {content}
        </div>
      </div>
    </>
  );
};

export default OrderTable;

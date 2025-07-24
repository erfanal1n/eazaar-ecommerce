"use client";
import React, { useRef } from "react";
import ErrorMsg from "../common/error-msg";
import { useGetSingleOrderQuery } from "@/redux/order/orderApi";
import { Invoice } from "@/svg";
import { useReactToPrint } from "react-to-print";
import UnifiedInvoice from "../common/unified-invoice";

const OrderDetailsArea = ({ id }: { id: string }) => {
  const { data: orderData, isLoading, isError } = useGetSingleOrderQuery(id);
  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef?.current,
    documentTitle: "Invoice",
  });

  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading order details...</span>
      </div>
    );
  }

  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error loading order details" />;
  }

  if (!isLoading && !isError && orderData) {
    content = (
      <>
        <div className="container grid px-6 mx-auto">
          <div className="flex items-center justify-between my-6">
            <h1 className="text-lg font-bold text-gray-700 dark:text-gray-300">
              Order Details & Invoice
            </h1>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Invoice />
              <span className="ml-2">Print Invoice</span>
            </button>
          </div>
          <div ref={printRef} className="bg-white mb-4 rounded-xl shadow-sm overflow-hidden">
            <UnifiedInvoice mode="order" orderData={orderData} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="">{content}</div>
    </>
  );
};

export default OrderDetailsArea;
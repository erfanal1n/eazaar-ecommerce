"use client";
import dayjs from "dayjs";
import React,{useRef} from "react";
import ErrorMsg from "../common/error-msg";
import { Card, Typography } from "@material-tailwind/react";
import { useGetSingleOrderQuery } from "@/redux/order/orderApi";
import { Invoice } from "@/svg";
import { useReactToPrint } from "react-to-print";
import { notifyError } from "@/utils/toast";
import ProfessionalInvoice from "../invoice/professional-invoice";

const OrderDetailsArea = ({ id }: { id: string }) => {
  const { data: orderData, isLoading, isError } = useGetSingleOrderQuery(id);
  const printRef = useRef<HTMLDivElement | null>(null);

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError && orderData) {
    const TABLE_HEAD = [
      "SL",
      "Product Name",
      "	Quantity",
      "Item Price",
      "Amount",
    ];
    const total = orderData.cart.reduce((acc, curr) => acc + curr.price, 0);
    const shippingCost = orderData.shippingCost || 0;
    const grand_total = (total +
      shippingCost +
      (orderData.discount ?? 0)) as number;
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
            <ProfessionalInvoice orderData={orderData} />
          </div>
        </div>
      </>
    );
  }

  const handlePrint = useReactToPrint({
    content: () => printRef?.current,
    documentTitle: "Invoice",
  });

  return (
    <>
      <div className="">{content}</div>
    </>
  );
};

export default OrderDetailsArea;
                  <table className="w-full text-base text-left text-gray-500 whitespace-no-wrap">
                    <thead className="bg-white">
                      <tr className="border-b border-gray6 text-tiny">
                        <td className="pl-3 py-3 text-tiny text-textBody uppercase font-semibold">SR.</td>
                        <td className="pr-8 py-3 text-tiny text-textBody uppercase font-semibold">Product Title</td>
                        <td className="pr-8 py-3 text-tiny text-textBody uppercase font-semibold text-center">QUANTITY</td>
                        <td className="pr-3 py-3 text-tiny text-textBody uppercase font-semibold text-center">ITEM PRICE</td>
                        <td className="pr-3 py-3 text-tiny text-textBody uppercase font-semibold text-right">AMOUNT</td>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y text-base ">
                      {orderData.cart.map((item, i) => (
                        <tr key={item._id} className="">
                          <td className="bg-white border-b border-gray6 px-3 py-3 text-start">
                            {i + 1}
                          </td>
                          <td className="bg-white border-b border-gray6 px-3 pl-0 py-3 text-start">
                            {item.title}
                          </td>
                          <td className="bg-white border-b border-gray6 px-3 py-3 font-bold text-center">
                            {item.orderQuantity}
                          </td>
                          <td className="bg-white border-b border-gray6 px-3 py-3 font-bold text-center">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="bg-white border-b border-gray6 px-3 py-3 text-right font-bold">
                            ${(item.price * item.orderQuantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="border border-slate-200 rounded-xl p-8 py-6">
              <div className="flex lg:flex-row md:flex-row flex-col justify-between">
                <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                  <span className="mb-1 font-bold text-base uppercase block">
                    PAYMENT METHOD
                  </span>
                  <span className="text-base font-semibold block">
                    {orderData.paymentMethod}
                  </span>
                </div>
                <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                  <span className="mb-1 font-bold text-base uppercase block">
                    SHIPPING COST
                  </span>
                  <span className="text-base font-semibold font-heading block">
                    ${shippingCost}
                  </span>
                </div>
                <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                  <span className="mb-1 font-bold font-heading text-base uppercase block">
                    DISCOUNT
                  </span>
                  <span className="text-base text-gray-500 font-semibold font-heading block">
                    ${orderData?.discount}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-wrap">
                  <span className="mb-1 font-bold text-base uppercase block">
                    TOTAL AMOUNT
                  </span>
                  <span className="text-xl font-bold block">
                    ${grand_total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const handlePrint = useReactToPrint({
    content: () => printRef?.current,
    documentTitle: "Receipt",
  });

  const handlePrintReceipt = async () => {
    try {
      handlePrint();
    } catch (err) {
      console.log("order by user id error", err);
      notifyError("Failed to print");
    }
    // console.log('id', id);
  };

  return (
    <>
      <div className="">{content}</div>
      <div className="container grid px-6 mx-auto">
        <div className="mb-4 mt-3 flex justify-between">
          <button onClick={handlePrintReceipt} className="tp-btn px-5 py-2">
            Print Invoice
            <span className="ml-2">
              <Invoice />
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsArea;

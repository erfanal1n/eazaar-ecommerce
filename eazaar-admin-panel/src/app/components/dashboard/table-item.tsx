import React from "react";
import { Select, Option } from "@material-tailwind/react";
import dayjs from "dayjs";
import { Delete, Edit } from "@/svg";
import { IOrder } from "@/types/order-amount-type";
import OrderActions from "../orders/order-actions";
import OrderStatusChange from "../orders/status-change";
import { tableStyles, combineTableClasses } from "../common/table-styles";

const TableItem = (props: { order: IOrder; isMobile?: boolean }) => {
  const { order, isMobile = false } = props;
  const p_method =
    order.paymentMethod === "COD"
      ? "Cash"
      : order.paymentMethod === "Card"
      ? "Card"
      : order.paymentMethod;

  // Mobile view - return action components only
  if (isMobile) {
    return (
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1">
          <span className="font-semibold text-gray-600 dark:text-slate-300 text-xs">Action:</span>
          <div className="mt-1">
            <OrderStatusChange id={order._id} />
          </div>
        </div>
        <div className="flex gap-2">
          <OrderActions id={order._id} cls="" isMobile={true} />
        </div>
      </div>
    );
  }

  // Desktop view - return table row
  return (
    <tr className="bg-white dark:bg-slate-800 border-b border-gray6 dark:border-slate-600 last:border-0 text-start hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200">
      <td className="px-3 py-3 text-black dark:text-slate-200 font-normal">
        <span className="uppercase rounded-md px-3 py-1 bg-gray dark:bg-slate-600">#{order.invoice}</span>
      </td>
      <td className="px-3 py-3 font-normal text-[#55585B] dark:text-slate-400">
        <div className="hidden xl:block">
          {dayjs(order.createdAt).format("MMMM D, YYYY h:mm A")}
        </div>
        <div className="block xl:hidden">
          {dayjs(order.createdAt).format("MMM D, YY")}
        </div>
      </td>
      <td className="px-3 py-3 font-medium text-heading dark:text-slate-200">
        <div className="truncate max-w-[100px] lg:max-w-[150px]" title={order.name}>
          {order.name}
        </div>
      </td>
      <td className="hidden lg:table-cell px-3 py-3 font-normal text-[#55585B] dark:text-slate-300">{p_method}</td>
      <td className="px-3 py-3 font-normal text-[#55585B] dark:text-slate-300 text-end">${order.totalAmount}</td>
      <td className="px-3 py-3 text-center">
        <span
          className={`text-[11px] px-3 py-1 rounded-md leading-none font-medium ${
            order.status === "pending"
              ? "text-warning bg-warning/10"
              : order.status === "delivered"
              ? "text-success bg-success/10"
              : order.status === "processing"
              ? "text-indigo-500 bg-indigo-100"
              : order.status === "cancel"
              ? "text-danger bg-danger/10"
              : ""
          }`}
        >
          {order.status}
        </span>
      </td>
      <td className="px-3 py-3 text-center">
        <OrderStatusChange id={order._id} />
      </td>
      {/* order actions */}
      <OrderActions id={order._id} cls="px-3 py-3 text-end" />
      {/* order actions */}
    </tr>
  );
};

export default TableItem;

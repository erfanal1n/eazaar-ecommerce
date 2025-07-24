import React from "react";

function ThItem({ title, cls, hideOnMobile = false }: { title: string; cls?: string; hideOnMobile?: boolean }): React.JSX.Element {
  return (
    <th
      scope="col"
      className={`px-2 sm:px-3 py-2 sm:py-3 text-[10px] sm:text-tiny text-text2 dark:text-slate-200 uppercase font-semibold ${cls} ${
        hideOnMobile ? "hidden lg:table-cell" : ""
      }`}
    >
      <span className="truncate block">{title}</span>
    </th>
  );
}

const TableHead = () => {
  return (
    <thead className="bg-white dark:bg-slate-700">
      <tr className="border-b border-gray6 dark:border-slate-600 text-tiny">
        <ThItem title="INVOICE" />
        <ThItem title="TIME" />
        <ThItem title="CUSTOMER" />
        <ThItem title="METHOD" hideOnMobile={true} />
        <ThItem title="PRICE" cls="text-end" />
        <ThItem title="STATUS" cls="text-center" />
        <ThItem title="ACTION" cls="text-center" />
        <ThItem title="EDIT" cls="text-end" />
      </tr>
    </thead>
  );
};

export default TableHead;

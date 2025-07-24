import React from "react";

// table head component matching coupon table structure
function TableHead({ title, width }: { title: string; width?: string }) {
  return (
    <th
      scope="col"
      className={`px-3 py-3 text-tiny text-text2 dark:text-slate-400 uppercase font-semibold ${width || 'w-[170px]'} text-end`}
    >
      {title}
    </th>
  );
}

const UserTableHead = () => {
  return (
    <thead className="bg-white dark:bg-slate-700">
      <tr className="border-b border-gray6 dark:border-slate-600 text-tiny">
        <th scope="col" className="pr-8 py-3 text-tiny text-text2 dark:text-slate-400 uppercase font-semibold w-[250px]">
          Name
        </th>
        <TableHead title="Email" width="w-[200px]" />
        <TableHead title="Contact" width="w-[120px]" />
        <TableHead title="Orders" width="w-[80px]" />
        <TableHead title="Status" width="w-[100px]" />
        <th
          scope="col"
          className="px-9 py-3 text-tiny text-text2 dark:text-slate-400 uppercase font-semibold w-[120px] text-end"
        >
          Action
        </th>
      </tr>
    </thead>
  );
};

export default UserTableHead;
// Standardized table styling classes based on coupon table design

export const tableStyles = {
  // Table cell base styles (matching coupon table)
  tableCell: "px-3 py-3 font-normal text-[#55585B] dark:text-slate-300",
  
  // Specific cell types
  tableCellPrimary: "pr-8 py-5 whitespace-nowrap", // For name/title columns with images
  tableCellSecondary: "px-3 py-3 text-black dark:text-slate-200 font-normal text-end",
  tableCellAmount: "px-3 py-3 font-normal text-[#55585B] dark:text-slate-300 text-end",
  
  // Table header styles (matching original coupon table)
  tableHeader: "px-3 py-3 text-tiny text-text2 dark:text-slate-400 uppercase font-semibold w-[170px] text-end",
  
  // Table row styles (matching original coupon table)
  tableRow: "bg-white dark:bg-slate-800 border-b border-gray6 dark:border-slate-600 last:border-0 text-start mx-9",
  
  // Status badge styles (matching coupon design)
  statusBadge: "text-[11px] px-3 py-1 rounded-md leading-none font-medium text-end",
  
  // Code/ID styles (matching coupon code style)
  codeText: "uppercase rounded-md px-3 py-1 bg-gray dark:bg-slate-600",
  
  // Date styles (matching coupon dates)
  dateText: "px-3 py-3 text-end font-normal text-[#55585B] dark:text-slate-400",
  
  // Name/Title styles (matching coupon title)
  nameText: "font-medium text-heading dark:text-slate-200",
  
  // Action column styles (matching coupon actions)
  actionCell: "px-9 py-3 text-end"
};

// Helper function to combine classes
export const combineTableClasses = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};
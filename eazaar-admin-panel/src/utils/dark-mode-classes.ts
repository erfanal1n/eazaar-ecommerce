// Utility function to apply dark mode classes consistently across components
export const getDarkModeClasses = () => {
  return {
    // Main containers
    pageContainer: "bg-slate-100 dark:bg-slate-900 transition-colors duration-300",
    cardContainer: "bg-white dark:bg-slate-800 transition-colors duration-300",
    
    // Text styles
    headingPrimary: "text-black dark:text-white",
    headingSecondary: "text-slate-700 dark:text-white", 
    textPrimary: "text-gray-900 dark:text-white",
    textSecondary: "text-gray-600 dark:text-slate-300",
    textMuted: "text-gray-500 dark:text-slate-400",
    textBody: "text-textBody dark:text-slate-300",
    
    // Borders
    borderPrimary: "border-gray dark:border-slate-600",
    borderSecondary: "border-gray-200 dark:border-slate-600",
    borderLight: "border-gray-100 dark:border-slate-700",
    
    // Form elements
    input: "bg-white dark:bg-slate-700 border-gray dark:border-slate-600 text-black dark:text-white placeholder-gray-400 dark:placeholder-slate-400",
    inputFocus: "focus:border-theme dark:focus:border-theme focus:bg-white dark:focus:bg-slate-700",
    
    // Tables
    tableHeader: "bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-slate-200",
    tableRow: "bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700",
    tableCell: "text-gray-900 dark:text-slate-200 border-gray-200 dark:border-slate-600",
    
    // Buttons and interactive elements
    buttonPrimary: "bg-theme hover:bg-themeDark text-white",
    buttonSecondary: "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600",
    
    // Status and badges
    badge: "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200",
    
    // Modals and overlays
    modal: "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700",
    overlay: "bg-black/50 dark:bg-black/70",
  };
};

// Helper function to combine classes
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
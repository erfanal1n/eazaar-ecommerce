import React from 'react';

interface LabelProps {
  className?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

export const Label = ({ 
  className = '', 
  children,
  htmlFor
}: LabelProps) => {
  const baseClasses = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white';
  
  return (
    <label
      htmlFor={htmlFor}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </label>
  );
};
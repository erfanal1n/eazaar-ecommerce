import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card = ({ className = '', children }: CardProps) => (
  <div className={`bg-white dark:bg-slate-800 rounded-md shadow-sm border border-gray-200 dark:border-slate-700 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ className = '', children }: CardProps) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ className = '', children }: CardProps) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ className = '', children }: CardProps) => (
  <h3 className={`text-lg font-semibold text-slate-700 dark:text-white ${className}`}>
    {children}
  </h3>
);
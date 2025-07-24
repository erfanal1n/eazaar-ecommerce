'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge = ({ 
  status, 
  children, 
  className = '',
  size = 'md'
}: StatusBadgeProps) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const statusClasses = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    success: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    error: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
  };
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span className={cn(
      baseClasses,
      statusClasses[status],
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  );
};
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const EnhancedCard = ({ 
  className = '', 
  children, 
  variant = 'default',
  padding = 'md'
}: EnhancedCardProps) => {
  const variants = {
    default: 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm',
    elevated: 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-300',
    outlined: 'bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 shadow-none',
    glass: 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 shadow-lg'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={cn(
      'rounded-lg transition-all duration-200',
      variants[variant],
      paddings[padding],
      className
    )}>
      {children}
    </div>
  );
};

export const EnhancedCardHeader = ({ 
  className = '', 
  children 
}: { className?: string; children: React.ReactNode }) => (
  <div className={cn('mb-6', className)}>
    {children}
  </div>
);

export const EnhancedCardContent = ({ 
  className = '', 
  children 
}: { className?: string; children: React.ReactNode }) => (
  <div className={cn('space-y-4', className)}>
    {children}
  </div>
);

export const EnhancedCardTitle = ({ 
  className = '', 
  children 
}: { className?: string; children: React.ReactNode }) => (
  <h3 className={cn(
    'text-xl font-semibold text-slate-900 dark:text-white mb-2',
    className
  )}>
    {children}
  </h3>
);

export const EnhancedCardDescription = ({ 
  className = '', 
  children 
}: { className?: string; children: React.ReactNode }) => (
  <p className={cn(
    'text-sm text-slate-600 dark:text-slate-400',
    className
  )}>
    {children}
  </p>
);
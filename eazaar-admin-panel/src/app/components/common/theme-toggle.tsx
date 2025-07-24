'use client';
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={toggleTheme}
        className="relative w-[40px] h-[40px] leading-[40px] rounded-md text-textBody dark:text-slate-300 border border-gray dark:border-slate-600 hover:bg-themeLight hover:text-theme hover:border-themeLight dark:hover:bg-slate-700 transition-colors duration-300"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {/* Sun Icon - Light Mode */}
        <div className={`transition-all duration-300 ${
          theme === 'light' 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 rotate-180 scale-75'
        }`}>
          ☀️
        </div>
        
        {/* Moon Icon - Dark Mode */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          theme === 'dark' 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 -rotate-180 scale-75'
        }`}>
          🌙
        </div>
      </button>
    </div>
  );
};

export default ThemeToggle;
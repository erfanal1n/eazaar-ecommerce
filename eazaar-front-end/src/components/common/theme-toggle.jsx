import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from '../../svg';

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
    <button
      className={`tp-header-action-btn theme-toggle-btn ${theme === 'dark' ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-slider">
          <div className="theme-toggle-icon-container">
            <Sun className={`theme-icon sun-icon ${theme === 'light' ? 'active' : ''}`} />
            <Moon className={`theme-icon moon-icon ${theme === 'dark' ? 'active' : ''}`} />
          </div>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
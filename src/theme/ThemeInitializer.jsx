
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * Initialize theme from localStorage
 */
const ThemeInitializer = () => {
  const { theme } = useSelector((state) => state.theme);
  
  useEffect(() => {
    // Apply theme class to document element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return null;
};

export default ThemeInitializer;

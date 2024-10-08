import React, { createContext, useState, useEffect, useContext } from 'react';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  // Load initial dark mode state from local storage or default to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem('isDarkMode');
    return storedDarkMode ? JSON.parse(storedDarkMode) : false;
  });

  // Update local storage when dark mode state changes
  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(DarkModeContext);
};

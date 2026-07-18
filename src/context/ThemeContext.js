import { createContext, useContext, useState } from 'react';
import { themes } from '../constants/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentTheme = isDarkMode ? themes.dark : themes.light;
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ currentTheme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
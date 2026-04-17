import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import api from '../api/client';

const ThemeContext = createContext();

export const ThemeProvider = ({ children, user }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(user?.theme_preference || systemColorScheme || 'light');

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await api.post('/auth/update-theme', { theme: newTheme });
    } catch (e) {
      console.error('Failed to update theme preference:', e);
    }
  };

  const colors = theme === 'light' ? {
    background: '#f5f5f5',
    surface: '#fff',
    text: '#000',
    subtext: '#666',
    primary: '#4CAF50',
    border: '#ddd',
  } : {
    background: '#121212',
    surface: '#1e1e1e',
    text: '#fff',
    subtext: '#aaa',
    primary: '#81C784',
    border: '#333',
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

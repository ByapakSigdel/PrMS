import { getTheme, lightTheme } from '@/constants/Themes';
import { Theme } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: Theme;
  themeId: string;
  setTheme: (themeId: string) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeId, setThemeId] = useState<string>('light');
  const [theme, setThemeState] = useState<Theme>(lightTheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedThemeId = await AsyncStorage.getItem('theme_id');
      if (savedThemeId) {
        const selectedTheme = getTheme(savedThemeId);
        setThemeId(savedThemeId);
        setThemeState(selectedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newThemeId: string) => {
    try {
      await AsyncStorage.setItem('theme_id', newThemeId);
      const selectedTheme = getTheme(newThemeId);
      setThemeId(newThemeId);
      setThemeState(selectedTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeId,
        setTheme,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

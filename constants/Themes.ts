import { Theme } from '@/types';

export const lightTheme: Theme = {
  id: 'light',
  name: 'Light',
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#6C6C70',
    border: '#C6C6C8',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
  },
};

export const darkTheme: Theme = {
  id: 'dark',
  name: 'Dark',
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    error: '#FF453A',
    success: '#30D158',
    warning: '#FF9F0A',
  },
};

export const blueTheme: Theme = {
  id: 'blue',
  name: 'Ocean Blue',
  colors: {
    primary: '#1E40AF',
    secondary: '#3B82F6',
    background: '#F8FAFC',
    surface: '#E2E8F0',
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#CBD5E1',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
};

export const themes = [lightTheme, darkTheme, blueTheme];

export const getTheme = (themeId: string): Theme => {
  return themes.find(theme => theme.id === themeId) || lightTheme;
};

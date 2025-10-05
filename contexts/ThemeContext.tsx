
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

// Define the structure of a theme
interface Theme {
  name: string;
  colors: {
    '--bg-from': string;
    '--bg-to': string;
    '--text-primary': string;
    '--text-secondary': string;
    '--text-subtle': string;
    '--card-bg': string;
    '--card-item-bg': string;
    '--card-item-bg-hover': string;
    '--button-bg': string;
    '--button-text': string;
    '--button-hover-bg': string;
    '--input-bg': string;
    '--input-placeholder-color': string;
    '--tooltip-bg': string;
  };
}

const themes: Theme[] = [
  {
    name: 'Dark',
    colors: {
      '--bg-from': '#3b82f6',
      '--bg-to': '#4f46e5',
      '--text-primary': '#ffffff',
      '--text-secondary': '#e0e7ff',
      '--text-subtle': '#c7d2fe',
      '--card-bg': 'rgba(255, 255, 255, 0.2)',
      '--card-item-bg': 'rgba(255, 255, 255, 0.1)',
      '--card-item-bg-hover': 'rgba(255, 255, 255, 0.2)',
      '--button-bg': '#ffffff',
      '--button-text': '#4f46e5',
      '--button-hover-bg': '#e0e7ff',
      '--input-bg': 'rgba(255, 255, 255, 0.2)',
      '--input-placeholder-color': '#e0e7ff',
      '--tooltip-bg': 'rgba(30, 41, 59, 0.8)',
    },
  },
  {
    name: 'Light',
    colors: {
      '--bg-from': '#f0f9ff',
      '--bg-to': '#e0e7ff',
      '--text-primary': '#1e293b',
      '--text-secondary': '#334155',
      '--text-subtle': '#64748b',
      '--card-bg': 'rgba(255, 255, 255, 0.7)',
      '--card-item-bg': 'rgba(0, 0, 0, 0.05)',
      '--card-item-bg-hover': 'rgba(0, 0, 0, 0.1)',
      '--button-bg': '#4f46e5',
      '--button-text': '#ffffff',
      '--button-hover-bg': '#6366f1',
      '--input-bg': 'rgba(255, 255, 255, 0.8)',
      '--input-placeholder-color': '#64748b',
      '--tooltip-bg': 'rgba(30, 41, 59, 0.9)',
    },
  },
   {
    name: 'Twilight',
    colors: {
      '--bg-from': '#0f172a',
      '--bg-to': '#5b21b6',
      '--text-primary': '#f8fafc',
      '--text-secondary': '#cbd5e1',
      '--text-subtle': '#94a3b8',
      '--card-bg': 'rgba(71, 85, 105, 0.3)',
      '--card-item-bg': 'rgba(71, 85, 105, 0.2)',
      '--card-item-bg-hover': 'rgba(71, 85, 105, 0.4)',
      '--button-bg': '#a78bfa',
      '--button-text': '#0f172a',
      '--button-hover-bg': '#c4b5fd',
      '--input-bg': 'rgba(51, 65, 85, 0.5)',
      '--input-placeholder-color': '#94a3b8',
      '--tooltip-bg': 'rgba(15, 23, 42, 0.8)',
    },
  },
];

interface ThemeContextType {
  theme: Theme;
  setThemeByName: (name: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(themes[1]);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    // Add a class to the body for theme-specific overrides if needed
    document.body.className = `${theme.name.toLowerCase()}-theme`;
  }, [theme]);

  const setThemeByName = (name: string) => {
    const newTheme = themes.find(t => t.name === name);
    if (newTheme) {
      setTheme(newTheme);
    }
  };

  const value = useMemo(() => ({ theme, setThemeByName, availableThemes: themes }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

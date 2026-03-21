'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'blue' | 'purple' | 'green';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors: Record<Theme, { primary: string; secondary: string; accent: string }> = {
  light: {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#3b82f6',
  },
  dark: {
    primary: '#ffffff',
    secondary: '#000000',
    accent: '#60a5fa',
  },
  blue: {
    primary: '#1e40af',
    secondary: '#eff6ff',
    accent: '#3b82f6',
  },
  purple: {
    primary: '#7c3aed',
    secondary: '#faf5ff',
    accent: '#a855f7',
  },
  green: {
    primary: '#166534',
    secondary: '#f0fdf4',
    accent: '#22c55e',
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && themeColors[savedTheme]) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const colors = themeColors[theme];

    root.classList.remove('theme-light', 'theme-dark', 'theme-blue', 'theme-purple', 'theme-green');
    root.classList.add(`theme-${theme}`);

    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);

    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export const availableThemes: { id: Theme; name: string; icon: string; colors: string[] }[] = [
  { id: 'light', name: '浅色', icon: '☀️', colors: ['#ffffff', '#000000', '#3b82f6'] },
  { id: 'dark', name: '深色', icon: '🌙', colors: ['#000000', '#ffffff', '#60a5fa'] },
  { id: 'blue', name: '蓝色', icon: '🔵', colors: ['#eff6ff', '#1e40af', '#3b82f6'] },
  { id: 'purple', name: '紫色', icon: '🟣', colors: ['#faf5ff', '#7c3aed', '#a855f7'] },
  { id: 'green', name: '绿色', icon: '🟢', colors: ['#f0fdf4', '#166534', '#22c55e'] },
];

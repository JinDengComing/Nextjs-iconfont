'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

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
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 检查系统主题设置
    const checkSystemTheme = () => {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    };

    // 初始化检查
    checkSystemTheme();

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkSystemTheme);

    setMounted(true);

    // 清理监听器
    return () => {
      mediaQuery.removeEventListener('change', checkSystemTheme);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const colors = themeColors[theme];

    root.classList.remove('theme-light', 'theme-dark', 'dark');
    root.classList.add(`theme-${theme}`);
    if (theme === 'dark') {
      root.classList.add('dark');
    }

    // 更新所有主题相关的CSS变量
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);

    // 根据主题更新背景和前景色
    if (theme === 'light') {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#171717');
    } else {
      root.style.setProperty('--background', '#0a0a0a');
      root.style.setProperty('--foreground', '#ededed');
    }

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
];

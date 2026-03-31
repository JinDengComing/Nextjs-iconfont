'use client';

import { useState } from 'react';
import { useTheme, availableThemes } from './ThemeProvider';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = availableThemes.find((t) => t.id === theme);

  return (
    <div className="relative">
      <button
        onClick={() => { }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        title="切换主题"
      >
        <span className="text-lg">{currentTheme?.icon}</span>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden sm:inline">
          {currentTheme?.name}
        </span>
        {/* <svg
          className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg> */}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 z-50 overflow-hidden">
            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-sm font-medium text-zinc-900 dark:text-white">选择主题</span>
            </div>
            <div className="p-2">
              {availableThemes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${theme === t.id
                    ? 'bg-zinc-100 dark:bg-zinc-800'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                >
                  <span className="text-xl">{t.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-zinc-900 dark:text-white">
                      {t.name}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {t.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full border border-zinc-200 dark:border-zinc-700"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {theme === t.id && (
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

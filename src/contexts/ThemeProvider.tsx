import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'midnight';

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('studyos_theme') as Theme;
    if (stored && ['light', 'dark', 'midnight'].includes(stored)) {
      return stored;
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'midnight');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'midnight') {
      root.classList.add('midnight');
    } else {
      root.classList.add('light');
    }

    document.body.className = `theme-${theme}`;

    localStorage.setItem('studyos_theme', theme);
  }, [theme]);

  const cycleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'midnight';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

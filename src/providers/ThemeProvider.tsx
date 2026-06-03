import { ReactNode, useCallback, useMemo } from 'react';

import { ThemeContext } from '../context/ThemeContext';
import { Theme } from '../types/theme';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Props {
  children: ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useLocalStorage('app-theme', 'light');

  const currentTheme: Theme = theme === 'dark' ? 'dark' : 'light';

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  }, [currentTheme, setTheme]);

  const value = useMemo(
    () => ({
      theme: currentTheme,
      toggleTheme,
    }),
    [currentTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={
          currentTheme === 'dark'
            ? 'dark min-h-screen bg-black text-white'
            : 'min-h-screen bg-white text-black'
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

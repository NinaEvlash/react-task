import { ReactNode } from 'react';

import { ThemeContext } from '../context/ThemeContext';
import { Theme } from '../types/theme';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Props {
  children: ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useLocalStorage('app-theme', 'light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme: theme as Theme, toggleTheme }}>
      <div
        className={
          theme === 'dark'
            ? 'dark min-h-screen bg-black text-white'
            : 'min-h-screen bg-white text-black'
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

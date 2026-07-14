'use client';

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { type ThemeContextType } from '../types/theme';

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}

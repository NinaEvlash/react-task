"use client";

import { useEffect, useState } from 'react';

export function useLocalStorage<T extends string>(
  key: string,
  initialValue?: T,
): [T, (value: React.SetStateAction<T>) => void] {
  const defaultValue = (initialValue ?? ('' as unknown as T)) as T;

  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const stored = localStorage.getItem(key);

      return (stored as T) ?? defaultValue;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue];
}
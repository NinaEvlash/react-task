import { useEffect, useState } from 'react';

export function useLocalStorage(
  key: string,
  initialValue = '',
): [string, (value: React.SetStateAction<string>) => void] {
  const [value, setValue] = useState<string>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      return localStorage.getItem(key) ?? initialValue;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return initialValue;
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

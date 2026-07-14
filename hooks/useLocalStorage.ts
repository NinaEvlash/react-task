'use client';

import { useEffect, useState } from 'react';

export function useLocalStorage(
  key: string,
  initialValue = '',
): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [value, setValue] = useState<string>(() => {
    try {
      const storedValue = globalThis.localStorage.getItem(key);

      return storedValue ?? initialValue;
    } catch (error) {
      console.error('Error accessing localStorage:', error);

      return initialValue;
    }
  });

  useEffect(() => {
    try {
      globalThis.localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue];
}

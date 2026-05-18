import { useCallback, useState } from 'react';

export function useLocalStorage(key: string, initialValue = '') {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) || initialValue;
  });

  const saveValue = useCallback(
    (newValue: string) => {
      setValue(newValue);
      localStorage.setItem(key, newValue);
    },
    [key],
  );

  const removeValue = useCallback(() => {
    setValue(initialValue);
    localStorage.removeItem(key);
  }, [initialValue, key]);

  return {
    value,
    saveValue,
    removeValue,
  };
}

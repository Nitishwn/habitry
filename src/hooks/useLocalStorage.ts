import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T, deserializer?: (value: any) => T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        return deserializer ? deserializer(parsed) : parsed;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      
      const serializableData = Array.isArray(valueToStore)
        ? valueToStore.map(challenge => ({
            ...challenge,
           
            completedDays: Array.from(challenge.completedDays)
          }))
        : valueToStore;

      window.localStorage.setItem(key, JSON.stringify(serializableData));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
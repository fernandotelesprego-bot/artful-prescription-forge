import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Get initial value from localStorage or use default
  const readValue = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Read from localStorage on mount
  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  return [storedValue, setValue];
}

// Storage keys
export const STORAGE_KEYS = {
  DOCTOR_INFO: 'prescription-doctor-info',
  STYLE: 'prescription-style',
  LOGO_HISTORY: 'prescription-logo-history',
} as const;

// Logo history type
export interface LogoHistoryItem {
  id: string;
  url: string;
  prompt?: string;
  createdAt: string;
  isUploaded: boolean;
}

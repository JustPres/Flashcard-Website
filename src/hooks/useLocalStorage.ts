import { useState, useEffect } from 'react';

// Type for the setSavedValue function
type SetValue<T> = (value: T | ((val: T) => T)) => void;

// Custom hook for using localStorage with proper typing
export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  useEffect(() => {
    try {
      // Get from local storage by key
      if (typeof window === 'undefined') {
        return;
      }
      
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);
  
  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue: SetValue<T> = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Log errors
      console.log(error);
    }
  };
  
  return [storedValue, setValue];
} 
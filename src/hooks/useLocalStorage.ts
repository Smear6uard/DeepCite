"use client";

import { useState, useEffect, useCallback } from "react";

const OLD_STORAGE_KEY = "ai-answer-engine-messages";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      // One-time migration from old key
      const oldData = localStorage.getItem(OLD_STORAGE_KEY);
      if (oldData && !localStorage.getItem(key)) {
        localStorage.setItem(key, oldData);
        localStorage.removeItem(OLD_STORAGE_KEY);
      }

      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        setStoredValue(parsed);
      }
    } catch {
      // Use initial value on error
    }
    setIsInitialized(true);
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue =
          value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // localStorage full or unavailable
        }
        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue, isInitialized];
}

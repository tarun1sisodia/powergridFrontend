import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';

export const useFormPersist = (key: string, initialValue: string = '') => {
  const [value, setValue] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEYS.DRAFT_MESSAGE}_${key}`);
      return saved || initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (value.trim()) {
        localStorage.setItem(`${LOCAL_STORAGE_KEYS.DRAFT_MESSAGE}_${key}`, value);
      } else {
        localStorage.removeItem(`${LOCAL_STORAGE_KEYS.DRAFT_MESSAGE}_${key}`);
      }
    } catch (error) {
      console.error('Failed to persist form data:', error);
    }
  }, [key, value]);

  const clearPersistedValue = () => {
    try {
      localStorage.removeItem(`${LOCAL_STORAGE_KEYS.DRAFT_MESSAGE}_${key}`);
      setValue('');
    } catch (error) {
      console.error('Failed to clear persisted form data:', error);
    }
  };

  return {
    value,
    setValue,
    clearPersistedValue,
  };
};
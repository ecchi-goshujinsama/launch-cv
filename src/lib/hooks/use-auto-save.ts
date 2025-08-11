'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { debounce } from 'lodash-es';

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveOptions {
  delay?: number; // Debounce delay in milliseconds
  maxRetries?: number; // Maximum retry attempts on failure
  retryDelay?: number; // Delay between retries in milliseconds
  onSave?: (data: any) => Promise<void> | void;
  onSuccess?: (data: any) => void;
  onError?: (error: Error, data: any) => void;
  enabled?: boolean; // Allow disabling auto-save
}

interface AutoSaveState {
  status: AutoSaveStatus;
  lastSaved: Date | null;
  error: Error | null;
  retryCount: number;
}

export function useAutoSave<T>(
  data: T,
  options: AutoSaveOptions = {}
) {
  const {
    delay = 1000,
    maxRetries = 3,
    retryDelay = 2000,
    onSave,
    onSuccess,
    onError,
    enabled = true
  } = options;

  const [state, setState] = useState<AutoSaveState>({
    status: 'idle',
    lastSaved: null,
    error: null,
    retryCount: 0
  });

  const lastDataRef = useRef<T>(data);
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const retryTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const saveData = useCallback(async (dataToSave: T) => {
    if (!onSave || !enabled) return;

    setState(prev => ({ ...prev, status: 'saving', error: null }));

    try {
      await onSave(dataToSave);
      setState(prev => ({
        ...prev,
        status: 'saved',
        lastSaved: new Date(),
        error: null,
        retryCount: 0
      }));
      
      onSuccess?.(dataToSave);

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setState(prev => prev.status === 'saved' ? { ...prev, status: 'idle' } : prev);
      }, 3000);

    } catch (error) {
      const saveError = error instanceof Error ? error : new Error('Save failed');
      
      setState(prev => ({
        ...prev,
        status: 'error',
        error: saveError,
        retryCount: prev.retryCount + 1
      }));

      onError?.(saveError, dataToSave);

      // Retry if under max retries
      if (state.retryCount < maxRetries) {
        retryTimeoutRef.current = setTimeout(() => {
          saveData(dataToSave);
        }, retryDelay);
      }
    }
  }, [onSave, enabled, onSuccess, onError, maxRetries, retryDelay, state.retryCount]);

  // Create debounced save function
  const debouncedSave = useCallback(
    debounce((dataToSave: T) => {
      saveData(dataToSave);
    }, delay),
    [saveData, delay]
  );

  // Effect to trigger auto-save when data changes
  useEffect(() => {
    // Skip if disabled or no save function
    if (!enabled || !onSave) return;

    // Skip if data hasn't actually changed
    if (JSON.stringify(data) === JSON.stringify(lastDataRef.current)) {
      return;
    }

    lastDataRef.current = data;

    // Clear existing timeouts
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    // Trigger debounced save
    debouncedSave(data);

    return () => {
      debouncedSave.cancel();
    };
  }, [data, enabled, onSave, debouncedSave]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  // Manual save function
  const save = useCallback(() => {
    if (!enabled || !onSave) return;
    
    // Cancel debounced save and save immediately
    debouncedSave.cancel();
    saveData(data);
  }, [data, enabled, onSave, debouncedSave, saveData]);

  // Force retry function
  const retry = useCallback(() => {
    setState(prev => ({ ...prev, retryCount: 0 }));
    saveData(data);
  }, [data, saveData]);

  return {
    status: state.status,
    lastSaved: state.lastSaved,
    error: state.error,
    retryCount: state.retryCount,
    save,
    retry,
    isEnabled: enabled,
    canRetry: state.retryCount < maxRetries
  };
}

// Higher-level hook for form auto-save with localStorage fallback
export function useFormAutoSave<T>(
  formData: T,
  options: {
    storageKey: string;
    apiSave?: (data: T) => Promise<void>;
    onSuccess?: (data: T) => void;
    onError?: (error: Error, data: T) => void;
    enabled?: boolean;
    delay?: number;
  }
) {
  const {
    storageKey,
    apiSave,
    onSuccess,
    onError,
    enabled = true,
    delay = 1000
  } = options;

  // Save to localStorage as fallback
  const saveToStorage = useCallback((data: T) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }, [storageKey]);

  // Combined save function (API + localStorage)
  const handleSave = useCallback(async (data: T) => {
    // Always save to localStorage first (immediate)
    saveToStorage(data);

    // Then attempt API save if available
    if (apiSave) {
      await apiSave(data);
    }
  }, [apiSave, saveToStorage]);

  const autoSave = useAutoSave(formData, {
    delay,
    enabled,
    onSave: handleSave,
    ...(onSuccess && { onSuccess }),
    ...(onError && { onError }),
    maxRetries: 3,
    retryDelay: 2000
  });

  // Load from localStorage on mount
  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const { data, timestamp } = JSON.parse(stored);
        return { data, timestamp: new Date(timestamp) };
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
    return null;
  }, [storageKey]);

  // Clear storage
  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }, [storageKey]);

  return {
    ...autoSave,
    loadFromStorage,
    clearStorage,
    hasStoredData: () => {
      try {
        return localStorage.getItem(storageKey) !== null;
      } catch {
        return false;
      }
    }
  };
}

// Hook for auto-save status display
export function useAutoSaveStatus(autoSaveHook: ReturnType<typeof useAutoSave>) {
  const getStatusText = () => {
    switch (autoSaveHook.status) {
      case 'saving':
        return 'Saving changes...';
      case 'saved':
        return 'All changes saved';
      case 'error':
        return autoSaveHook.canRetry 
          ? `Save failed (${autoSaveHook.retryCount}/${3})`
          : 'Save failed';
      case 'idle':
      default:
        return autoSaveHook.lastSaved 
          ? `Last saved: ${autoSaveHook.lastSaved.toLocaleTimeString()}`
          : 'Auto-save ready';
    }
  };

  const getStatusColor = () => {
    switch (autoSaveHook.status) {
      case 'saving': return 'text-amber-600';
      case 'saved': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'idle': 
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (autoSaveHook.status) {
      case 'saving': return 'animate-pulse';
      case 'saved': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'idle':
      default: return 'text-gray-400';
    }
  };

  return {
    text: getStatusText(),
    color: getStatusColor(),
    icon: getStatusIcon(),
    showRetry: autoSaveHook.status === 'error' && autoSaveHook.canRetry
  };
}

// Simple hook for save status in builder context
export function useSaveStatus() {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const manualSave = useCallback(() => {
    setStatus('saving');
    // Simulate save operation
    setTimeout(() => {
      setStatus('saved');
      setLastSaved(new Date());
      // Return to idle after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }, 500);
  }, []);
  
  const statusMessage = useMemo(() => {
    switch (status) {
      case 'saving': return 'Saving changes...';
      case 'saved': return 'All changes saved';
      case 'error': return 'Save failed';
      case 'idle': return lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Auto-save ready';
    }
  }, [status, lastSaved]);
  
  const statusColor = useMemo(() => {
    switch (status) {
      case 'saving': return 'blue';
      case 'saved': return 'green';
      case 'error': return 'red';
      case 'idle': return 'gray';
    }
  }, [status]);
  
  return {
    status,
    statusMessage,
    statusColor,
    lastSaved,
    manualSave
  };
}
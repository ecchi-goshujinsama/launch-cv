'use client';

import { useState, useCallback, useRef } from 'react';

export interface UndoRedoState<T> {
  history: T[];
  currentIndex: number;
  maxHistorySize: number;
}

export interface UndoRedoActions<T> {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => T | undefined;
  redo: () => T | undefined;
  pushState: (state: T) => void;
  clearHistory: () => void;
  getCurrentState: () => T | undefined;
}

export function useUndoRedo<T>(
  initialState: T,
  maxHistorySize = 50,
  isEqual?: (a: T, b: T) => boolean
): [T, UndoRedoActions<T>] {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isEqualRef = useRef(isEqual);
  isEqualRef.current = isEqual;

  const defaultIsEqual = (a: T, b: T): boolean => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  const currentState = history[currentIndex] || initialState;

  const undo = useCallback((): T | undefined => {
    if (canUndo) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      return history[newIndex];
    }
    return undefined;
  }, [canUndo, currentIndex, history]);

  const redo = useCallback((): T | undefined => {
    if (canRedo) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      return history[newIndex];
    }
    return undefined;
  }, [canRedo, currentIndex, history]);

  const pushState = useCallback((state: T) => {
    const isEqualFn = isEqualRef.current || defaultIsEqual;
    
    // Don't add duplicate states
    if (currentIndex < history.length && history[currentIndex] && isEqualFn(state, history[currentIndex]!)) {
      return;
    }

    setHistory(prev => {
      // Remove any "future" history if we're not at the end
      const truncatedHistory = prev.slice(0, currentIndex + 1);
      
      // Add new state
      const newHistory = [...truncatedHistory, state];
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        return newHistory.slice(-maxHistorySize);
      }
      
      return newHistory;
    });
    
    setCurrentIndex(prev => {
      const newIndex = Math.min(prev + 1, maxHistorySize - 1);
      return newIndex;
    });
  }, [currentIndex, maxHistorySize]);

  const clearHistory = useCallback(() => {
    setHistory([currentState]);
    setCurrentIndex(0);
  }, [currentState]);

  const getCurrentState = useCallback(() => {
    return currentState;
  }, [currentState]);

  const actions: UndoRedoActions<T> = {
    canUndo,
    canRedo,
    undo,
    redo,
    pushState,
    clearHistory,
    getCurrentState
  };

  return [currentState, actions];
}

export default useUndoRedo;
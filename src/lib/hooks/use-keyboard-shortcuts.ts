'use client';

import { useEffect, useCallback } from 'react';

export type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
};

export interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = true
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatches = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatches = shortcut.ctrl
        ? (event.ctrlKey || event.metaKey)
        : !event.ctrlKey;
      const shiftMatches = (shortcut.shift || false) === event.shiftKey;
      const altMatches = (shortcut.alt || false) === event.altKey;
      const metaMatches = shortcut.meta
        ? event.metaKey
        : true;

      return keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches;
    });

    if (matchingShortcut) {
      if (preventDefault) event.preventDefault();
      if (stopPropagation) event.stopPropagation();
      matchingShortcut.action();
    }
  }, [shortcuts, enabled, preventDefault, stopPropagation]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);

  return {
    shortcuts: shortcuts.map(shortcut => ({
      ...shortcut,
      displayKey: formatShortcutDisplay(shortcut)
    }))
  };
}

function formatShortcutDisplay(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.meta) parts.push('Cmd');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.shift) parts.push('Shift');
  
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join(' + ');
}

// Common keyboard shortcuts for resume builder
export const createResumeBuilderShortcuts = (actions: {
  save: () => void;
  undo: () => void;
  redo: () => void;
  newSection: () => void;
  search: () => void;
  preview: () => void;
  help: () => void;
}): KeyboardShortcut[] => [
  {
    key: 's',
    ctrl: true,
    description: 'Save changes',
    action: actions.save
  },
  {
    key: 'z',
    ctrl: true,
    description: 'Undo',
    action: actions.undo
  },
  {
    key: 'y',
    ctrl: true,
    description: 'Redo',
    action: actions.redo
  },
  {
    key: 'z',
    ctrl: true,
    shift: true,
    description: 'Redo (alternative)',
    action: actions.redo
  },
  {
    key: 'n',
    ctrl: true,
    description: 'Add new section',
    action: actions.newSection
  },
  {
    key: 'f',
    ctrl: true,
    description: 'Search sections',
    action: actions.search
  },
  {
    key: 'p',
    ctrl: true,
    description: 'Preview resume',
    action: actions.preview
  },
  {
    key: 'F1',
    description: 'Show help',
    action: actions.help
  },
  {
    key: '?',
    shift: true,
    description: 'Show keyboard shortcuts',
    action: actions.help
  }
];

export default useKeyboardShortcuts;
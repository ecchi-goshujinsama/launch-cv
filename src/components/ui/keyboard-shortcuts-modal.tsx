'use client';

import * as React from 'react';
import { X, Keyboard, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from './launch-button';
import type { KeyboardShortcut } from '@/lib/hooks/use-keyboard-shortcuts';

export interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: (KeyboardShortcut & { displayKey: string })[];
  className?: string;
}

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
  shortcuts,
  className
}: KeyboardShortcutsModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
    
    return undefined;
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = getShortcutCategory(shortcut);
    if (!acc[category]) acc[category] = [];
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, (KeyboardShortcut & { displayKey: string })[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={cn(
        "bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-launch-blue/10 rounded-lg flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-launch-blue" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mission-text">Keyboard Shortcuts</h2>
              <p className="text-sm text-gray-600">Speed up your resume building with these shortcuts</p>
            </div>
          </div>
          <LaunchButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            icon="none"
          >
            <X className="w-5 h-5" />
          </LaunchButton>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-launch-blue" />
                  <h3 className="font-medium text-gray-900 capitalize">{category}</h3>
                </div>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                      <span className="text-sm text-gray-700">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.displayKey.split(' + ').map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="px-2 py-1 text-xs font-mono bg-white border border-gray-300 rounded shadow-sm">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.displayKey.split(' + ').length - 1 && (
                              <span className="text-xs text-gray-400">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mission-themed tip */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-launch-blue/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm">🚀</span>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Mission Control Pro Tip</h4>
                <p className="text-sm text-blue-800">
                  Master these shortcuts to build your resume at light speed! Your career launch 
                  will be more efficient and precise with these navigation commands.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Press <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded">Esc</kbd> or click outside to close
            </p>
            <LaunchButton
              variant="mission"
              size="sm"
              onClick={onClose}
              icon="rocket"
              iconPosition="right"
            >
              Launch Ready!
            </LaunchButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function getShortcutCategory(shortcut: KeyboardShortcut): string {
  const { key, description } = shortcut;
  
  if (description.toLowerCase().includes('save') || description.toLowerCase().includes('undo') || description.toLowerCase().includes('redo')) {
    return 'editing';
  }
  
  if (description.toLowerCase().includes('section') || description.toLowerCase().includes('new')) {
    return 'sections';
  }
  
  if (description.toLowerCase().includes('search') || description.toLowerCase().includes('preview')) {
    return 'navigation';
  }
  
  if (description.toLowerCase().includes('help') || key === 'F1') {
    return 'help';
  }
  
  return 'general';
}
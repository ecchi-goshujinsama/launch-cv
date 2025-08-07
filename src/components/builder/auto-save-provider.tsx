'use client';

import * as React from 'react';
import { createContext, useContext, useEffect } from 'react';
import { Save, RotateCcw, WifiOff, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { useFormAutoSave, useAutoSaveStatus, type AutoSaveStatus } from '@/lib/hooks/use-auto-save';

interface AutoSaveContextValue {
  status: AutoSaveStatus;
  lastSaved: Date | null;
  error: Error | null;
  save: () => void;
  retry: () => void;
  isEnabled: boolean;
  canRetry: boolean;
  retryCount: number;
  isOnline: boolean;
}

const AutoSaveContext = createContext<AutoSaveContextValue | null>(null);

export function useAutoSaveContext() {
  const context = useContext(AutoSaveContext);
  if (!context) {
    throw new Error('useAutoSaveContext must be used within an AutoSaveProvider');
  }
  return context;
}

interface AutoSaveProviderProps {
  children: React.ReactNode;
  formData: any;
  storageKey: string;
  apiSave?: (data: any) => Promise<void>;
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error, data: any) => void;
}

export function AutoSaveProvider({
  children,
  formData,
  storageKey,
  apiSave,
  enabled = true,
  onSuccess,
  onError
}: AutoSaveProviderProps) {
  const [isOnline, setIsOnline] = React.useState(true);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const autoSave = useFormAutoSave(formData, {
    storageKey,
    ...(apiSave && isOnline && { apiSave }), // Only include apiSave when both conditions are met
    enabled,
    ...(onSuccess && { onSuccess }),
    ...(onError && { onError }),
    delay: 1000
  });

  const contextValue: AutoSaveContextValue = {
    status: autoSave.status,
    lastSaved: autoSave.lastSaved,
    error: autoSave.error,
    save: autoSave.save,
    retry: autoSave.retry,
    isEnabled: autoSave.isEnabled,
    canRetry: autoSave.canRetry,
    retryCount: autoSave.retryCount,
    isOnline
  };

  return (
    <AutoSaveContext.Provider value={contextValue}>
      {children}
    </AutoSaveContext.Provider>
  );
}

// Auto-save status indicator component
interface AutoSaveIndicatorProps {
  className?: string;
  showText?: boolean;
  compact?: boolean;
}

export function AutoSaveIndicator({ 
  className, 
  showText = true, 
  compact = false 
}: AutoSaveIndicatorProps) {
  const { status, lastSaved, error, save, retry, isEnabled, canRetry, retryCount, isOnline } = useAutoSaveContext();
  const statusInfo = useAutoSaveStatus({ status, lastSaved, error, save, retry, isEnabled, canRetry, retryCount });

  if (!isEnabled) {
    return null;
  }

  const getStatusIcon = () => {
    if (!isOnline) {
      return <WifiOff className="w-4 h-4 text-amber-500" />;
    }
    
    switch (status) {
      case 'saving':
        return <Save className="w-4 h-4 text-amber-500 animate-pulse" />;
      case 'saved':
        return <Save className="w-4 h-4 text-green-500" />;
      case 'error':
        return <Save className="w-4 h-4 text-red-500" />;
      case 'idle':
      default:
        return lastSaved ? <Clock className="w-4 h-4 text-gray-400" /> : <Save className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    if (!isOnline) {
      return 'Working offline - changes saved locally';
    }
    return statusInfo.text;
  };

  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-2 py-1 rounded-md text-xs",
        statusInfo.color,
        className
      )}>
        {getStatusIcon()}
        {showText && <span>{getStatusText()}</span>}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between p-3 bg-gray-50 rounded-lg border", className)}>
      <div className="flex items-center gap-2 text-sm">
        {getStatusIcon()}
        <div>
          <div className={cn("font-medium", statusInfo.color)}>
            {getStatusText()}
          </div>
          {!isOnline && (
            <div className="text-xs text-amber-600 mt-1">
              Changes will sync when connection is restored
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Manual Save Button */}
        <LaunchButton
          variant="ghost"
          size="sm"
          onClick={save}
          disabled={status === 'saving'}
          icon="none"
        >
          <Save className="w-4 h-4 mr-1" />
          Save Now
        </LaunchButton>

        {/* Retry Button */}
        {status === 'error' && canRetry && (
          <LaunchButton
            variant="outline"
            size="sm"
            onClick={retry}
            icon="none"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Retry
          </LaunchButton>
        )}
      </div>
    </div>
  );
}

// Floating auto-save status for mobile
export function FloatingAutoSaveStatus({ className }: { className?: string }) {
  const { status, isEnabled, isOnline } = useAutoSaveContext();
  
  if (!isEnabled || (status === 'idle' && isOnline)) {
    return null;
  }

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 md:hidden",
      "bg-white border border-gray-200 rounded-lg shadow-lg p-2",
      "transform transition-all duration-300",
      status === 'saving' ? "scale-105" : "scale-100",
      className
    )}>
      <AutoSaveIndicator compact showText={false} />
    </div>
  );
}

// Hook to check if there's unsaved data in storage
export function useHasUnsavedData(storageKey: string) {
  const [hasUnsavedData, setHasUnsavedData] = React.useState(false);
  const [unsavedTimestamp, setUnsavedTimestamp] = React.useState<Date | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const { timestamp } = JSON.parse(stored);
        setHasUnsavedData(true);
        setUnsavedTimestamp(new Date(timestamp));
      } else {
        setHasUnsavedData(false);
        setUnsavedTimestamp(null);
      }
    } catch (error) {
      console.warn('Failed to check for unsaved data:', error);
      setHasUnsavedData(false);
      setUnsavedTimestamp(null);
    }
  }, [storageKey]);

  return { hasUnsavedData, unsavedTimestamp };
}

// Recovery banner for unsaved data
interface UnsavedDataBannerProps {
  storageKey: string;
  onRecover: (data: any) => void;
  onDiscard: () => void;
  className?: string;
}

export function UnsavedDataBanner({
  storageKey,
  onRecover,
  onDiscard,
  className
}: UnsavedDataBannerProps) {
  const { hasUnsavedData, unsavedTimestamp } = useHasUnsavedData(storageKey);

  const handleRecover = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const { data } = JSON.parse(stored);
        onRecover(data);
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('Failed to recover data:', error);
    }
  };

  const handleDiscard = () => {
    try {
      localStorage.removeItem(storageKey);
      onDiscard();
    } catch (error) {
      console.error('Failed to discard data:', error);
    }
  };

  if (!hasUnsavedData) {
    return null;
  }

  return (
    <div className={cn(
      "p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
          <Save className="w-3 h-3 text-amber-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-amber-900 mb-1">
            Unsaved Changes Found
          </h4>
          <p className="text-sm text-amber-800 mb-3">
            We found unsaved changes from {unsavedTimestamp?.toLocaleString()}. 
            Would you like to recover them?
          </p>
          <div className="flex gap-2">
            <LaunchButton
              variant="outline"
              size="sm"
              onClick={handleRecover}
              icon="none"
            >
              Recover Changes
            </LaunchButton>
            <LaunchButton
              variant="ghost"
              size="sm"
              onClick={handleDiscard}
              icon="none"
            >
              Start Fresh
            </LaunchButton>
          </div>
        </div>
      </div>
    </div>
  );
}
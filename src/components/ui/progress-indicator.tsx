'use client';

import * as React from 'react';
import { CheckCircle, Clock, AlertCircle, Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProgressIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  message?: string;
  showIcon?: boolean;
  className?: string;
  variant?: 'minimal' | 'detailed' | 'mission';
  lastSavedAt?: Date;
}

export function ProgressIndicator({
  status,
  message,
  showIcon = true,
  className,
  variant = 'detailed',
  lastSavedAt
}: ProgressIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <Loader2 className="w-3 h-3 animate-spin" />,
          color: 'text-amber-600',
          bgColor: 'bg-amber-100',
          dotColor: 'bg-amber-400',
          defaultMessage: 'Auto-saving changes...'
        };
      case 'saved':
        return {
          icon: <CheckCircle className="w-3 h-3" />,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          dotColor: 'bg-green-500',
          defaultMessage: 'All changes saved'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-3 h-3" />,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          dotColor: 'bg-red-500',
          defaultMessage: 'Error saving changes'
        };
      default:
        return {
          icon: <Clock className="w-3 h-3" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          dotColor: 'bg-gray-400',
          defaultMessage: 'Ready to save'
        };
    }
  };

  const config = getStatusConfig();
  const displayMessage = message || config.defaultMessage;

  const formatLastSaved = () => {
    if (!lastSavedAt) return '';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastSavedAt.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return lastSavedAt.toLocaleDateString();
  };

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className={cn('w-2 h-2 rounded-full', config.dotColor, {
          'animate-pulse': status === 'saving'
        })} />
      </div>
    );
  }

  if (variant === 'mission') {
    return (
      <div className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg border',
        config.bgColor,
        config.color,
        'border-current border-opacity-20',
        className
      )}>
        {showIcon && (
          status === 'saving' ? (
            <Zap className="w-4 h-4 animate-pulse text-launch-blue" />
          ) : (
            <div className={cn('w-2 h-2 rounded-full', config.dotColor)} />
          )
        )}
        <span className="text-sm font-medium mission-text">
          {status === 'saving' && '🚀 Mission Control: '}
          {status === 'saved' && '✅ Launch Ready: '}
          {status === 'error' && '⚠️ System Alert: '}
          {displayMessage}
        </span>
        {status === 'saved' && lastSavedAt && (
          <span className="text-xs opacity-75">
            • {formatLastSaved()}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2 text-sm', config.color, className)}>
      {showIcon && (
        status === 'saving' ? (
          config.icon
        ) : (
          <div className={cn('w-2 h-2 rounded-full', config.dotColor)} />
        )
      )}
      <span>{displayMessage}</span>
      {status === 'saved' && lastSavedAt && (
        <span className="text-xs opacity-75">
          • {formatLastSaved()}
        </span>
      )}
    </div>
  );
}
'use client';

import * as React from 'react';
import { Rocket, Menu, Settings, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';

interface MissionHeaderProps {
  title?: string;
  subtitle?: string;
  showSave?: boolean;
  showExport?: boolean;
  showSettings?: boolean;
  onSave?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
  className?: string;
}

export function MissionHeader({
  title = 'LaunchCV',
  subtitle = 'Mission Control Center',
  showSave = true,
  showExport = true,
  showSettings = true,
  onSave,
  onExport,
  onSettings,
  isSaving = false,
  lastSaved,
  className
}: MissionHeaderProps) {
  const formatLastSaved = (date: Date | null) => {
    if (!date) return null;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Saved just now';
    if (minutes < 60) return `Saved ${minutes}m ago`;
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className={cn(
      'bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40',
      className
    )}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left section - Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-launch-blue to-rocket-orange rounded-lg flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold brand-text-gradient">
                {title}
              </h1>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>
          
          {/* Save Status */}
          {showSave && (
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <div className="mission-status-indicator" />
              {isSaving ? (
                <span className="mission-text">Saving mission data...</span>
              ) : lastSaved ? (
                <span>{formatLastSaved(lastSaved)}</span>
              ) : (
                <span>Unsaved changes</span>
              )}
            </div>
          )}
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <LaunchButton 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            icon="none"
          >
            <Menu className="w-5 h-5" />
          </LaunchButton>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            {showSave && (
              <LaunchButton
                variant="outline"
                onClick={onSave}
                isLoading={isSaving}
                loadingText="Saving..."
                icon="none"
                size="sm"
              >
                <Save className="w-4 h-4" />
                Save Mission
              </LaunchButton>
            )}
            
            {showExport && (
              <LaunchButton
                variant="mission"
                onClick={onExport}
                icon="rocket"
                iconPosition="left"
                animation="rocket"
                size="sm"
              >
                Launch Resume
              </LaunchButton>
            )}
            
            {showSettings && (
              <LaunchButton
                variant="ghost"
                size="icon"
                onClick={onSettings}
                icon="none"
              >
                <Settings className="w-5 h-5" />
              </LaunchButton>
            )}
          </div>
        </div>
      </div>

      {/* Mobile save status */}
      {showSave && (
        <div className="md:hidden mt-2 flex items-center gap-2 text-sm text-gray-500">
          <div className="mission-status-indicator" />
          {isSaving ? (
            <span className="mission-text">Saving mission data...</span>
          ) : lastSaved ? (
            <span>{formatLastSaved(lastSaved)}</span>
          ) : (
            <span>Unsaved changes</span>
          )}
        </div>
      )}
    </header>
  );
}
'use client';

import * as React from 'react';
import { useResumeStore } from '@/lib/stores/resume-store';
import { ResumePreview } from './resume-preview';
import { cn } from '@/lib/utils';
import { 
  RefreshCw, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Eye,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';
// import { LaunchButton } from '@/components/ui/launch-button';

interface LivePreviewProps {
  className?: string;
  showControls?: boolean;
  initialScale?: number;
  previewMode?: 'desktop' | 'tablet' | 'mobile';
  onPreviewModeChange?: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  isMobile?: boolean;
  isTouchDevice?: boolean;
}

export function LivePreview({
  className,
  showControls = true,
  initialScale = 1,
  previewMode = 'desktop',
  onPreviewModeChange
}: LivePreviewProps) {
  const { currentResume, selectedTemplate, isDirty } = useResumeStore();
  const [scale, setScale] = React.useState(initialScale);
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastUpdate, setLastUpdate] = React.useState<Date | null>(null);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const previewRef = React.useRef<HTMLDivElement>(null);

  // Initialize date only on client to prevent hydration mismatch
  React.useEffect(() => {
    setLastUpdate(new Date());
    setIsHydrated(true);
  }, []);

  // Track resume changes for real-time updates
  React.useEffect(() => {
    setLastUpdate(new Date());
  }, [currentResume, selectedTemplate]);

  // Auto-refresh when data changes
  const refreshPreview = React.useCallback(() => {
    setLastUpdate(new Date());
    // Force re-render by triggering a state change
    setScale(prev => prev);
  }, []);

  // Zoom controls
  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setScale(1);

  // Preview mode utilities
  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 375;
      case 'tablet': return 768;
      case 'desktop': return '100%';
    }
  };

  const getPreviewIcon = (mode: 'desktop' | 'tablet' | 'mobile') => {
    switch (mode) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      case 'desktop': return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-gray-50", className)}>
      {/* Preview Controls */}
      {showControls && (
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-900">Live Preview</h3>
            {isDirty && (
              <div className="flex items-center gap-2 text-amber-600">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-xs">Updating...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Preview Mode Controls */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg mr-2">
              {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onPreviewModeChange?.(mode)}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
                    previewMode === mode 
                      ? "bg-white text-launch-blue shadow-sm" 
                      : "text-gray-600 hover:text-gray-800"
                  )}
                  title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} preview`}
                >
                  {getPreviewIcon(mode)}
                </button>
              ))}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={zoomOut}
                className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 min-w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={resetZoom}
                className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded ml-1"
                title="Reset zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Visibility Toggle */}
            <button
              onClick={() => setIsVisible(!isVisible)}
              className={cn(
                "p-1.5 rounded transition-colors ml-2",
                isVisible 
                  ? "text-launch-blue bg-launch-blue/10 hover:bg-launch-blue/20" 
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              )}
              title={isVisible ? "Hide preview" : "Show preview"}
            >
              {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>

            {/* Refresh Button */}
            <button
              onClick={refreshPreview}
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Refresh preview"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-4">
        {isVisible ? (
          <div 
            ref={previewRef}
            className="flex justify-center"
            style={{ 
              width: getPreviewWidth(),
              margin: previewMode !== 'desktop' ? '0 auto' : 'initial'
            }}
          >
            <div className="transform-gpu transition-transform duration-200">
              <ResumePreview 
                resume={currentResume}
                scale={scale}
                templateId={selectedTemplate}
                className="shadow-lg"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <EyeOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Preview Hidden</p>
              <p className="text-sm">Click the eye icon to show preview</p>
            </div>
          </div>
        )}
      </div>

      {/* Preview Status Footer */}
      <div className="px-4 py-2 bg-white border-t border-gray-200 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Template: {selectedTemplate || 'None'}</span>
            <span>Mode: {previewMode}</span>
            <span>Scale: {Math.round(scale * 100)}%</span>
          </div>
          <div>
            Last updated: {isHydrated && lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--:--'}
          </div>
        </div>
      </div>
    </div>
  );
}
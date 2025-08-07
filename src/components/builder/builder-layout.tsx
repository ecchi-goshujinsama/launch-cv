'use client';

import * as React from 'react';
import { useState } from 'react';
import { 
  PanelLeft, 
  PanelRight, 
  Monitor, 
  Smartphone, 
  Tablet,
  Maximize2,
  Minimize2,
  Eye,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionContainer } from '@/components/layout';

interface BuilderLayoutProps {
  formSection: React.ReactNode;
  previewSection: React.ReactNode;
  className?: string;
  onLayoutChange?: (layout: 'split' | 'form' | 'preview') => void;
  onPreviewModeChange?: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

type LayoutMode = 'split' | 'form' | 'preview';
type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export function BuilderLayout({
  formSection,
  previewSection,
  className,
  onLayoutChange,
  onPreviewModeChange
}: BuilderLayoutProps) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchFeedback, setTouchFeedback] = useState('');

  // Check for mobile screen size
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && layoutMode === 'split') {
        setLayoutMode('form');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [layoutMode]);

  // Enhanced mobile experience with touch feedback
  const showTouchFeedback = (message: string) => {
    setTouchFeedback(message);
    setTimeout(() => setTouchFeedback(''), 1500);
  };

  const handleLayoutChange = (newLayout: LayoutMode) => {
    setLayoutMode(newLayout);
    onLayoutChange?.(newLayout);
    
    // Mobile-friendly feedback
    if (isMobile) {
      const messages = {
        'form': 'Switched to Editor Mode 📝',
        'preview': 'Switched to Preview Mode 👁️', 
        'split': 'Split View Active'
      };
      showTouchFeedback(messages[newLayout]);
    }
  };

  const handlePreviewModeChange = (newMode: PreviewMode) => {
    setPreviewMode(newMode);
    onPreviewModeChange?.(newMode);
    
    // Mobile-friendly feedback for preview mode changes
    if (isMobile) {
      const messages = {
        'mobile': 'Mobile Preview 📱',
        'tablet': 'Tablet Preview 📱',
        'desktop': 'Desktop Preview 🖥️'
      };
      showTouchFeedback(messages[newMode]);
    }
  };

  const getPreviewStyles = () => {
    const baseStyles = "transition-all duration-300 border border-gray-300 bg-white rounded-lg shadow-sm overflow-hidden";
    
    switch (previewMode) {
      case 'mobile':
        return `${baseStyles} max-w-sm mx-auto ${isMobile ? 'w-full max-w-full' : ''}`;
      case 'tablet':
        return `${baseStyles} max-w-2xl mx-auto ${isMobile ? 'w-full max-w-full' : ''}`;
      case 'desktop':
      default:
        return `${baseStyles} w-full`;
    }
  };

  const getPreviewIcon = (mode: PreviewMode) => {
    switch (mode) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      case 'desktop': return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Layout Controls */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold mission-text">Mission Control</h2>
          <div className="hidden md:flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => handleLayoutChange('form')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors",
                layoutMode === 'form' 
                  ? "bg-white text-launch-blue shadow-sm" 
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              <Edit3 className="w-4 h-4" />
              Form Only
            </button>
            <button
              onClick={() => handleLayoutChange('split')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors",
                layoutMode === 'split' 
                  ? "bg-white text-launch-blue shadow-sm" 
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              <PanelLeft className="w-4 h-4" />
              Split View
            </button>
            <button
              onClick={() => handleLayoutChange('preview')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors",
                layoutMode === 'preview' 
                  ? "bg-white text-launch-blue shadow-sm" 
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              <Eye className="w-4 h-4" />
              Preview Only
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Preview Mode Controls */}
          {(layoutMode === 'preview' || layoutMode === 'split') && (
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              {(['desktop', 'tablet', 'mobile'] as PreviewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handlePreviewModeChange(mode)}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
                    previewMode === mode 
                      ? "bg-white text-launch-blue shadow-sm" 
                      : "text-gray-600 hover:text-gray-800"
                  )}
                  title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
                >
                  {getPreviewIcon(mode)}
                </button>
              ))}
            </div>
          )}

          {/* Mobile Layout Toggle - Enhanced */}
          <div className="md:hidden flex items-center gap-1">
            <LaunchButton
              variant={layoutMode === 'form' ? 'mission' : 'ghost'}
              size="sm"
              onClick={() => handleLayoutChange('form')}
              icon="none"
              className="touch-target"
              title="Switch to Form Editor"
            >
              <Edit3 className="w-4 h-4" />
              {isMobile && <span className="ml-1 text-xs">Edit</span>}
            </LaunchButton>
            <LaunchButton
              variant={layoutMode === 'preview' ? 'mission' : 'ghost'}
              size="sm"
              onClick={() => handleLayoutChange('preview')}
              icon="none"
              className="touch-target"
              title="Switch to Preview"
            >
              <Eye className="w-4 h-4" />
              {isMobile && <span className="ml-1 text-xs">View</span>}
            </LaunchButton>
          </div>

          {/* Sidebar Collapse (for split view) */}
          {layoutMode === 'split' && !isMobile && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Form Section */}
        <div className={cn(
          "transition-all duration-300 flex flex-col",
          layoutMode === 'preview' ? 'hidden' : '',
          layoutMode === 'split' ? (
            sidebarCollapsed ? 'w-12' : 'w-full md:w-1/2 lg:w-2/5'
          ) : 'w-full',
          "border-r border-gray-200"
        )}>
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center py-4">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100"
                title="Expand form panel"
              >
                <PanelRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <MissionContainer maxWidth="full" padding="md" background="transparent">
                {formSection}
              </MissionContainer>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className={cn(
          "transition-all duration-300 flex flex-col",
          layoutMode === 'form' ? 'hidden' : '',
          layoutMode === 'split' ? (
            sidebarCollapsed ? 'w-full' : 'w-full md:w-1/2 lg:w-3/5'
          ) : 'w-full',
          "bg-gray-50"
        )}>
          <div className="flex-1 overflow-auto p-4">
            <div className="h-full flex items-start justify-center">
              <div className={getPreviewStyles()}>
                <div className="h-full min-h-[600px]">
                  {previewSection}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Footer */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <span>Preview Mode: </span>
              <span className="ml-2 font-medium capitalize">{previewMode}</span>
              {previewMode === 'mobile' && (
                <span className="ml-2 text-xs text-gray-500">(375px)</span>
              )}
              {previewMode === 'tablet' && (
                <span className="ml-2 text-xs text-gray-500">(768px)</span>
              )}
              {previewMode === 'desktop' && (
                <span className="ml-2 text-xs text-gray-500">(1024px+)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Touch Feedback Toast - Mobile Only */}
      {touchFeedback && isMobile && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-full text-sm shadow-lg transition-all duration-300">
          {touchFeedback}
        </div>
      )}
    </div>
  );
}
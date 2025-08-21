'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronRight,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  Settings,
  Eye,
  Save,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SectionType } from './section-manager';

interface MobileSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSection?: string;
  onSectionChange: (sectionId: string) => void;
  sections: Array<{
    id: string;
    type: SectionType;
    title: string;
    visible: boolean;
    isComplete?: boolean;
    hasErrors?: boolean;
  }>;
  onPreviewToggle: () => void;
  onSave?: () => void;
  autoSaveStatus?: 'saving' | 'saved' | 'error';
  className?: string;
}

const sectionIcons: Record<SectionType, React.ElementType> = {
  personalInfo: User,
  summary: FileText,
  experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  projects: FolderOpen,
  certifications: Settings,
  awards: Settings,
  languages: Settings,
  custom: Settings
};

export function MobileSidebar({
  isOpen,
  onToggle,
  activeSection,
  onSectionChange,
  sections,
  onPreviewToggle,
  onSave,
  autoSaveStatus = 'saved',
  className
}: MobileSidebarProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const getSectionIcon = (type: SectionType) => {
    const IconComponent = sectionIcons[type];
    return <IconComponent className="w-4 h-4" />;
  };

  const getAutoSaveIcon = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />;
      case 'saved':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const getAutoSaveText = () => {
    switch (autoSaveStatus) {
      case 'saving': return 'Saving...';
      case 'saved': return 'All changes saved';
      case 'error': return 'Save failed';
      default: return 'Auto-save off';
    }
  };

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
    onToggle(); // Close sidebar after selection on mobile
  };

  return (
    <>
      {/* Overlay */}
      {(isOpen || isAnimating) && (
        <div 
          className={cn(
            "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-launch-blue to-launch-blue/90">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Menu className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-white">Mission Control</h2>
            </div>
            <button
              onClick={onToggle}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section Navigation */}
          <div className="flex-1 overflow-y-auto py-2">
            <div className="px-2 mb-4">
              <h3 className="text-sm font-medium text-gray-900 px-3 py-2">Resume Sections</h3>
              <div className="space-y-1">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      type="button"
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                        isActive 
                          ? "bg-launch-blue text-white" 
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <div className={cn(
                        "flex-shrink-0",
                        isActive ? "text-white" : "text-gray-500"
                      )}>
                        {getSectionIcon(section.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{section.title}</div>
                        <div className={cn(
                          "text-xs",
                          isActive ? "text-white/80" : "text-gray-500"
                        )}>
                          {section.visible ? 'Visible' : 'Hidden'} • 
                          {section.isComplete ? ' Complete' : ' In Progress'}
                        </div>
                      </div>
                      
                      {/* Status Indicators */}
                      <div className="flex items-center gap-1">
                        {section.hasErrors && (
                          <div className="w-2 h-2 bg-red-400 rounded-full" />
                        )}
                        {section.isComplete && !section.hasErrors && (
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                        )}
                        <ChevronRight className={cn(
                          "w-4 h-4",
                          isActive ? "text-white" : "text-gray-400"
                        )} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-2">
                <button
                  type="button"
                  onClick={() => {
                    onPreviewToggle();
                    onToggle();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4 text-gray-500" aria-hidden="true" focusable="false" />
                  <span>Toggle Preview</span>
                </button>
                  <span>Toggle Preview</span>
                </button>
                
                {onSave && (
                  <button
                    onClick={() => {
                      onSave();
                      onToggle();
                    }}
                    disabled={autoSaveStatus === 'saving'}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 disabled:opacity-50 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4 text-gray-500" />
                    <span>Save Changes</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            {/* Auto-save Status */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getAutoSaveIcon()}
                <span>{getAutoSaveText()}</span>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">
                Section Progress
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-launch-blue rounded-full h-2 transition-all duration-300"
                  style={{ 
                    width: `${Math.round((sections.filter(s => s.isComplete).length / sections.length) * 100)}%` 
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {sections.filter(s => s.isComplete).length} of {sections.length} complete
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook for mobile sidebar management
export function useMobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false); // Close sidebar when switching to desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggle = () => setIsOpen(!isOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    isMobile,
    toggle,
    open,
    close
  };
}
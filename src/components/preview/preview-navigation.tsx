'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/lib/stores/resume-store';
import {
  // ChevronUp,
  // ChevronDown,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Award,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff
} from 'lucide-react';

interface PreviewNavigationProps {
  className?: string;
  onSectionClick?: (sectionId: string) => void;
  onScrollToTop?: () => void;
  onScrollToBottom?: () => void;
  showMinimap?: boolean;
}

export function PreviewNavigation({
  className,
  onSectionClick,
  onScrollToTop,
  onScrollToBottom,
  showMinimap = true
}: PreviewNavigationProps) {
  const { currentResume, toggleSectionVisibility } = useResumeStore();


  if (!currentResume) {
    return null;
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'personal': return <User className="w-4 h-4" />;
      case 'experience': return <Briefcase className="w-4 h-4" />;
      case 'education': return <GraduationCap className="w-4 h-4" />;
      case 'skills': return <Code className="w-4 h-4" />;
      case 'projects': return <FolderOpen className="w-4 h-4" />;
      case 'certifications': return <Award className="w-4 h-4" />;
      default: return <Plus className="w-4 h-4" />;
    }
  };

  const allSections = [
    {
      id: 'personal',
      type: 'personal',
      title: 'Personal Info',
      visible: true,
      items: 1
    },
    ...currentResume.sections.map(section => ({
      id: section.id,
      type: section.type,
      title: section.title,
      visible: section.visible,
      items: section.items.length
    }))
  ];

  return (
    <div className={cn("flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm", className)}>
      {/* Header */}
      <div className="p-3 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-900">Resume Navigation</h3>
      </div>

      {/* Scroll Controls */}
      <div className="p-2 border-b border-gray-100">
        <div className="flex justify-center gap-1">
          <button
            onClick={onScrollToTop}
            className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={onScrollToBottom}
            className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Scroll to bottom"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex-1 overflow-auto">
        <div className="p-2 space-y-1">
          {allSections.map((section) => (
            <div key={section.id} className="group">
              <button
                onClick={() => onSectionClick?.(section.id)}
                className={cn(
                  "w-full flex items-center justify-between p-2 text-left rounded-md transition-colors",
                  "hover:bg-gray-50",
                  "hover:bg-gray-50",
                  !section.visible && "opacity-50"
                  !section.visible && "opacity-50"
                )}
              >
                <div className="flex items-center gap-2 flex-1">
                  {getSectionIcon(section.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {section.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {section.items} item{section.items !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {section.type !== 'personal' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionVisibility(section.id);
                    }}
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded transition-colors opacity-0 group-hover:opacity-100",
                      section.visible 
                        ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    )}
                    title={section.visible ? "Hide section" : "Show section"}
                  >
                    {section.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Minimap */}
      {showMinimap && (
        <div className="p-3 border-t border-gray-100">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-700 mb-2">Page Overview</p>
            <div className="relative h-24 bg-gray-50 rounded border">
              {/* Simple minimap visualization */}
              <div className="absolute inset-1 space-y-px">
                {allSections.filter(s => s.visible).map((section) => (
                  <div
                    key={section.id}
                    className={cn(
                      "h-2 rounded-sm transition-colors cursor-pointer",
                      "bg-gray-300 hover:bg-gray-400",
                      !section.visible && "opacity-30"
                      activeSection === section.id ? "bg-launch-blue" : "bg-gray-300 hover:bg-gray-400",
                      !section.visible && "opacity-30"
                    )}
                    onClick={() => onSectionClick?.(section.id)}
                    title={section.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="p-2 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>{allSections.filter(s => s.visible).length} sections visible</span>
          <span>{allSections.reduce((sum, s) => sum + (s.visible ? s.items : 0), 0)} total items</span>
        </div>
      </div>
    </div>
  );
}
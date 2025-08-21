'use client';

import * as React from 'react';
import { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  ToggleLeft,
  ToggleRight,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionCard } from '@/components/layout';
import type { ResumeSection } from './section-manager';

interface SectionVisibilityControlProps {
  sections: ResumeSection[];
  onToggleSection: (sectionId: string) => void;
  onToggleAll: (visible: boolean) => void;
  onResetToDefaults: () => void;
  className?: string;
}

export function SectionVisibilityControl({
  sections,
  onToggleSection,
  onToggleAll,
  onResetToDefaults,
  className
}: SectionVisibilityControlProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const visibleSections = sections.filter(s => s.visible);
  const hiddenSections = sections.filter(s => !s.visible);
  const allVisible = visibleSections.length === sections.length;
  const noneVisible = visibleSections.length === 0;

  const getSectionIcon = (type: ResumeSection['type']) => {
    switch (type) {
      case 'personalInfo': return '👤';
      case 'summary': return '📄';
      case 'experience': return '💼';
      case 'education': return '🎓';
      case 'skills': return '🔧';
      case 'projects': return '🚀';
      case 'certifications': return '🏆';
      case 'awards': return '🥇';
      case 'languages': return '🌍';
      case 'custom': return '📝';
      default: return '📋';
    }
  };

  const getSectionImportance = (section: ResumeSection) => {
    if (section.required) return 'critical';
    if (['experience', 'education', 'skills'].includes(section.type)) return 'important';
    return 'optional';
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'important': return 'text-amber-600 bg-amber-50';
      case 'optional': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getVisibilityRecommendation = () => {
    const requiredHidden = sections.filter(s => s.required && !s.visible).length;
    const importantHidden = sections.filter(s => 
      ['experience', 'education', 'skills'].includes(s.type) && !s.visible
    ).length;

    if (requiredHidden > 0) {
      return {
        type: 'error',
        message: `${requiredHidden} required section(s) are hidden. These sections are essential for a complete resume.`
      };
    }

    if (importantHidden > 0) {
      return {
        type: 'warning',
        message: `${importantHidden} important section(s) are hidden. Consider including these for a stronger resume.`
      };
    }

    if (visibleSections.length < 4) {
      return {
        type: 'info',
        message: 'Your resume has few visible sections. Consider adding more content to showcase your qualifications.'
      };
    }

    return {
      type: 'success',
      message: 'Good section visibility balance for a comprehensive resume.'
    };
  };

  const recommendation = getVisibilityRecommendation();

  return (
    <MissionCard variant="elevated" className={cn('', className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-launch-blue/10 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-launch-blue" />
                <li>• Required sections cannot be completely hidden</li>
            <div>
              <h3 className="text-lg font-semibold mission-text">Section Visibility</h3>
              <p className="text-sm text-gray-600">Control which sections appear on your resume</p>
            </div>
          </div>

          <LaunchButton
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            icon="none"
          >
            <Settings className="w-4 h-4 mr-2" />
            {showAdvanced ? 'Simple View' : 'Advanced'}
          </LaunchButton>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{visibleSections.length}</div>
            <div className="text-xs text-green-600">Visible</div>
          </div>
          <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">{hiddenSections.length}</div>
            <div className="text-xs text-gray-600">Hidden</div>
          </div>
          <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{sections.filter(s => s.required).length}</div>
            <div className="text-xs text-blue-600">Required</div>
          </div>
          <div className="text-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">{sections.filter(s => !s.required).length}</div>
            <div className="text-xs text-purple-600">Optional</div>
          </div>
        </div>

        {/* Recommendation */}
        <div className={cn(
          "p-3 rounded-lg border flex items-start gap-2",
          recommendation.type === 'error' && "bg-red-50 border-red-200",
          recommendation.type === 'warning' && "bg-amber-50 border-amber-200",
          recommendation.type === 'info' && "bg-blue-50 border-blue-200",
          recommendation.type === 'success' && "bg-green-50 border-green-200"
        )}>
          {recommendation.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />}
          {recommendation.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />}
          {recommendation.type === 'info' && <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />}
          {recommendation.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />}
          <div className={cn(
            "text-sm",
            recommendation.type === 'error' && "text-red-800",
            recommendation.type === 'warning' && "text-amber-800",
            recommendation.type === 'info' && "text-blue-800",
            recommendation.type === 'success' && "text-green-800"
          )}>
            {recommendation.message}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <LaunchButton
            variant="outline"
            size="sm"
            onClick={() => onToggleAll(true)}
            disabled={allVisible}
            icon="none"
          >
            <Eye className="w-4 h-4 mr-2" />
            Show All
          </LaunchButton>
          <LaunchButton
            variant="outline"
            size="sm"
          <LaunchButton
            variant="outline"
            size="sm"
            onClick={() => {
              sections.forEach(section => {
                if (!section.required && section.visible) {
                  onToggleSection(section.id);
                }
              });
            }}
            disabled={sections.filter(s => !s.required && s.visible).length === 0}
            icon="none"
          >
            <EyeOff className="w-4 h-4 mr-2" />
            Hide All Optional
          </LaunchButton>
          <LaunchButton
            variant="outline"
            size="sm"
            onClick={onResetToDefaults}
            icon="none"
          >
            <ToggleLeft className="w-4 h-4 mr-2" />
            Reset to Defaults
          </LaunchButton>
        </div>

        {/* Section List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Individual Sections</h4>
          
          <div className="space-y-2">
            {sections.map((section) => {
              const importance = getSectionImportance(section);
              
              return (
                <div
                  key={section.id}
                  className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg transition-all",
                    section.visible ? "border-gray-200 bg-white" : "border-gray-200 bg-gray-50"
                  )}
                >
                  {/* Section Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg">{getSectionIcon(section.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{section.title}</span>
                        {showAdvanced && (
                          <span className={cn(
                            "px-2 py-1 text-xs rounded-full",
                            getImportanceColor(importance)
                          )}>
                            {importance}
                          </span>
                        )}
                        {section.required && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      {showAdvanced && (
                        <div className="text-xs text-gray-500 mt-1">
                          Order: {section.order + 1} | 
                          {section.visible ? ' Visible in resume' : ' Hidden from resume'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visibility Toggle */}
                  <button
                    onClick={() => onToggleSection(section.id)}
                    disabled={section.required && section.visible} // Cannot hide required sections
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                      section.visible
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200",
                      section.required && section.visible && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {section.visible ? (
                      <>
                        <ToggleRight className="w-4 h-4" />
                        <span className="text-sm font-medium">Visible</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Hidden</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span>
            Visibility Tips
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Required sections (Personal Info, Experience, Education) cannot be completely hidden</li>
            <li>• Hide sections you don&apos;t want to include rather than leaving them empty</li>
            <li>• Consider your target role when deciding which sections to show</li>
            <li>• A resume typically works best with 4-7 visible sections</li>
          </ul>
        </div>
      </div>
    </MissionCard>
  );
}
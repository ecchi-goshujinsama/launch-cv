'use client';

import * as React from 'react';
import { useState } from 'react';
import { 
  Plus, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown, 
  GripVertical,
  Settings,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionCard } from '@/components/layout';

export type SectionType = 
  | 'personalInfo'
  | 'summary' 
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'languages'
  | 'custom';

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  required: boolean;
  order: number;
  data?: any;
}

interface SectionManagerProps {
  sections: ResumeSection[];
  onSectionUpdate: (sections: ResumeSection[]) => void;
  onSectionAdd: (type: SectionType) => void;
  onSectionRemove: (id: string) => void;
  onSectionToggle: (id: string) => void;
  onSectionReorder: (sections: ResumeSection[]) => void;
  className?: string;
}

// Available section types that can be added
const availableSections: Array<{
  type: SectionType;
  title: string;
  description: string;
  icon: string;
  category: 'core' | 'optional' | 'custom';
}> = [
  {
    type: 'projects',
    title: 'Projects',
    description: 'Showcase your personal or professional projects',
    icon: '🚀',
    category: 'core'
  },
  {
    type: 'certifications',
    title: 'Certifications',
    description: 'Professional certifications and credentials',
    icon: '🏆',
    category: 'core'
  },
  {
    type: 'awards',
    title: 'Awards & Honors',
    description: 'Recognition and achievements',
    icon: '🥇',
    category: 'optional'
  },
  {
    type: 'languages',
    title: 'Languages',
    description: 'Spoken languages and proficiency levels',
    icon: '🌍',
    category: 'optional'
  },
  {
    type: 'custom',
    title: 'Custom Section',
    description: 'Create a personalized section',
    icon: '📝',
    category: 'custom'
  }
];

export function SectionManager({
  sections,
  // onSectionUpdate,
  onSectionAdd,
  onSectionRemove,
  onSectionToggle,
  onSectionReorder,
  className
}: SectionManagerProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);

  // Get sections that can be added (not already present)
  const addableSections = availableSections.filter(
    available => !sections.some(section => section.type === available.type)
  );

  const handleSectionMove = (sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;

    if (targetIndex < 0 || targetIndex >= sections.length) return;

    // Swap sections
    const sectionA = newSections[sectionIndex];
    const sectionB = newSections[targetIndex];
    if (sectionA && sectionB) {
      newSections[sectionIndex] = sectionB;
      newSections[targetIndex] = sectionA;
    }

    // Update order property
    newSections.forEach((section, index) => {
      section.order = index;
    });

    onSectionReorder(newSections);
  };

  const handleAddSection = (type: SectionType) => {
    onSectionAdd(type);
    setShowAddMenu(false);
  };

  const handleRemoveSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section && !section.required) {
      onSectionRemove(sectionId);
    }
  };

  const getSectionIcon = (type: SectionType) => {
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

  const getSectionDescription = (type: SectionType) => {
    switch (type) {
      case 'personalInfo': return 'Contact information and basic details';
      case 'summary': return 'Professional summary and career objectives';
      case 'experience': return 'Work history and professional experience';
      case 'education': return 'Educational background and qualifications';
      case 'skills': return 'Technical and professional skills';
      case 'projects': return 'Personal and professional projects';
      case 'certifications': return 'Professional certifications and credentials';
      case 'awards': return 'Awards, honors, and recognition';
      case 'languages': return 'Spoken languages and proficiency levels';
      case 'custom': return 'Custom section content';
      default: return 'Resume section';
    }
  };

  return (
    <MissionCard variant="elevated" className={cn('', className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-launch-blue/10 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-launch-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mission-text">Section Management</h3>
              <p className="text-sm text-gray-600">Organize and customize your resume sections</p>
            </div>
          </div>
          
          <div className="relative">
            <LaunchButton
              variant="outline"
              size="sm"
              onClick={() => setShowAddMenu(!showAddMenu)}
              icon="none"
              disabled={addableSections.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </LaunchButton>

            {/* Add Section Dropdown */}
            {showAddMenu && addableSections.length > 0 && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-3 border-b border-gray-100">
                  <h4 className="font-medium text-gray-900">Add New Section</h4>
                  <p className="text-xs text-gray-500 mt-1">Choose a section to add to your resume</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {addableSections.map((section) => (
                    <button
                      key={section.type}
                      onClick={() => handleAddSection(section.type)}
                      className="w-full p-3 text-left hover:bg-gray-50 flex items-start gap-3 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-lg">{section.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{section.title}</div>
                        <div className="text-xs text-gray-600 mt-1">{section.description}</div>
                      </div>
                      <div className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        section.category === 'core' ? "bg-blue-100 text-blue-700" :
                        section.category === 'optional' ? "bg-green-100 text-green-700" :
                        "bg-purple-100 text-purple-700"
                      )}>
                        {section.category}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current Sections */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Current Sections ({sections.length})
          </h4>
          
          <div className="space-y-2">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={cn(
                  "flex items-center gap-3 p-3 border rounded-lg transition-colors",
                  section.visible ? "border-gray-200 bg-white" : "border-gray-200 bg-gray-50",
                  draggedSection === section.id && "border-launch-blue bg-launch-blue/5"
                )}
                draggable
                onDragStart={() => setDraggedSection(section.id)}
                onDragEnd={() => setDraggedSection(null)}
              >
                {/* Drag Handle */}
                <button
                  className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <GripVertical className="w-4 h-4" />
                </button>

                {/* Section Icon & Info */}
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-lg">{getSectionIcon(section.type)}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{section.title}</div>
                    <div className="text-xs text-gray-500">{getSectionDescription(section.type)}</div>
                  </div>
                </div>

                {/* Section Controls */}
                <div className="flex items-center gap-1">
                  {/* Move Up/Down */}
                  <button
                    onClick={() => handleSectionMove(section.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSectionMove(section.id, 'down')}
                    disabled={index === sections.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Visibility Toggle */}
                  <button
                    onClick={() => onSectionToggle(section.id)}
                    className={cn(
                      "p-1 transition-colors",
                      section.visible 
                        ? "text-green-500 hover:text-green-600" 
                        : "text-gray-400 hover:text-gray-500"
                    )}
                  >
                    {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Remove Section (only for non-required sections) */}
                  {!section.required && (
                    <button
                      onClick={() => handleRemoveSection(section.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Required Section Indicator */}
                  {section.required && (
                    <div className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      Required
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span>
            Section Management Tips
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Drag sections to reorder them on your resume</li>
            <li>• Use the eye icon to show/hide sections without deleting them</li>
            <li>• Required sections (Personal Info, Experience, Education) cannot be removed</li>
            <li>• Add custom sections for unique content like publications or volunteering</li>
          </ul>
        </div>

        {/* Warning for Hidden Sections */}
        {sections.some(s => !s.visible) && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <strong>Note:</strong> You have {sections.filter(s => !s.visible).length} hidden section(s). 
              They won&apos;t appear on your final resume unless you make them visible.
            </div>
          </div>
        )}
      </div>
    </MissionCard>
  );
}
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { LaunchButton } from '@/components/ui/launch-button';
import { MissionCard } from '@/components/layout';
import type { TemplatePreviewProps, Template } from '@/lib/types/template';
import type { Resume } from '@/lib/types';
import { 
  Eye, 
  Star, 
  Award,
  Smartphone,
  Printer,
  CheckCircle
} from 'lucide-react';

// Sample resume data for template previews
const sampleResumeData: Resume = {
  id: 'sample',
  title: 'Sample Resume',
  templateId: '',
  personalInfo: {
    fullName: 'Jane Doe',
    email: 'jane.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/janedoe',
    website: 'janedoe.com',
    summary: 'Experienced software engineer with a passion for building scalable applications and leading high-performing teams.'
  },
  sections: [
    {
      id: '1',
      type: 'experience',
      title: 'Experience',
      order: 0,
      visible: true,
      items: [
        {
          id: '1',
          company: 'Tech Company',
          position: 'Senior Software Engineer',
          startDate: '2022-01',
          endDate: null,
          location: 'San Francisco, CA',
          description: ['Led team of 5 developers', 'Improved system performance by 40%'],
          skills: ['React', 'Node.js', 'PostgreSQL']
        }
      ]
    },
    {
      id: '2',
      type: 'education',
      title: 'Education',
      order: 1,
      visible: true,
      items: [
        {
          id: '1',
          institution: 'University of California',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2016-09',
          endDate: '2020-05',
          location: 'Berkeley, CA'
        }
      ]
    },
    {
      id: '3',
      type: 'skills',
      title: 'Skills',
      order: 2,
      visible: true,
      items: [
        {
          id: '1',
          category: 'Frontend',
          skills: ['React', 'TypeScript', 'Next.js']
        },
        {
          id: '2',
          category: 'Backend',
          skills: ['Node.js', 'PostgreSQL', 'GraphQL']
        }
      ]
    }
  ],
  metadata: {
    lastEdited: new Date(),
    version: 1,
    exportCount: 0,
    wordCount: 150
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

interface TemplateCardProps {
  template: Template;
  isSelected?: boolean;
  onSelect?: () => void;
  onPreview?: () => void;
  size?: 'small' | 'medium' | 'large';
  showInfo?: boolean;
  className?: string;
}

export function TemplateCard({
  template,
  isSelected = false,
  onSelect,
  onPreview,
  size = 'medium',
  showInfo = true,
  className
}: TemplateCardProps) {
  const sizeStyles = {
    small: 'w-32 h-40',
    medium: 'w-48 h-60',
    large: 'w-64 h-80'
  };

  return (
    <MissionCard 
      className={cn(
        'transition-all duration-300 hover:shadow-lg cursor-pointer group p-3',
        isSelected && 'ring-2 ring-launch-blue shadow-lg',
        sizeStyles[size],
        className
      )}
      variant={isSelected ? 'elevated' : 'default'}
      {...(onSelect && { onClick: onSelect })}
    >
      {/* Preview Image */}
      <div className={cn(
        'relative overflow-hidden rounded-md bg-gray-100 flex-1 mb-3',
        'group-hover:scale-105 transition-transform duration-300'
      )}>
        {/* Placeholder for template preview */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${template.colorScheme.background.primary} 0%, ${template.colorScheme.background.secondary} 100%)`
          }}
        >
          <div className="text-center space-y-1 p-2">
            <div 
              className="text-sm font-semibold"
              style={{ color: template.colorScheme.text.primary }}
            >
              {sampleResumeData.personalInfo.fullName}
            </div>
            <div 
              className="text-xs"
              style={{ color: template.colorScheme.text.secondary }}
            >
              {sampleResumeData.personalInfo.email}
            </div>
            <div className="space-y-1 mt-2">
              <div 
                className="h-1 rounded"
                style={{ backgroundColor: template.colorScheme.primary }}
              />
              <div 
                className="h-1 rounded w-3/4"
                style={{ backgroundColor: template.colorScheme.secondary }}
              />
              <div 
                className="h-1 rounded w-1/2"
                style={{ backgroundColor: template.colorScheme.accent }}
              />
            </div>
          </div>
        </div>

        {/* Template Features Overlay */}
        <div className="absolute top-2 right-2 flex gap-1">
          {template.isAtsCompatible && (
            <div 
              className="p-1 rounded-full bg-green-100 text-green-600" 
              title="ATS Compatible"
            >
              <CheckCircle className="w-3 h-3" />
            </div>
          )}
          {template.isMobileResponsive && (
            <div 
              className="p-1 rounded-full bg-blue-100 text-blue-600" 
              title="Mobile Responsive"
            >
              <Smartphone className="w-3 h-3" />
            </div>
          )}
          {template.isPrintFriendly && (
            <div 
              className="p-1 rounded-full bg-purple-100 text-purple-600" 
              title="Print Friendly"
            >
              <Printer className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <LaunchButton
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onPreview?.();
              }}
              icon="none"
              className="bg-white text-gray-700 hover:bg-gray-50"
            >
              <Eye className="w-4 h-4" />
            </LaunchButton>
            <LaunchButton
              size="sm"
              variant="mission"
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.();
              }}
              icon="rocket"
            >
              Select
            </LaunchButton>
          </div>
        </div>
      </div>

      {/* Template Info */}
      {showInfo && (
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {template.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="capitalize">{template.category}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-yellow-400" />
                <span>{template.metadata.rating}</span>
              </div>
            </div>
          </div>
          
          {size === 'large' && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {template.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {template.metadata.tags.slice(0, 2).map(tag => (
                <span 
                  key={tag}
                  className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {template.difficulty === 'advanced' && (
              <div title="Advanced Template">
                <Award className="w-3 h-3 text-orange-500" />
              </div>
            )}
          </div>
        </div>
      )}
    </MissionCard>
  );
}

export function TemplatePreview({
  template,
  sampleData = sampleResumeData,
  customizations,
  size = 'medium',
  interactive = false,
  showInfo = true,
  ...props
}: TemplatePreviewProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const appliedColorScheme = customizations?.colorScheme 
    ? { ...template.colorScheme, ...customizations.colorScheme }
    : template.colorScheme;

  const appliedTypography = customizations?.typography
    ? { ...template.typography, ...customizations.typography }
    : template.typography;

  return (
    <div 
      className={cn(
        'relative transition-all duration-300',
        interactive && 'hover:scale-105 cursor-pointer',
        size === 'small' && 'w-32 h-40',
        size === 'medium' && 'w-48 h-60',  
        size === 'large' && 'w-64 h-80'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div 
        className="w-full h-full border-2 border-gray-200 rounded-lg shadow-sm overflow-hidden"
        style={{
          backgroundColor: appliedColorScheme.background.primary,
          borderColor: appliedColorScheme.borders
        }}
      >
        {/* Template Preview Content */}
        <div className="p-3 space-y-2">
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 
              className="text-lg font-bold truncate"
              style={{ 
                color: appliedColorScheme.text.primary,
                fontFamily: appliedTypography.headings.fontFamily,
                fontSize: size === 'small' ? '14px' : size === 'medium' ? '16px' : '18px'
              }}
            >
              {sampleData.personalInfo.fullName}
            </h1>
            <div 
              className="text-xs"
              style={{ color: appliedColorScheme.text.secondary }}
            >
              {sampleData.personalInfo.email} • {sampleData.personalInfo.phone}
            </div>
          </div>

          {/* Section Lines */}
          <div className="space-y-2 mt-3">
            <div 
              className="h-0.5 rounded"
              style={{ backgroundColor: appliedColorScheme.primary }}
            />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div 
                  className="h-0.5 rounded"
                  style={{ 
                    backgroundColor: appliedColorScheme.secondary,
                    width: `${80 - i * 10}%`
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Hover Overlay */}
        {interactive && isHovered && (
          <div className="absolute inset-0 bg-launch-blue bg-opacity-10 flex items-center justify-center">
            <div className="text-center">
              <Eye className="w-6 h-6 text-launch-blue mx-auto mb-1" />
              <span className="text-xs text-launch-blue font-medium">Preview</span>
            </div>
          </div>
        )}
      </div>

      {/* Template Info */}
      {showInfo && (
        <div className="mt-2 text-center">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {template.name}
          </h3>
          <p className="text-xs text-gray-500 capitalize">
            {template.category}
          </p>
        </div>
      )}
    </div>
  );
}

export default TemplatePreview;